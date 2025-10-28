'use client';
import { useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function OnboardingPage() {
  const [companyName, setCompanyName] = useState('');
  const zones = useMemo(() => {
    // Prefer Intl list if available, fallback to common zones
    // @ts-ignore
    if (typeof Intl !== 'undefined' && Intl.supportedValuesOf) {
      // @ts-ignore
      return Intl.supportedValuesOf('timeZone') as string[];
    }
    return [
      'UTC', 'Australia/Brisbane', 'Australia/Sydney', 'Australia/Melbourne',
      'Pacific/Auckland', 'America/Los_Angeles', 'America/New_York',
      'Europe/London', 'Europe/Berlin', 'Asia/Singapore'
    ];
  }, []);
  const [timezone, setTimezone] = useState('UTC');
  const [error, setError] = useState<string | null>(null);

  const onComplete = async () => {
    setError(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    const res = await fetch('/api/onboarding/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      ...(accessToken ? { headers: { 'content-type': 'application/json', authorization: `Bearer ${accessToken}` } } : {}),
      body: JSON.stringify({ companyName, timezone })
    });
    if (!res.ok) setError('Failed to complete onboarding');
    else window.location.href = '/tasks';
  };

  return (
    <main className="grid place-items-center">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Set up your company</h1>
        <div className="grid gap-3">
          <label className="text-sm">Company name</label>
          <input className="btn-ghost" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company name" />
          <label className="text-sm">Timezone</label>
          <select className="btn-ghost" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {zones.map((z) => (
              <option key={z} value={z}>{z}</option>
            ))}
          </select>
          <button className="btn" onClick={onComplete} disabled={!companyName}>Finish</button>
        </div>
        {error && <p className="text-danger mt-2">{error}</p>}
      </div>
    </main>
  );
}

