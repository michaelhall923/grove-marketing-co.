import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';

export default function NotFound() {
  return (
    <div
      className="min-h-[100vh]"
      style={{ background: 'linear-gradient(to bottom, #297073, rgb(20, 52, 52))' }}
    >
      <SEO title="Page Not Found | Grove Marketing Co." robots="noindex" />
      <HeaderFix />
      <Container maxWidth={1000}>
        <main className="px-4 py-16">
          <h1 className="text-4xl">404</h1>
          <p>This page could not be found.</p>
        </main>
      </Container>
    </div>
  );
}
