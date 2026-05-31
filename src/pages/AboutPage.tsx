import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';
import pages from '@/content/pages.json';

type CmsPage = {
  urlPath: string;
  title: string;
  bodyHtml: string;
};

const cmsPages = pages as CmsPage[];

export default function AboutPage() {
  const page = cmsPages.find((p) => p.urlPath === '/about-us');

  if (!page) {
    return null;
  }

  return (
    <div
      className="min-h-[100vh]"
      style={{ background: 'linear-gradient(to bottom, #297073, rgb(20, 52, 52))' }}
    >
      <SEO
        title={page.title ? `${page.title} | Grove Marketing Co.` : 'About Us | Grove Marketing Co.'}
      />
      <HeaderFix />
      <Container maxWidth={1000}>
        <main className="article px-4 py-16">
          <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
        </main>
      </Container>
    </div>
  );
}
