'use client';

import {useEffect, useState} from 'react';
import {useLanguage} from '@/lib/LanguageContext';
import {getUsers} from '@/lib/adminApi';

function initials(name) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0].toUpperCase())
        .join('');
}

export default function UsersPage() {
    const [users, setUsers] = useState(null);
    const {t, locale} = useLanguage();
    const currency = locale === 'ar' ? 'جنيه' : 'EGP';

    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch(() => setUsers([]));
    }, []);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-[26px] font-semibold tracking-tight text-ink">{t('dash.users.title')}</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    {users === null ? t('dash.ov.loading') : t('dash.users.count', {n: users.length})}
                </p>
            </div>

            <section className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-neutral-50">
                            <tr className="text-left text-[11px] uppercase tracking-[0.1em] text-neutral-500">
                                <th className="py-2.5 px-5 font-semibold">{t('dash.users.col.user')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.users.col.email')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.users.col.joined')}</th>
                                <th className="py-2.5 px-2 font-semibold">{t('dash.users.col.orders')}</th>
                                <th className="py-2.5 px-5 font-semibold">{t('dash.users.col.spend')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users === null && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-neutral-500">{t('dash.ov.loading')}</td>
                                </tr>
                            )}
                            {users && users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-neutral-500">{t('dash.users.empty')}</td>
                                </tr>
                            )}
                            {users && users.map((u) => (
                                <tr key={u.id || u.name} className="border-t border-neutral-100 hover:bg-neutral-50">
                                    <td className="py-3 px-5">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex w-8 h-8 rounded-full bg-neutral-100 items-center justify-center text-[11px] font-semibold text-neutral-600">
                                                {initials(u.name)}
                                            </span>
                                            <span className="font-medium text-ink">{locale === 'ar' ? (u.nameAr || u.name) : u.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-2 text-neutral-600">{u.email}</td>
                                    <td className="py-3 px-2 text-neutral-500 text-xs">{u.joined}</td>
                                    <td className="py-3 px-2 text-ink">{u.orders}</td>
                                    <td className="py-3 px-5 text-ink font-medium">{u.spend} {currency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
