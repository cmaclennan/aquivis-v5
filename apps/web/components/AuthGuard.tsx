'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const ok = !!data.session;
      setAuthed(ok);
      setReady(true);
      if (!ok) window.location.href = '/(auth)/login';
    });
  }, []);

  if (!ready) return null;
  if (!authed) return null;
  return <>{children}</>;
}
