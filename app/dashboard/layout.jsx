import DashboardNav from '@/components/DashboardNav';
import DashboardTopbar from '@/components/DashboardTopbar';
import DashboardSidebarLabels from '@/components/DashboardSidebarLabels';
import DashboardAuthGate from '@/components/DashboardAuthGate';
import Cursor from '@/components/landing/Cursor';

export const metadata = {
    title: 'Dashboard — Sarayo Alwadiya',
    description: 'Sarayo admin dashboard',
};

export default function DashboardLayout({children}) {
    return (
        <DashboardAuthGate>
        <div className="dashboard-root min-h-screen bg-neutral-50 grid grid-cols-1 md:grid-cols-[240px_1fr] text-ink">
            {/* Same motion cursor as the marketing site. */}
            <Cursor rootSelector=".dashboard-root" />
            <aside className="bg-white border-r border-neutral-200 flex flex-col md:sticky md:top-0 md:h-screen relative">
                {/* Subtle brand accent stripe down the right edge of the sidebar */}
                <span
                    aria-hidden="true"
                    className="absolute top-0 right-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-200 to-transparent"
                />

                <DashboardSidebarLabels>
                    <DashboardNav />
                </DashboardSidebarLabels>
            </aside>

            <div className="flex flex-col min-h-screen">
                <DashboardTopbar />
                <main className="flex-1 p-6 md:p-8 overflow-x-hidden">{children}</main>
            </div>
        </div>
        </DashboardAuthGate>
    );
}
