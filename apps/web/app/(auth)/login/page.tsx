'use client';
import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSend = async () => {
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setSent(true);
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Sign in</h1>
      {sent ? (
        <p>Check your email for a magic link.</p>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
          <button onClick={onSend}>Send link</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </main>
  );
}

