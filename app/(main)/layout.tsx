import type { Metadata } from 'next';
import { anton, grotesk } from '@/lib/fonts';
import Grain from '@/components/landing/Grain';
import LandingCartProvider from '@/lib/LandingCart';
import CartDrawer from '@/components/landing/CartDrawer';
import './landing.css';

export const metadata: Metadata = {
    title: 'Sarayo Alwadiya — Crunch in Style',
    description:
        'Sarayo Alwadiya — crunchy, flavorful, irresistible chips since 2002. Cut thick, fried crisp, seasoned loud.',
};

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${anton.variable} ${grotesk.variable} landing-root font-grotesk`}>
            <Grain />
            <LandingCartProvider>
                {children}
                <CartDrawer />
            </LandingCartProvider>
        </div>
    );
}
