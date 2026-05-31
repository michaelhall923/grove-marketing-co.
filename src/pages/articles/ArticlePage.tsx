import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import Image from '@/lib/Image';
import { SEO } from '@/lib/SEO';
import articles from '@/content/articles.json';
import { useParams } from 'react-router-dom';

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  bodyHtml: string;
};

const articleList = articles as Article[];

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const article = articleList.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div
        className="min-h-[100vh]"
        style={{ background: 'linear-gradient(to bottom, #297073, rgb(20, 52, 52))' }}
      >
        <SEO title="Not Found" robots="noindex" />
        <HeaderFix />
        <Container maxWidth={1000}>
          <main className="px-4 py-16">
            <h1>404 — Article not found</h1>
            <p>Sorry, we couldn’t find that article.</p>
          </main>
        </Container>
      </div>
    );
  }

  const title = article.title || '';
  const description = article.excerpt || '';
  const hero = article.image || '';

  return (
    <div
      className="min-h-[100vh]"
      style={{ background: 'linear-gradient(to bottom, #297073, rgb(20, 52, 52))' }}
    >
      <SEO
        title={title ? `${title} | Grove Marketing Co.` : 'Article | Grove Marketing Co.'}
        description={description}
        ogType="article"
        ogImage={hero || undefined}
      />
      <HeaderFix />
      <Container maxWidth={1000}>
        <main className="article">
          {hero && (
            <Image
              src={hero}
              width={1920}
              height={1080}
              alt={title || 'Article hero'}
              className="mb-8 rounded-xl"
              priority
            />
          )}
          <h1 className="text-4xl sm:text-6xl">{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
        </main>
      </Container>
    </div>
  );
}
