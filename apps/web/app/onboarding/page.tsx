'use client';
import { useState } from 'react';

export default function OnboardingPage() {
  const [companyName, setCompanyName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [error, setError] = useState<string | null>(null);

  const onComplete = async () => {
    setError(null);
    const res = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ companyName, timezone })
    });
    if (!res.ok) setError('Failed to complete onboarding');
    else window.location.href = '/tasks';
  };

  return (
    <main className="grid place-items-center">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Set up your company</h1>
        <div className="grid gap-2">
          <input className="btn-ghost" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" />
          <input className="btn-ghost" value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="Timezone (e.g., Australia/Brisbane)" />
          <button className="btn" onClick={onComplete} disabled={!companyName}>Finish</button>
        </div>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </main>
  );
}

