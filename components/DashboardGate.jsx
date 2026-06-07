'use client';

import {useEffect, useState} from 'react';
import {login, isAuthed, logout, getAdminUser} from '@/lib/adminApi';

// Wraps the dashboard. Until an ADMIN is logged in (token in localStorage),
// it shows a login form instead of the dashboard content.
export default function DashboardGate({children}) {
    const [ready, setReady] = useState(false);
    const [authed, setAuthed] = useState(false);

    useEffect(() => {
        setAuthed(isAuthed());
        setReady(true);
    }, []);

    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-neutral-400 text-sm">
                Loading…
            </div>
        );
    }

    if (!authed) {
        return <LoginScreen onSuccess={() => setAuthed(true)} />;
    }

    return (
        <>
            {children}
            <LogoutButton onLogout={() => setAuthed(false)} />
        </>
    );
}

function LoginScreen({onSuccess}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            await login(email.trim(), password);
            onSuccess();
        } catch (err) {
            setError(err.message || 'Login failed');
            setBusy(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white border border-neutral-200 rounded-2xl p-8 shadow-sm flex flex-col gap-5"
            >
                <div>
                    <h1 className="text-xl font-semibold text-ink">Admin sign in</h1>
                    <p className="text-sm text-neutral-500 mt-1">Sarayo Alwadiya dashboard</p>
                </div>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Email</span>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                        required
                        className="px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                    />
                </label>

                <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">Password</span>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                        className="px-3 py-2 rounded-lg border border-neutral-300 text-sm text-ink focus:outline-none focus:border-ink transition-colors"
                    />
                </label>

                {error && (
                    <p className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={busy}
                    className="px-5 py-2.5 rounded-lg bg-ink text-white text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60"
                >
                    {busy ? 'Signing in…' : 'Sign in'}
                </button>
            </form>
        </div>
    );
}

function LogoutButton({onLogout}) {
    const user = getAdminUser();
    return (
        <button
            type="button"
            onClick={() => {
                logout();
                onLogout();
            }}
            title={user ? `Log out ${user.email}` : 'Log out'}
            className="fixed bottom-4 right-4 z-50 px-3 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-medium text-neutral-600 shadow-sm hover:border-ink hover:text-ink transition-colors"
        >
            Log out
        </button>
    );
}
