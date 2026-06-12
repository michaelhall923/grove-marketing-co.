import { useState, useRef, type FormEvent } from 'react';
import { z } from 'zod';
import Container from '@/components/Container';

import { SEO } from '@/lib/SEO';
import { supabase } from '@/integrations/supabase/client';

const RaffleSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().trim().email('Valid email required').max(320),
  phone: z.string().trim().min(3, 'Phone is required').max(50),
});

export default function RaffleEnterPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [showThanks, setShowThanks] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [topError, setTopError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldErrors({});
    setTopError('');

    const fd = new FormData(e.currentTarget);
    const parsed = RaffleSchema.safeParse({
      name: (fd.get('name') as string) ?? '',
      email: (fd.get('email') as string) ?? '',
      phone: (fd.get('phone') as string) ?? '',
    });
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (v && v[0]) fe[k] = v[0];
      }
      setFieldErrors(fe);
      return;
    }

    if (!supabase) {
      setTopError('Backend not configured.');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('raffle_entries').insert(parsed.data);
    setSubmitting(false);

    if (error) {
      setTopError(error.message);
      return;
    }

    formRef.current?.reset();
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 3000);
  }

  return (
    <div
      className="flex h-[100vh] max-h-[100vh] items-center justify-center overflow-hidden"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title="Enter the Raffle | Grove Marketing Co." robots="noindex, nofollow" />
      <Container>
        <div className="mx-auto flex w-full max-w-xl flex-col gap-6 text-[color:var(--color-grove-100)]">
          <h1 className="text-center text-5xl">Enter the Raffle</h1>
          <p className="text-center">Drop your info below for a chance to win.</p>

          <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-3">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                autoComplete="name"
                required
                disabled={submitting}
                className={`w-full ${fieldErrors.name ? 'border border-red-400' : ''}`}
              />
              {fieldErrors.name && (
                <p className="mt-1 text-sm text-red-300">{fieldErrors.name}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
                disabled={submitting}
                className={`w-full ${fieldErrors.email ? 'border border-red-400' : ''}`}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-300">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                autoComplete="tel"
                required
                disabled={submitting}
                className={`w-full ${fieldErrors.phone ? 'border border-red-400' : ''}`}
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-300">{fieldErrors.phone}</p>
              )}
            </div>

            {topError && <p className="text-red-300">{topError}</p>}

            <button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Entering...' : 'Enter Raffle'}
            </button>
          </form>
        </div>
      </Container>

      {showThanks && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <div
            className="animate-scale-in rounded-2xl bg-[color:var(--color-grove-100)] px-12 py-10 text-center shadow-2xl"
            style={{ color: 'hsl(22 80% 23%)' }}
          >
            <h2 className="text-4xl">Thanks for entering!</h2>
            <p className="mt-2 text-lg">Good luck.</p>
          </div>
        </div>
      )}
    </div>
  );
}
