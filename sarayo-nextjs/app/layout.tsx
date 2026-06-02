import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { CartProvider } from '@/lib/CartContext';
import { ToastProvider } from '@/lib/ToastContext';
import { FlavorProvider } from '@/lib/FlavorContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import './globals.css';

export const metadata: Metadata = {
    title: 'Sarayo Alwadiya — Crunchy. Flavorful. Irresistible.',
    description: 'Sarayo Alwadiya — Crunchy, flavorful, irresistible chips since 2002.',
    icons: {
        icon: '/images.png',
        shortcut: '/images.png',
        apple: '/images.png',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&family=Cairo:wght@400;500;600;700;900&family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <LanguageProvider>
                    <CartProvider>
                        <ToastProvider>
                            <FlavorProvider>{children}</FlavorProvider>
                        </ToastProvider>
                    </CartProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
