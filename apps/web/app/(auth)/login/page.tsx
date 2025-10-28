'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const onSend = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`
      }
    });
    if (error) setError(error.message);
    else setSent(true);
  };

  const onPasswordLogin = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else window.location.href = '/tasks';
  };

  return (
    <main className="grid place-items-center">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      {sent ? (
        <p>Check your email for a magic link.</p>
      ) : (
        <div className="grid gap-2">
          <input className="btn-ghost" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          <input className="btn-ghost" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          <div className="flex gap-2">
            <button className="btn" onClick={onPasswordLogin} disabled={!email || !password}>Sign in</button>
            <button className="btn-ghost" onClick={onSend} disabled={!email}>Magic link</button>
          </div>
        </div>
      )}
      {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </main>
  );
}

