import Link from 'next/link';
import DashboardNav from '@/components/DashboardNav';
import DashboardTopbar from '@/components/DashboardTopbar';

export const metadata = {
    title: 'Dashboard — Sarayo Alwadiya',
    description: 'Sarayo admin dashboard',
};

export default function DashboardLayout({children}) {
    return (
        <div className="min-h-screen bg-neutral-50 grid grid-cols-1 md:grid-cols-[240px_1fr] text-ink">
            <aside className="bg-white border-r border-neutral-200 flex flex-col md:sticky md:top-0 md:h-screen relative">
                {/* Subtle brand accent stripe down the right edge of the sidebar */}
                <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent"
                />

                <Link
                    href="/"
                    className="flex items-center gap-3 px-5 py-5 border-b border-neutral-200 group"
                >
                    <span className="inline-flex w-9 h-9 rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-50 items-center justify-center ring-1 ring-neutral-200 group-hover:ring-ink transition-all">
                        <img src="/images.png" alt="Sarayo" className="w-7 h-7 object-contain" />
                    </span>
                    <div className="leading-tight">
                        <span className="block text-sm font-semibold tracking-tight">Sarayo</span>
                        <span className="block text-[10px] uppercase tracking-[0.14em] text-neutral-500 mt-0.5">Admin</span>
                    </div>
                </Link>

                <div className="flex-1 px-3 py-4 overflow-y-auto">
                    <span className="block px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                        Workspace
                    </span>
                    <DashboardNav />
                </div>

                <div className="border-t border-neutral-200 px-5 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 hover:text-ink transition-colors inline-flex items-center gap-1.5"
                    >
                        <span>←</span> Back to site
                    </Link>
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-neutral-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Live
                    </span>
                </div>
            </aside>

            <div className="flex flex-col min-h-screen">
                <DashboardTopbar />
                <main className="flex-1 p-6 md:p-8 overflow-x-hidden">{children}</main>
            </div>
        </div>
    );
}
