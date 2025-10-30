'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let isMounted = true;
        async function check() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.replace('/login');
                return;
            }
            if (isMounted) setReady(true);
        }
        check();
        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
            if (!session) router.replace('/login');
        });
        return () => {
            isMounted = false;
            sub.subscription.unsubscribe();
        };
    }, [router]);

    if (!ready) {
        // Show a loading skeleton that matches the page layout instead of blank
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            <div className="h-16 bg-gray-200 rounded"></div>
                            <div className="h-16 bg-gray-200 rounded"></div>
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return <>{children}</>;
}



