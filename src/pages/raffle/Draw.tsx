import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import Container from '@/components/Container';

import { SEO } from '@/lib/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';

const ROW_H = 'clamp(4rem, 13vw, 10rem)';
const SPIN_MS = 5000;
const REEL_LENGTH = 30;

export default function RaffleDrawPage() {
  const { isAdmin, loading, user } = useAuth();
  const [display, setDisplay] = useState('Ready to spin');
  const [reel, setReel] = useState<string[] | null>(null);
  const [rolling, setRolling] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [error, setError] = useState('');
  const winnerRef = useRef('');
  const doneRef = useRef(false);

  // Once the reel is mounted at translateY(0), kick off the transition.
  useEffect(() => {
    if (!reel) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setRolling(true)),
    );
    const safety = window.setTimeout(finishRoll, SPIN_MS + 800);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(safety);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reel]);

  function finishRoll() {
    if (doneRef.current) return;
    doneRef.current = true;
    setWinner(winnerRef.current);
    setSpinning(false);
    fireConfetti();
  }

  async function spin() {
    if (spinning || !supabase) return;
    setError('');
    setWinner(null);
    setReel(null);
    setRolling(false);
    setSpinning(true);
    setDisplay('Spinning...');
    doneRef.current = false;

    try {
      const { data, error: fnErr } = await supabase.functions.invoke('raffle-draw', {
        body: {},
      });
      if (fnErr) throw fnErr;
      const pool: string[] = data?.pool ?? [];
      const winnerName: string = data?.winner?.name ?? '';
      if (!winnerName) throw new Error('No winner returned');

      // Build the reel strip: shuffled names, ending on the winner.
      const source = pool.length ? pool : [winnerName];
      const items: string[] = [];
      while (items.length < REEL_LENGTH) {
        items.push(...[...source].sort(() => Math.random() - 0.5));
      }
      items.length = REEL_LENGTH;
      if (items[REEL_LENGTH - 1] === winnerName && source.length > 1) {
        items[REEL_LENGTH - 1] =
          source.find((n) => n !== winnerName) ?? items[REEL_LENGTH - 1];
      }
      items.push(winnerName);

      winnerRef.current = winnerName;
      setReel(items);
    } catch (e) {
      setSpinning(false);
      setReel(null);
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

  const nameStyle: React.CSSProperties = {
    fontFamily: 'var(--font-header)',
    fontSize: 'clamp(2.5rem, 9vw, 7rem)',
    lineHeight: 1,
    textTransform: 'uppercase',
  };

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
        className="flex h-[100vh] max-h-[100vh] items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
      >
        <SEO title="Raffle Draw | Grove Marketing Co." robots="noindex, nofollow" />
        <Container>
          <div className="flex flex-col items-center gap-6 text-center text-[color:var(--color-grove-100)]">
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
      className="flex h-[100vh] max-h-[100vh] items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title="Raffle Draw | Grove Marketing Co." robots="noindex, nofollow" />

      <Container>
        <div className="flex flex-col items-center justify-center gap-8 text-center text-[color:var(--color-grove-100)]">
          <h1 className="text-5xl sm:text-6xl md:text-7xl">CLIENT SHOWCASE RAFFLE</h1>

          <div
            className={`w-full overflow-hidden rounded-3xl bg-black/30 ${winner ? 'animate-scale-in' : ''}`}
            style={{ height: ROW_H }}
          >
            {reel ? (
              <div
                onTransitionEnd={(e) => {
                  if (e.propertyName === 'transform') finishRoll();
                }}
                style={{
                  transform: rolling
                    ? `translateY(calc(-${reel.length - 1} * ${ROW_H}))`
                    : 'translateY(0)',
                  transition: rolling
                    ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.65, 0.15, 1)`
                    : 'none',
                  willChange: 'transform',
                }}
              >
                {reel.map((name, i) => (
                  <p
                    key={i}
                    className="flex items-center justify-center break-words px-8 text-center"
                    style={{
                      ...nameStyle,
                      height: ROW_H,
                      color:
                        winner && i === reel.length - 1 ? '#fae1b4' : 'inherit',
                    }}
                  >
                    {name}
                  </p>
                ))}
              </div>
            ) : (
              <p
                className="flex h-full items-center justify-center break-words px-8 text-center"
                style={nameStyle}
              >
                {display}
              </p>
            )}
          </div>

          {error && <p className="text-xl text-red-300">{error}</p>}

          <button
            type="button"
            onClick={spin}
            disabled={spinning}
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 3rem)',
              padding: '1rem 3rem',
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
