import { useState } from 'react';
import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';

export default function RaffleAdminPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'idle' | 'confirming' | 'working' | 'done' | 'error'>(
    'idle',
  );
  const [message, setMessage] = useState('');

  async function reset() {
    if (!supabase) return;
    setStatus('working');
    setMessage('');
    const { data, error } = await supabase.functions.invoke('raffle-reset', {
      body: {},
    });
    if (error) {
      setStatus('error');
      setMessage(error.message);
      return;
    }
    setStatus('done');
    setMessage(`Deleted ${data?.deleted ?? 0} entries.`);
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div
      className="min-h-[100vh]"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title="Raffle Admin | Grove Marketing Co." robots="noindex, nofollow" />
      <HeaderFix />
      <Container>
        <div className="mx-auto flex max-w-xl flex-col gap-6 py-20 text-center text-[color:var(--color-grove-100)]">
          <h1 className="text-5xl">Raffle Admin</h1>
          <p className="opacity-80">Signed in as {user?.email}</p>

          {status === 'idle' && (
            <button type="button" onClick={() => setStatus('confirming')}>
              Delete All Raffle Entries
            </button>
          )}

          {status === 'confirming' && (
            <div className="flex flex-col gap-3">
              <p className="text-xl">Are you sure? This cannot be undone.</p>
              <div className="flex gap-3">
                <button type="button" onClick={reset} className="flex-1">
                  Yes, Delete Everything
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="flex-1"
                  style={{ backgroundColor: '#555' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {status === 'working' && <p>Deleting...</p>}
          {status === 'done' && (
            <>
              <p className="text-green-300">{message}</p>
              <button type="button" onClick={() => setStatus('idle')}>
                Done
              </button>
            </>
          )}
          {status === 'error' && (
            <>
              <p className="text-red-300">Error: {message}</p>
              <button type="button" onClick={() => setStatus('idle')}>
                Try Again
              </button>
            </>
          )}

          <button
            type="button"
            onClick={signOut}
            className="mt-8 bg-transparent text-sm underline"
            style={{ backgroundColor: 'transparent' }}
          >
            Sign Out
          </button>
        </div>
      </Container>
    </div>
  );
}
