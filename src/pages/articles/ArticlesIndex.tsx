import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';
import { listPosts, type WPPost } from '@/lib/wordpress';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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

export default function ArticlesIndex() {
  const [posts, setPosts] = useState<WPPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listPosts({ number: 24 })
      .then((res) => {
        if (!cancelled) setPosts(res.posts ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Failed to load posts');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="min-h-[100vh]"
      style={{ background: 'linear-gradient(to bottom, #297073, rgb(20, 52, 52))' }}
    >
      <SEO
        title="Articles | Grove Marketing Co."
        description="Stories, ideas, and field notes from the Grove Marketing Co. team."
      />
      <HeaderFix />
      <Container maxWidth={1100}>
        <main className="px-4 py-12">
          <header className="mb-12">
            <h1 className="text-5xl sm:text-7xl">Articles</h1>
            <p className="mt-4 max-w-2xl text-lg opacity-90">
              Stories, ideas, and field notes from the Grove Marketing Co. team.
            </p>
          </header>

          {error && (
            <p className="rounded-md bg-black/20 p-4 text-sm">
              Couldn't load articles right now. {error}
            </p>
          )}

          {!posts && !error && <p className="opacity-80">Loading…</p>}

          {posts && posts.length === 0 && !error && (
            <p className="opacity-80">No articles published yet.</p>
          )}

          {posts && posts.length > 0 && (
            <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.ID} className="group">
                  <Link to={`/articles/${post.slug}`} className="block">
                    {post.featured_image ? (
                      <div className="mb-4 aspect-[16/10] overflow-hidden rounded-xl bg-black/20">
                        <img
                          src={post.featured_image}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 aspect-[16/10] rounded-xl bg-black/20" />
                    )}
                    <p className="text-xs uppercase tracking-wide opacity-70">
                      {formatDate(post.date)}
                    </p>
                    <h2
                      className="mt-2 text-2xl leading-tight group-hover:underline"
                      dangerouslySetInnerHTML={{ __html: post.title }}
                    />
                    <div
                      className="mt-2 line-clamp-3 text-sm opacity-85"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </Container>
    </div>
  );
}
