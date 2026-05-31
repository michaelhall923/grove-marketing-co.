// pages/api/contact.js — reCAPTCHA v3 verification + hostname pinning (JS)

import nodemailer from 'nodemailer';
import { z } from 'zod';

// ---------- Validation ----------
const ContactSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email_address: z.string().email('Valid email required'),
  phone_number: z.string().min(7, 'Phone number seems too short'),
  company_name: z.string().min(1, 'Company is required'),
  notes: z.string().optional().default(''), // not required
});

// ---------- reCAPTCHA config ----------
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY || '';
const RECAPTCHA_MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? '0.5');
const RECAPTCHA_HOSTNAME = process.env.RECAPTCHA_HOSTNAME || '';
const VERCEL_ENV = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

// CSV list helper; supports leading-dot suffixes (e.g. ".grovemarketingco.com")
function hostnameAllowed(observed, csv) {
  const host = String(observed || '').toLowerCase();
  const items = String(csv || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return items.some((h) => {
    if (h.startsWith('.')) {
      const base = h.slice(1);
      return host === base || host.endsWith(h); // matches apex and any subdomain
    }
    return host === h || host === `www.${h}`;
  });
}

async function verifyRecaptcha({ token, remoteip }) {
  if (!RECAPTCHA_SECRET) throw new Error('Server is missing RECAPTCHA_SECRET_KEY');

  const params = new URLSearchParams();
  params.set('secret', RECAPTCHA_SECRET);
  params.set('response', token);
  if (remoteip) params.set('remoteip', remoteip);

  const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!resp.ok) throw new Error(`reCAPTCHA verify HTTP ${resp.status}`);
  return resp.json(); // { success, score, action, hostname, 'error-codes': [...] }
}

// ---------- Email helpers ----------
function parseRecipients(input = '') {
  // hard fail if there is any whitespace
  if (/\s/.test(input)) {
    throw new Error('EMAIL_TO must use commas only and contain no spaces.');
  }
  const recipients = input.split(',').filter(Boolean);
  if (recipients.length === 0) {
    throw new Error('EMAIL_TO is empty or invalid.');
  }
  // super-light sanity check
  if (recipients.some((a) => !a.includes('@'))) {
    throw new Error('EMAIL_TO contains an invalid email address.');
  }
  return recipients;
}

function getTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderHtml(d) {
  const rows = [
    ['First name', d.first_name],
    ['Last name', d.last_name],
    ['Email', d.email_address],
    ['Phone', d.phone_number],
    ['Company', d.company_name],
  ];
  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5">
    <h2 style="margin:0 0 8px">New Contact Form Submission</h2>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
      ${rows
        .map(
          ([label, val]) => `
        <tr>
          <td style="font-weight:600;vertical-align:top">${escapeHtml(String(label))}:</td>
          <td>${escapeHtml(String(val))}</td>
        </tr>`,
        )
        .join('')}
    </table>
    <p style="margin:16px 0 4px;font-weight:600">Notes</p>
    <pre style="white-space:pre-wrap;margin:0">${escapeHtml(d.notes || '')}</pre>
    <hr style="margin:16px 0;border:none;border-top:1px solid #eee"/>
    <small>Sent ${new Date().toLocaleString()}</small>
  </div>`;
}

// ---------- API handler ----------
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    // 1) Extract reCAPTCHA fields (client sends recaptchaToken + recaptchaAction)
    const recaptchaToken = req.body?.recaptchaToken;
    const recaptchaAction = req.body?.recaptchaAction || 'contact';

    if (typeof recaptchaToken !== 'string' || !recaptchaToken) {
      return res.status(400).json({ ok: false, error: 'Missing reCAPTCHA token' });
    }

    // First hop IP for Google verification
    const ipRaw = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    const remoteip = Array.isArray(ipRaw) ? ipRaw[0] : String(ipRaw).split(',')[0]?.trim();

    // 2) Verify with Google
    const verify = await verifyRecaptcha({ token: recaptchaToken, remoteip });

    if (!verify.success) {
      return res.status(400).json({
        ok: false,
        error: 'reCAPTCHA verification failed',
        details: verify['error-codes'] || null,
      });
    }

    // Bind token to our intended action
    if (verify.action && verify.action !== recaptchaAction) {
      return res.status(400).json({ ok: false, error: 'reCAPTCHA action mismatch' });
    }

    // Score gate
    const score = typeof verify.score === 'number' ? verify.score : 0;
    if (score < RECAPTCHA_MIN_SCORE) {
      return res.status(400).json({ ok: false, error: 'Low reCAPTCHA score', score });
    }

    // Optional: hostname pinning (only enforce in production unless you choose otherwise)
    if (RECAPTCHA_HOSTNAME && VERCEL_ENV === 'production') {
      const observed = (verify.hostname || '').toLowerCase();
      if (!hostnameAllowed(observed, RECAPTCHA_HOSTNAME)) {
        return res.status(400).json({ ok: false, error: 'Bad reCAPTCHA hostname', observed });
      }
    }

    // 3) Validate payload
    const parsed = ContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: parsed.error.flatten() });
    }

    // 4) Prepare email
    const recipients = parseRecipients(process.env.EMAIL_TO);
    if (recipients.length === 0) {
      return res.status(500).json({ ok: false, error: 'EMAIL_TO is empty or invalid' });
    }

    const data = parsed.data;
    const subject = `New Lead: ${data.first_name} ${data.last_name}${
      data.company_name ? ' — ' + data.company_name : ''
    }`;

    const transporter = getTransporter();

    await transporter.sendMail({
      from: process.env.EMAIL_FROM, // e.g. No Reply <no-reply@grovemarketingco.com>
      to: recipients,
      replyTo: data.email_address,
      subject,
      text: `First name: ${data.first_name}
Last name: ${data.last_name}
Email: ${data.email_address}
Phone: ${data.phone_number}
Company: ${data.company_name}

Notes:
${data.notes}
`,
      html: renderHtml(data),
    });

    return res.status(200).json({ ok: true, emailSent: true });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err?.message || 'Unknown error' });
  }
}
