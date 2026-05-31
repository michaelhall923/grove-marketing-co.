/**
 * One-time export of Builder.io CMS content to static JSON (no runtime Builder dependency).
 */
import fs from 'fs';
import path from 'path';

const API_KEY = '04a66a34a825475f879a3a1be1673b31';
const OUT_DIR = path.join(process.cwd(), 'src', 'content');

function stripBuilderHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<img[^>]*builder-pixel[^>]*>/gi, '')
    .replace(/<builder-component[\s\S]*?<\/builder-component>/gi, (match) => {
      const inner = match.replace(/^<builder-component[^>]*>/i, '').replace(/<\/builder-component>$/i, '');
      return inner;
    })
    .replace(/<!--[\s\S]*?-->/g, '')
    .trim();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.json();
}

async function exportArticle(slug) {
  const url = `https://cdn.builder.io/api/v1/html/article?apiKey=${API_KEY}&query.data.slug=${encodeURIComponent(slug)}`;
  const json = await fetchJson(url);
  const data = json.data || {};
  if (!data.slug) return null;

  const bodyHtml = stripBuilderHtml(data.html || '');
  const image =
    typeof data.image === 'string'
      ? data.image
      : data.image?.url || data.heroImage?.url || '';

  return {
    slug: data.slug,
    title: data.title || '',
    excerpt: data.excerpt || data.description || '',
    image,
    bodyHtml,
  };
}

async function exportPage(urlPath) {
  const url = `https://cdn.builder.io/api/v1/html/page?apiKey=${API_KEY}&userAttributes.urlPath=${encodeURIComponent(urlPath)}`;
  const json = await fetchJson(url);
  const data = json.data || {};
  const bodyHtml = stripBuilderHtml(data.html || '');

  return {
    urlPath,
    title: data.title || data.name || 'About Us',
    bodyHtml,
  };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const articlesRes = await fetchJson(
    `https://cdn.builder.io/api/v3/content/article?apiKey=${API_KEY}&limit=50&fields=data.slug`,
  );
  const slugs = (articlesRes.results || [])
    .map((r) => r.data?.slug)
    .filter(Boolean)
    .filter((s) => s !== 'asdfasdf');

  const articles = [];
  for (const slug of slugs) {
    const article = await exportArticle(slug);
    if (article?.bodyHtml) articles.push(article);
    console.log('article:', slug, article ? 'ok' : 'skip');
  }

  fs.writeFileSync(path.join(OUT_DIR, 'articles.json'), JSON.stringify(articles, null, 2));

  let pages = [];
  try {
    const aboutUs = await exportPage('/about-us');
    if (aboutUs.bodyHtml) pages.push(aboutUs);
    console.log('pages exported:', aboutUs.title);
  } catch (err) {
    console.warn('about-us export skipped:', err.message);
  }
  fs.writeFileSync(path.join(OUT_DIR, 'pages.json'), JSON.stringify(pages, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
