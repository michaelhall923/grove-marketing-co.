// Lovable Cloud edge function: pick a random raffle winner.
// Admin-only. Verifies the caller has the 'admin' role.

import { createClient } from "npm:@supabase/supabase-js@2";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";

  if (!authHeader) return json(401, { error: "Not authenticated" });

  const userClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return json(401, { error: "Not authenticated" });

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: isAdmin } = await admin.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (!isAdmin) return json(403, { error: "Forbidden" });

  const { data: entries, error } = await admin
    .from("raffle_entries")
    .select("id, name");
  if (error) return json(500, { error: error.message });
  if (!entries || entries.length === 0) return json(400, { error: "No entries" });

  const winner = entries[Math.floor(Math.random() * entries.length)];
  return json(200, { winner, pool: entries.map((e) => e.name) });
});
