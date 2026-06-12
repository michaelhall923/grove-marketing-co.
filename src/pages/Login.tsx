import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';
import { supabase } from '@/integrations/supabase/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!supabase) {
      setError('Auth not configured.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (err) throw err;
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (err) throw err;
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-[100vh]"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title="Login | Grove Marketing Co." robots="noindex, nofollow" />
      <HeaderFix />
      <Container>
        <div className="mx-auto flex max-w-md flex-col gap-6 py-20 text-[color:var(--color-grove-100)]">
          <h1 className="text-center text-4xl">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <input
              type="password"
              placeholder="Password"
              required
              minLength={8}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            {error && <p className="text-red-300">{error}</p>}
            <button type="submit" disabled={loading} className="w-full">
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
            className="bg-transparent text-sm underline hover:bg-transparent"
            style={{ backgroundColor: 'transparent' }}
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </Container>
    </div>
  );
}
