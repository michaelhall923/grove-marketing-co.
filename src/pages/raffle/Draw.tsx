import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';

export default function RaffleDrawPage() {
  const { isAdmin, loading, user } = useAuth();
  const [display, setDisplay] = useState('Ready to spin');
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState('');
  const intervalRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
  }, []);

  async function spin() {
    if (spinning || !supabase) return;
    setError('');
    setWinner(null);
    setSpinning(true);
    setDisplay('Spinning...');

    try {
      const { data, error: fnErr } = await supabase.functions.invoke('raffle-draw', {
        body: {},
      });
      if (fnErr) throw fnErr;
      const pool: string[] = data?.pool ?? [];
      const winnerName: string = data?.winner?.name ?? '';
      if (!winnerName) throw new Error('No winner returned');

      // Slot-machine animation: start fast, slow to a stop on winner.
      const totalDurationMs = 4500;
      const start = performance.now();
      let lastTick = 0;

      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / totalDurationMs, 1);
        // Ease-out: interval grows from 60ms to 500ms
        const interval = 60 + Math.pow(progress, 2.2) * 600;

        if (now - lastTick >= interval) {
          lastTick = now;
          const idx = Math.floor(Math.random() * pool.length);
          setDisplay(pool[idx] ?? winnerName);
        }

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setDisplay(winnerName);
          setWinner(winnerName);
          setSpinning(false);
          fireConfetti();
        }
      };
      requestAnimationFrame(tick);
    } catch (e) {
      setSpinning(false);
      setDisplay('Ready to spin');
      const msg =
        e instanceof Error ? e.message : typeof e === 'string' ? e : 'Spin failed';
      setError(msg);
    }
  }

  function fireConfetti() {
    const end = Date.now() + 2500;
    const colors = ['#e27c22', '#fae1b4', '#fc7108', '#ffffff'];
    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }

  if (loading) {
    return (
      <div
        className="flex min-h-[100vh] items-center justify-center text-[color:var(--color-grove-100)]"
        style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
      >
        Loading...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div
        className="min-h-[100vh]"
        style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
      >
        <SEO title="Raffle Draw | Grove Marketing Co." robots="noindex, nofollow" />
        <HeaderFix />
        <Container>
          <div className="flex flex-col items-center gap-6 py-32 text-center text-[color:var(--color-grove-100)]">
            <h1 className="text-5xl">Admin Only</h1>
            <Link to="/login" className="button">
              Sign In
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100vh] overflow-hidden"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title="Raffle Draw | Grove Marketing Co." robots="noindex, nofollow" />
      <HeaderFix />
      <Container>
        <div className="flex min-h-[80vh] flex-col items-center justify-center gap-12 py-20 text-center text-[color:var(--color-grove-100)]">
          <h1 className="text-6xl sm:text-7xl md:text-8xl">Raffle Draw</h1>

          <div
            className={`flex min-h-[16rem] w-full items-center justify-center rounded-3xl bg-black/30 px-8 py-12 ${winner ? 'animate-scale-in' : ''}`}
          >
            <p
              className="text-center break-words"
              style={{
                fontFamily: 'var(--font-header)',
                fontSize: 'clamp(3rem, 12vw, 10rem)',
                lineHeight: 1,
                color: winner ? '#fae1b4' : 'inherit',
                textTransform: 'uppercase',
              }}
            >
              {display}
            </p>
          </div>

          {error && <p className="text-2xl text-red-300">{error}</p>}

          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              padding: '1.5rem 4rem',
              borderRadius: '1rem',
            }}
          >
            {spinning ? 'Spinning' : winner ? 'Spin Again' : 'Spin'}
          </button>
        </div>
      </Container>
    </div>
  );
}
