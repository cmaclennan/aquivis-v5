'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';

function LoginInner() {
    const router = useRouter();
    const search = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) return setError(error.message);
        const redirect = search.get('redirect') || '/dashboard';
        router.replace(redirect);
    }

    return (
        <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
            <Card className="w-full max-w-md">
                <CardBody>
                    <h1 className="text-3xl font-bold tracking-tight mb-6 text-gray-900">Welcome Back</h1>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Input type="email" label="Email or Username" value={email} onChange={e=>setEmail(e.target.value)} required />
                        <div>
                            <Input type="password" label="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                            <div className="flex justify-end pt-2 pb-2">
                                <a className="text-sm text-primary font-medium hover:text-primary-hover transition-colors" href="/forgot-password">Forgot Password?</a>
                            </div>
                        </div>
                        {error && <p className="text-sm text-danger">{error}</p>}
                        <Button className="w-full" disabled={loading}>{loading? 'Signing in...' : 'Login'}</Button>
                    </form>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account? <a className="font-semibold text-primary hover:text-primary-hover transition-colors" href="/signup">Sign Up</a>
                    </div>
                </CardBody>
            </Card>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginInner />
        </Suspense>
    );
}
