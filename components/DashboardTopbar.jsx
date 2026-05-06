'use client';

import {usePathname} from 'next/navigation';

const TITLES = {
    '/dashboard':            'Overview',
    '/dashboard/orders':     'Orders',
    '/dashboard/orders/new': 'New order',
    '/dashboard/products':   'Products',
    '/dashboard/users':      'Users',
};

export default function DashboardTopbar() {
    const pathname = usePathname();
    const title = TITLES[pathname] || 'Dashboard';
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="bg-white border-b border-neutral-200">
            <div className="px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <span className="font-medium">Sarayo</span>
                    <span className="text-neutral-300">/</span>
                    <span className="text-ink font-medium">{title}</span>
                </div>
                <span className="text-xs text-neutral-500">{today}</span>
            </div>
        </div>
    );
}
