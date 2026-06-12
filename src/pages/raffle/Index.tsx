import { Link } from 'react-router-dom';
import Container from '@/components/Container';
import { SEO } from '@/lib/SEO';

const links = [
  { to: '/raffle/enter', label: 'Enter' },
  { to: '/raffle/draw', label: 'Draw' },
  { to: '/raffle/admin', label: 'Admin' },
];

export default function RaffleIndexPage() {
  return (
    <div
      className="flex h-[100vh] max-h-[100vh] items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title="Raffle | Grove Marketing Co." robots="noindex, nofollow" />
      <Container>
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 text-[color:var(--color-grove-100)]">
          <h1 className="text-center text-5xl">Raffle</h1>
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-md border border-[color:var(--color-grove-100)]/30 bg-[color:var(--color-grove-100)]/10 px-6 py-4 text-center text-lg font-medium transition hover:bg-[color:var(--color-grove-100)]/20"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
