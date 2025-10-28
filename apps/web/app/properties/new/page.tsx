'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import AuthGuard from '../../../components/AuthGuard';

const steps = ['Basics', 'Plant Rooms', 'Units', 'Groups', 'Billing', 'Review'];

export default function NewPropertyWizard() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(url, anon);

  const onNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const onBack = () => setStep((s) => Math.max(s - 1, 0));

  const onCreate = async () => {
    const { error } = await supabase.from('properties').insert({ name, address });
    if (!error) window.location.href = '/properties';
  };

  return (
    <AuthGuard>
      <main style={{ padding: 24 }}>
        <h1>New Property</h1>
        <p>Step {step + 1} of {steps.length}: {steps[step]}</p>
        {step === 0 && (
          <div style={{ display: 'grid', gap: 8, maxWidth: 480 }}>
            <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button onClick={onBack} disabled={step === 0}>Back</button>
          {step < steps.length - 1 ? (
            <button onClick={onNext}>Next</button>
          ) : (
            <button onClick={onCreate} disabled={!name}>Create</button>
          )}
        </div>
      </main>
    </AuthGuard>
  );
}

