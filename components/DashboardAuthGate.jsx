'use client';

import {useEffect, useState} from 'react';
import Link from 'next/link';
import {useLanguage} from '@/lib/LanguageContext';
import LangToggle from '@/components/LangToggle';
import {isAuthed, login} from '@/lib/adminApi';

// Gates the whole dashboard behind an admin sign-in. While not authenticated we
// render a branded login screen instead of the dashboard chrome; the backend
// auth + token storage already live in lib/adminApi.js.
export default function DashboardAuthGate({children}) {
    const {t, hydrated} = useLanguage();
    // null = still checking localStorage, false = show login, true = show app.
    const [authed, setAuthed] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setAuthed(isAuthed());
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await login(email.trim(), password);
            setAuthed(true);
        } catch (err) {
            setError(err.message || 'Sign in failed');
        } finally {
            setSubmitting(false);
        }
    }

    // Still reading the stored session — avoid a login flash for signed-in admins.
    if (authed === null) {
        return (
            <div className="min-h-screen grid place-items-center bg-neutral-50 text-neutral-500 text-sm">
                {hydrated ? t('dash.login.checking') : 'Checking session…'}
            </div>
        );
    }

    if (authed) return children;

    return (
        <div className="min-h-screen grid place-items-center bg-neutral-50 px-4 py-10 text-ink">
            <div className="w-full max-w-sm">
                <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-semibold tracking-tight">{t('dash.brand')}</span>
                    <LangToggle className="text-neutral-700 hover:text-ink" />
                </div>

                <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red">
                        {t('dash.login.eyebrow')}
                    </p>
                    <h1 className="mt-1.5 text-xl font-semibold tracking-tight">{t('dash.login.title')}</h1>
                    <p className="mt-1 text-sm text-neutral-500">{t('dash.login.subtitle')}</p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="admin-email" className="block text-xs font-medium text-neutral-600 mb-1.5">
                                {t('dash.login.email')}
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                            />
                        </div>

                        <div>
                            <label htmlFor="admin-password" className="block text-xs font-medium text-neutral-600 mb-1.5">
                                {t('dash.login.password')}
                            </label>
                            <input
                                id="admin-password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-brand-red bg-brand-red/5 border border-brand-red/20 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-lg bg-brand-red text-white font-semibold text-sm py-2.5 transition hover:bg-brand-red-deep disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? t('dash.login.signingIn') : t('dash.login.submit')}
                        </button>
                    </form>
                </div>

                <div className="mt-5 text-center">
                    <Link href="/" className="text-xs text-neutral-500 hover:text-ink transition">
                        {t('dash.login.backToSite')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
