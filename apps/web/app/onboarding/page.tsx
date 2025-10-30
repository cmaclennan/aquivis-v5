'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Card, CardBody } from '@/components/ui/Card';
import { timezones } from '@/lib/timezones';

export default function OnboardingPage() {
    const router = useRouter();
    const [company, setCompany] = useState('');
    const [tz, setTz] = useState('UTC');
    const [error, setError] = useState<string | null>(null);
    const [tzQuery, setTzQuery] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) router.replace('/login');
        });
    }, [router]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            setLoading(false);
            return router.replace('/login');
        }
        const res = await fetch('/api/onboarding/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ company_name: company, timezone: tz })
        });
        setLoading(false);
        if (!res.ok) {
            const t = await res.text();
            setError(t || 'Failed to complete onboarding');
            return;
        }
        router.replace('/dashboard');
    }

    const filteredTzs = timezones.filter(z => z.toLowerCase().includes(tzQuery.toLowerCase()));

    return (
        <main className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-16">
            <Card className="w-full max-w-md">
                <CardBody>
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm text-gray-600">Step 1 of 1</span>
                        <div className="h-1 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-primary to-accent rounded-full" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Company setup</h1>
                    <p className="text-base text-gray-600 mb-6">Tell us about your company.</p>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <Input label="Company name" value={company} onChange={e=>setCompany(e.target.value)} required />
                        <div className="space-y-2">
                            <Input label="Search timezone" value={tzQuery} onChange={e=>setTzQuery(e.target.value)} placeholder="Type to filter…" />
                            <Select label="Timezone" value={tz} onChange={e=>setTz(e.target.value)}>
                                {(filteredTzs.length ? filteredTzs : timezones).map(z => (
                                    <option key={z} value={z}>{z}</option>
                                ))}
                            </Select>
                        </div>
                        {error && <p className="text-sm text-danger">{error}</p>}
                        <Button className="w-full" disabled={loading}>{loading? 'Saving...' : 'Continue'}</Button>
                    </form>
                </CardBody>
            </Card>
        </main>
    );
}

