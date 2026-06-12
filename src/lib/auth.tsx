import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthState = {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
};

const AuthCtx = createContext<AuthState>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkAdmin = async (userId: string | undefined) => {
      if (!userId || !supabase) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setTimeout(() => checkAdmin(s?.user?.id), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      checkAdmin(data.session?.user?.id).finally(() => setLoading(false));
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthCtx.Provider
      value={{ user: session?.user ?? null, session, isAdmin, loading }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
