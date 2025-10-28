'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SessionBar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setEmail(data.session?.user.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const onLogout = async () => {
    await supabase.auth.signOut();
    location.href = '/';
  };

  if (!email) return <a href="/login">Login</a>;
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <span>{email}</span>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
}


