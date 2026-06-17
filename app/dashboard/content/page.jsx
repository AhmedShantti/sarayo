'use client';

import Link from 'next/link';

const SECTIONS = [
    {
        href: '/dashboard/content/products',
        icon: 'M4 7 L12 3 L20 7 V17 L12 21 L4 17 Z M4 7 L12 11 L20 7 M12 11 V21',
        title: 'Products',
        desc: 'Names, descriptions, prices, images, categories — in English & Arabic',
        count: '10 products',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        href: '/dashboard/content/features',
        icon: 'M13 2 4 14h6l-1 8 9-12h-6l1-8Z',
        title: 'Features',
        desc: 'The four feature cards on the homepage — titles, body text, icons',
        count: '4 cards',
        color: 'bg-amber-50 text-amber-600',
    },
    {
        href: '/dashboard/content/hero',
        icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
        title: 'Hero',
        desc: 'Headlines, CTA buttons and rotating brand words for the hero section',
        count: 'Headlines + CTAs',
        color: 'bg-rose-50 text-rose-600',
    },
    {
        href: '/dashboard/content/stats',
        icon: 'M3 3v18h18 M7 16l4-4 4 4 4-8',
        title: 'Stats',
        desc: 'The four animated stat numbers and their labels',
        count: '4 stats',
        color: 'bg-emerald-50 text-emerald-600',
    },
    {
        href: '/dashboard/content/navigation',
        icon: 'M4 6h16M4 12h16M4 18h16',
        title: 'Navigation',
        desc: 'Top nav links, Chipsy and Wafer product sub-menus',
        count: 'Nav + submenus',
        color: 'bg-violet-50 text-violet-600',
    },
    {
        href: '/dashboard/content/footer',
        icon: 'M3 20h18M3 4h18M5 4v16M19 4v16',
        title: 'Footer',
        desc: 'Description, contact info, social links, copyright, column links',
        count: 'Full footer',
        color: 'bg-cyan-50 text-cyan-600',
    },
    {
        href: '/dashboard/content/translations',
        icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 0 1 6.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129',
        title: 'Translations',
        desc: 'All site text strings — English and Arabic side by side',
        count: '400+ strings',
        color: 'bg-orange-50 text-orange-600',
    },
    {
        href: '/dashboard/content/media',
        icon: 'M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
        title: 'Media Library',
        desc: 'Upload and manage images used across the site',
        count: 'Images & files',
        color: 'bg-pink-50 text-pink-600',
    },
];

export default function ContentPage() {
    return (
        <>
            <div className="mb-8">
                <h1 className="text-[26px] font-semibold tracking-tight text-ink">Content</h1>
                <p className="text-sm text-neutral-500 mt-1">
                    Manage every page, text, image and translation on your site.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {SECTIONS.map((s) => (
                    <Link
                        key={s.href}
                        href={s.href}
                        className="group bg-white border border-neutral-200 rounded-xl p-5 flex flex-col gap-4 hover:border-neutral-300 hover:shadow-sm transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${s.color}`}>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d={s.icon} />
                                </svg>
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mt-1">{s.count}</span>
                        </div>
                        <div>
                            <p className="font-semibold text-ink group-hover:text-neutral-900">{s.title}</p>
                            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{s.desc}</p>
                        </div>
                        <div className="mt-auto text-xs font-medium text-neutral-400 group-hover:text-ink flex items-center gap-1 transition-colors">
                            Edit →
                        </div>
                    </Link>
                ))}
            </div>
        </>
    );
}
