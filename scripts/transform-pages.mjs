import fs from 'fs';
import path from 'path';

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (/\.(tsx|jsx)$/.test(ent.name)) out.push(p);
  }
  return out;
}

function transform(content, file) {
  let c = content;

  c = c.replace(/import Head from ['"]next\/head['"];?\n?/g, '');
  c = c.replace(/import \{ NextPage \} from ['"]next['"];?\n?/g, '');
  c = c.replace(/import type \{ GetStaticProps \} from ['"]next['"];?\n?/g, '');
  c = c.replace(/import \{ GetStaticProps \} from ['"]next['"];?\n?/g, '');
  c = c.replace(/import \{ builder \} from ['"]@builder\.io\/react['"];?\n?/g, '');
  c = c.replace(/builder\.init\([^)]*\);?\n?/g, '');
  c = c.replace(/export const getStaticProps[\s\S]*?};\n\n/g, '');
  c = c.replace(/: NextPage[^=]*/g, '');
  c = c.replace(/& \{ footerTitle\?: string \}/g, '');

  if (!c.includes("from '@/lib/SEO'") && !c.includes('from "@/lib/SEO"')) {
    const seoImport = "import { SEO } from '@/lib/SEO';\n";
    const firstImport = c.match(/^import .+;\n/m);
    if (firstImport) {
      c = c.replace(firstImport[0], firstImport[0] + seoImport);
    } else {
      c = seoImport + c;
    }
  }

  c = c.replace(/from ['"]next\/image['"]/g, "from '@/lib/Image'");
  c = c.replace(/from ['"]next\/link['"]/g, "from 'react-router-dom'");
  c = c.replace(/import Link from 'react-router-dom'/g, "import { Link } from 'react-router-dom'");
  c = c.replace(/<Link href=/g, '<Link to=');

  // Simple title-only Head
  c = c.replace(
    /<Head>\s*<title>([^<]*)<\/title>\s*<\/Head>/g,
    '<SEO title="$1" />',
  );

  // Head with title + description vars
  c = c.replace(
    /<Head>\s*<title>\{([^}]+)\}<\/title>\s*<meta[^>]*name="description"[^>]*\/>\s*([\s\S]*?)<\/Head>/g,
    '<SEO title={`${$1} | Grove Marketing Co.`} description={$1} />',
  );

  if (file.includes('mrc2025')) {
    c = c.replace(
      /<Head>[\s\S]*?<\/Head>/,
      `<SEO title={title} description={description} robots="noindex, nofollow" />`,
    );
  }

  // External links should stay <a href>
  c = c.replace(/<Link to=\{item\.url\}/g, '<a href={item.url}');
  c = c.replace(/<\/Link>/g, (match, offset) => {
    const before = c.slice(Math.max(0, offset - 80), offset);
    if (before.includes('target="_blank"') || before.includes("target='_blank'")) return '</a>';
    return '</Link>';
  });

  if (file.includes('index.tsx')) {
    c = c.replace(/<SEO title=\{undefined\} \/>/g, '');
    c = c.replace(
      /<Head>\s*<title>Grove Marketing Co\.[\s\S]*?<\/Head>/,
      '<SEO title="Grove Marketing Co. | Digital Marketing, Web Development & SEO" />',
    );
  }

  c = c.replace(/MRC2025\.footerTitle = .+;\n?/g, 'export const mrc2025FooterTitle = ');
  c = c.replace(/export default MRC2025;/g, 'export default function MRC2025Page() {');
  if (file.includes('mrc2025') && !c.includes('export default function MRC2025Page')) {
    c = c.replace(/const MRC2025[^=]*= \(\) => \{/, 'export default function MRC2025Page() {');
    c = c.replace(/\};\n\nMRC2025\.footerTitle/, '\n}\n\nexport const mrc2025FooterTitle');
  }

  return c;
}

const pagesDir = path.join(process.cwd(), 'src', 'pages');
for (const file of walk(pagesDir)) {
  const raw = fs.readFileSync(file, 'utf8');
  const next = transform(raw, file);
  fs.writeFileSync(file, next);
  console.log('transformed', path.relative(process.cwd(), file));
}
