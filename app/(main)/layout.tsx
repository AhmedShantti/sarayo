import type { Metadata } from 'next';
import { anton, grotesk } from '@/lib/fonts';
import Grain from '@/components/landing/Grain';
import LandingCartProvider from '@/lib/LandingCart';
import CartDrawer from '@/components/landing/CartDrawer';
import './landing.css';

export const metadata: Metadata = {
    title: 'Sarayo Alwadiya — Don\'t Stop the Crunch',
    description:
        'Sarayo Alwadiya — chips and wafer, made in Egypt since 1985.',
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
