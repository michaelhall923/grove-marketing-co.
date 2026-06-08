// Lovable Cloud edge function: WordPress.com blog proxy
// Uses the Lovable connector gateway. Hardcoded site ID for grovemarketingco.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SITE_ID = "255410911";
const GATEWAY = "https://connector-gateway.lovable.dev/wordpress_com";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY") ?? "";
const WP_KEY = Deno.env.get("WORDPRESS_COM_API_KEY") ?? "";

const POST_FIELDS = "ID,slug,title,excerpt,content,date,modified,featured_image,author,categories,tags";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=60, s-maxage=300",
    },
  });

async function wp(path: string) {
  const res = await fetch(`${GATEWAY}${path}`, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": WP_KEY,
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  if (!LOVABLE_API_KEY || !WP_KEY) {
    return json(500, { error: "WordPress connector not configured" });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "list";

    if (action === "get") {
      const slug = url.searchParams.get("slug");
      if (!slug) return json(400, { error: "Missing slug" });
      const { status, data } = await wp(
        `/rest/v1.1/sites/${SITE_ID}/posts/slug:${encodeURIComponent(slug)}?fields=${POST_FIELDS}`,
      );
      return json(status, data);
    }

    // list
    const page = url.searchParams.get("page") ?? "1";
    const number = url.searchParams.get("number") ?? "20";
    const { status, data } = await wp(
      `/rest/v1.1/sites/${SITE_ID}/posts?fields=${POST_FIELDS}&number=${encodeURIComponent(number)}&page=${encodeURIComponent(page)}&status=publish`,
    );
    return json(status, data);
  } catch (err) {
    return json(500, { error: String(err) });
  }
});
