import { supabase } from '@/integrations/supabase/client';

export type WPPost = {
  ID: number;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  modified?: string;
  featured_image?: string;
  author?: { name?: string };
  categories?: Record<string, { name: string; slug: string }>;
  tags?: Record<string, { name: string; slug: string }>;
};

export type WPListResponse = { found: number; posts: WPPost[] };

void supabase;

function fnUrl(): string {
  const base = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!base) throw new Error('Backend not configured');
  return `${base}/functions/v1/wordpress`;
}

function anonKey(): string {
  return (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string) ?? '';
}

export async function listPosts(opts: { page?: number; number?: number } = {}): Promise<WPListResponse> {
  const q = new URLSearchParams({ action: 'list' });
  if (opts.page) q.set('page', String(opts.page));
  if (opts.number) q.set('number', String(opts.number));
  const key = anonKey();
  const res = await fetch(`${fnUrl()}?${q}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Failed to load posts (${res.status})`);
  return res.json();
}

export async function getPost(slug: string): Promise<WPPost> {
  const q = new URLSearchParams({ action: 'get', slug });
  const key = anonKey();
  const res = await fetch(`${fnUrl()}?${q}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Failed to load post (${res.status})`);
  return res.json();
}

// suppress unused warning
void call;
