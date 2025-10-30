'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(false);
        if (error) return setError(error.message);
        router.replace('/onboarding');
    }

    return (
        <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
            <Card className="w-full max-w-md">
                <CardBody>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-base text-gray-600 mb-6">Start your Aquivis setup.</p>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Input type="email" label="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                        <Input type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                        {error && <p className="text-sm text-danger">{error}</p>}
                        <Button className="w-full" disabled={loading}>{loading? 'Creating...' : 'Create account'}</Button>
                    </form>
                    <div className="mt-6 text-sm text-gray-600">
                        Have an account? <a className="text-primary font-semibold hover:text-primary-hover transition-colors" href="/login">Sign in</a>
                    </div>
                </CardBody>
            </Card>
        </main>
    );
}
