'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Nav() {
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => { sub.subscription.unsubscribe(); };
  }, []);
  if (!authed) return null;
  return (
    <>
      <a href="/tasks" className="btn-ghost">Tasks</a>
      <a href="/properties" className="btn-ghost">Properties</a>
    </>
  );
}

