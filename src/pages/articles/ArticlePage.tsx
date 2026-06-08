import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';
import { getPost, type WPPost } from '@/lib/wordpress';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<WPPost | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setPost(null);
    setError(null);
    getPost(slug)
      .then((p) => {
        if (cancelled) return;
        // WP returns { error } shape on miss
        if ((p as unknown as { error?: string }).error) {
          setError('Article not found');
        } else {
          setPost(p);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Failed to load article');
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const wrapperStyle = {
    background: 'linear-gradient(to bottom, #297073, rgb(20, 52, 52))',
  } as const;

  if (error) {
    return (
      <div className="min-h-[100vh]" style={wrapperStyle}>
        <SEO title="Not Found" robots="noindex" />
        <HeaderFix />
        <Container maxWidth={1000}>
          <main className="px-4 py-16">
            <h1>Article not found</h1>
            <p>Sorry, we couldn't find that article.</p>
          </main>
        </Container>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[100vh]" style={wrapperStyle}>
        <HeaderFix />
        <Container maxWidth={1000}>
          <main className="px-4 py-16 opacity-80">Loading…</main>
        </Container>
      </div>
    );
  }

  const title = post.title || '';
  const hero = post.featured_image || '';

  return (
    <div className="min-h-[100vh]" style={wrapperStyle}>
      <SEO
        title={`${title.replace(/<[^>]+>/g, '')} | Grove Marketing Co.`}
        description={post.excerpt?.replace(/<[^>]+>/g, '').trim().slice(0, 160)}
        ogType="article"
        ogImage={hero || undefined}
      />
      <HeaderFix />
      <Container maxWidth={1000}>
        <main className="article px-4 py-8">
          {hero && (
            <img
              src={hero}
              alt=""
              className="mb-8 w-full rounded-xl"
              loading="eager"
              decoding="async"
            />
          )}
          <p className="mb-2 text-sm uppercase tracking-wide opacity-70">
            {formatDate(post.date)}
            {post.author?.name ? ` · ${post.author.name}` : ''}
          </p>
          <h1
            className="text-4xl sm:text-6xl"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div
            className="mt-8"
            dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
          />
        </main>
      </Container>
    </div>
  );
}
