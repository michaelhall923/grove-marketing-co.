// Lovable Cloud edge function: contact form
// - Validates input with zod
// - Verifies reCAPTCHA v3
// - Logs every submission to public.contact_submissions
// - Sends email via SMTP (nodemailer)

import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";
import nodemailer from "npm:nodemailer@6.9.14";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const ContactSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email_address: z.string().email("Valid email required"),
  phone_number: z.string().min(7, "Phone number seems too short"),
  company_name: z.string().min(1, "Company is required"),
  notes: z.string().optional().default(""),
});

const RECAPTCHA_SECRET = Deno.env.get("RECAPTCHA_SECRET_KEY") ?? "";
const RECAPTCHA_MIN_SCORE = Number(Deno.env.get("RECAPTCHA_MIN_SCORE") ?? "0.5");
const RECAPTCHA_HOSTNAME = Deno.env.get("RECAPTCHA_HOSTNAME") ?? "";

function hostnameAllowed(observed: string, csv: string) {
  const host = String(observed || "").toLowerCase();
  const items = String(csv || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return items.some((h) => {
    if (h.startsWith(".")) {
      const base = h.slice(1);
      return host === base || host.endsWith(h);
    }
    return host === h || host === `www.${h}`;
  });
}

function hostnameFromUrl(value = "") {
  try {
    return new URL(value).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function isLovablePreviewHostname(hostname: string) {
  return hostname.endsWith(".lovableproject.com") || hostname.endsWith(".lovable.app");
}

async function verifyRecaptcha(token: string, remoteip?: string) {
  const params = new URLSearchParams();
  params.set("secret", RECAPTCHA_SECRET);
  params.set("response", token);
  if (remoteip) params.set("remoteip", remoteip);
  const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  if (!resp.ok) throw new Error(`reCAPTCHA verify HTTP ${resp.status}`);
  return await resp.json() as {
    success: boolean;
    score?: number;
    action?: string;
    hostname?: string;
    "error-codes"?: string[];
  };
}

function escapeHtml(str = "") {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderHtml(d: z.infer<typeof ContactSchema>) {
  const rows: [string, string][] = [
    ["First name", d.first_name],
    ["Last name", d.last_name],
    ["Email", d.email_address],
    ["Phone", d.phone_number],
    ["Company", d.company_name],
  ];
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
    <h2 style="margin:0 0 8px">New Contact Form Submission</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      ${rows.map(([label, val]) => `
        <tr>
          <td style="font-weight:600;vertical-align:top">${escapeHtml(label)}:</td>
          <td>${escapeHtml(val)}</td>
        </tr>`).join("")}
    </table>
    <p style="margin:16px 0 4px;font-weight:600">Notes</p>
    <pre style="white-space:pre-wrap;margin:0">${escapeHtml(d.notes || "")}</pre>
    <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
    <small>Sent ${new Date().toLocaleString()}</small>
  </div>`;
}

function parseRecipients(input = "") {
  if (/\s/.test(input)) throw new Error("EMAIL_TO must use commas only and contain no spaces.");
  const recipients = input.split(",").filter(Boolean);
  if (recipients.length === 0) throw new Error("EMAIL_TO is empty or invalid.");
  if (recipients.some((a) => !a.includes("@"))) throw new Error("EMAIL_TO contains an invalid email address.");
  return recipients;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { ok: false, error: "Method Not Allowed" });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  const recaptchaToken = body?.recaptchaToken;
  const recaptchaAction = body?.recaptchaAction || "contact";
  if (typeof recaptchaToken !== "string" || !recaptchaToken) {
    return json(400, { ok: false, error: "Missing reCAPTCHA token" });
  }

  const xff = req.headers.get("x-forwarded-for") || "";
  const remoteip = xff.split(",")[0]?.trim() || undefined;
  const userAgent = req.headers.get("user-agent") || "";

  // Verify reCAPTCHA
  let verify;
  try {
    if (!RECAPTCHA_SECRET) throw new Error("Server is missing RECAPTCHA_SECRET_KEY");
    verify = await verifyRecaptcha(recaptchaToken, remoteip);
  } catch (err) {
    return json(500, { ok: false, error: (err as Error).message });
  }

  if (!verify.success) {
    return json(400, {
      ok: false,
      error: "reCAPTCHA verification failed",
      details: verify["error-codes"] ?? null,
    });
  }
  if (verify.action && verify.action !== recaptchaAction) {
    return json(400, { ok: false, error: "reCAPTCHA action mismatch" });
  }
  const score = typeof verify.score === "number" ? verify.score : 0;
  if (score < RECAPTCHA_MIN_SCORE) {
    return json(400, { ok: false, error: "Low reCAPTCHA score", score });
  }
  if (RECAPTCHA_HOSTNAME) {
    const observed = (verify.hostname || "").toLowerCase();
    const requestHostname = hostnameFromUrl(req.headers.get("origin") || req.headers.get("referer") || "");
    const previewHostname = isLovablePreviewHostname(requestHostname) ? requestHostname : "";
    const allowedHostnames = [RECAPTCHA_HOSTNAME, previewHostname].filter(Boolean).join(",");
    if (!hostnameAllowed(observed, allowedHostnames)) {
      return json(400, { ok: false, error: "Bad reCAPTCHA hostname", observed });
    }
  }

  // Validate payload
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return json(400, { ok: false, error: parsed.error.flatten() });
  }
  const data = parsed.data;

  // Log the submission first (so leads survive email outages)
  const { data: inserted, error: insertError } = await supabase
    .from("contact_submissions")
    .insert({
      first_name: data.first_name,
      last_name: data.last_name,
      email_address: data.email_address,
      phone_number: data.phone_number,
      company_name: data.company_name,
      notes: data.notes ?? "",
      recaptcha_score: score,
      user_agent: userAgent,
      ip: remoteip ?? null,
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("contact_submissions insert failed", insertError);
  }
  const submissionId = inserted?.id;

  // Send email
  try {
    const recipients = parseRecipients(Deno.env.get("EMAIL_TO") ?? "");
    const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
    const transporter = nodemailer.createTransport({
      host: Deno.env.get("SMTP_HOST"),
      port,
      secure: port === 465,
      auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
      },
    });

    const subject = `New Lead: ${data.first_name} ${data.last_name}${
      data.company_name ? " — " + data.company_name : ""
    }`;

    await transporter.sendMail({
      from: Deno.env.get("EMAIL_FROM"),
      to: recipients,
      replyTo: data.email_address,
      subject,
      text: `First name: ${data.first_name}
Last name: ${data.last_name}
Email: ${data.email_address}
Phone: ${data.phone_number}
Company: ${data.company_name}

Notes:
${data.notes ?? ""}
`,
      html: renderHtml(data),
    });

    if (submissionId) {
      await supabase
        .from("contact_submissions")
        .update({ email_sent: true })
        .eq("id", submissionId);
    }

    return json(200, { ok: true, emailSent: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("send mail failed", message);
    if (submissionId) {
      await supabase
        .from("contact_submissions")
        .update({ email_sent: false, email_error: message })
        .eq("id", submissionId);
    }
    return json(500, { ok: false, error: message });
  }
});
