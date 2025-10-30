"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Nav() {
    const [isAuthed, setIsAuthed] = useState<boolean | null>(null); // null = loading

    useEffect(() => {
        let mounted = true;
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) setIsAuthed(Boolean(session));
        });
        const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
            setIsAuthed(Boolean(session));
        });
        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-gray-200/50 glass-nav px-4 sm:px-8 lg:px-10 py-4">
            <div className="flex items-center gap-8">
                <a href={isAuthed ? "/dashboard" : "/"} className="flex items-center gap-3">
                    <div className="size-8 text-primary">
                        <svg fill="currentColor" viewBox="0 0 48 48" className="w-8 h-8">
                            <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Aquivis</h2>
                </a>
                {isAuthed && (
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="/dashboard" className="text-primary text-sm font-semibold">Dashboard</a>
                        <a href="/tasks" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">Tasks</a>
                        <a href="/properties" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">Properties</a>
                        <a href="/settings/profile" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">Settings</a>
                    </nav>
                )}
            </div>
            <div className="flex items-center gap-4">
                {isAuthed === null ? (
                    // Loading state - show placeholder to prevent layout shift
                    <div className="h-8 w-20" />
                ) : isAuthed ? (
                    <>
                        <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors">Logout</button>
                    </>
                ) : (
                    <nav className="flex items-center gap-3 text-sm">
                        <a href="/login" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Log In</a>
                        <a href="/signup" className="btn">Sign Up Free</a>
                    </nav>
                )}
            </div>
        </header>
    );
}


