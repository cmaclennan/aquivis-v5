'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSignup = async () => {
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else window.location.href = '/onboarding';
  };

  return (
    <main className="grid place-items-center">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Create your account</h1>
        <div className="grid gap-2">
          <input className="btn-ghost" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          <input className="btn-ghost" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
          <button className="btn" onClick={onSignup} disabled={!email || !password}>Continue</button>
        </div>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </main>
  );
}

