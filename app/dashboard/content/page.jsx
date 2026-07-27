import Link from 'next/link';
import { listPages } from '@/lib/contentStore';

const SECTIONS = [
    {
        href: '/dashboard/content/brand',
        icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
        title: 'Brand & Logo',
        desc: 'Logo image, site name, tagline, and brand colours',
        count: 'Identity',
        color: 'bg-neutral-100 text-neutral-600',
    },
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
    {
        href: '/dashboard/content/chipsy',
        icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z',
        title: 'Chipsy Catalog',
        desc: 'Chipsy branded products — names, flavors, images, pricing',
        count: 'Chipsy products',
        color: 'bg-red-50 text-red-600',
    },
    {
        href: '/dashboard/content/wafer',
        icon: 'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18',
        title: 'Wafer Catalog',
        desc: 'Wafer branded products — names, flavors, images, pricing',
        count: 'Wafer products',
        color: 'bg-yellow-50 text-yellow-600',
    },
    {
        href: '/dashboard/content/pages/about',
        icon: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z',
        title: 'About Us',
        desc: 'Hero, story paragraphs, milestones timeline, values, and CTA',
        count: 'About page',
        color: 'bg-teal-50 text-teal-600',
    },
    {
        href: '/dashboard/content/pages/contact',
        icon: 'M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
        title: 'Contact Us',
        desc: 'Contact cards, social links, and all contact form labels',
        count: 'Contact page',
        color: 'bg-indigo-50 text-indigo-600',
    },
    {
        href: '/dashboard/content/pages/careers',
        icon: 'M21 13.255A23.931 23.931 0 0 1 12 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2m4 6h.01M5 20h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z',
        title: 'Careers',
        desc: 'Job listings, culture section, and "no openings" fallback text',
        count: 'Jobs page',
        color: 'bg-lime-50 text-lime-600',
    },
    {
        href: '/dashboard/content/pages/export',
        icon: 'M3 15a4 4 0 0 0 4 4h9a5 5 0 0 0 1.82-9.61 6 6 0 0 0-11.4-1.59A4 4 0 0 0 3 15z',
        title: 'Export',
        desc: 'Export markets, certifications, why-us cards, and contact info',
        count: 'Export page',
        color: 'bg-sky-50 text-sky-600',
    },
];

export default function ContentPage() {
    const customPages = listPages();

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

            <div className="mt-10 mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-ink">Custom Pages</h2>
                    <p className="text-sm text-neutral-500 mt-0.5">Pages you've built from scratch with the section editor.</p>
                </div>
                <Link href="/dashboard/content/pages/new"
                    className="px-4 py-2 rounded-lg bg-ink text-white text-sm font-medium hover:bg-ink/80 transition-colors">
                    + New Page
                </Link>
            </div>

            {customPages.length === 0 ? (
                <div className="bg-white border border-dashed border-neutral-300 rounded-xl p-8 text-center text-sm text-neutral-400">
                    No custom pages yet — create one to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {customPages.map(p => (
                        <Link key={p.slug} href={`/dashboard/content/pages/${p.slug}`}
                            className="group bg-white border border-neutral-200 rounded-xl p-5 flex flex-col gap-4 hover:border-neutral-300 hover:shadow-sm transition-all">
                            <div>
                                <p className="font-semibold text-ink group-hover:text-neutral-900">{p.title}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">/{p.slug}</p>
                            </div>
                            <div className="mt-auto text-xs font-medium text-neutral-400 group-hover:text-ink flex items-center gap-1 transition-colors">
                                Edit →
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
