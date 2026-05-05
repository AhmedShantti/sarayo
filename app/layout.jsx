import {CartProvider} from '@/lib/CartContext';
import {ToastProvider} from '@/lib/ToastContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import SmoothScroll from '@/components/SmoothScroll';
import './globals.css';

export const metadata = {
    title: 'Sarayo Alwadiya — Crunchy. Flavorful. Irresistible.',
    description:
        'Sarayo Alwadiya — Crunchy, flavorful, irresistible chips since 2002.',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({children}) {
    return (
        <html lang="en">
            <head>
                {/*
                    Google Fonts loaded directly so the existing CSS keeps working —
                    it references the fonts by name (e.g. 'Bowlby One', 'Fredoka').
                */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=DM+Sans:wght@400;500;600;700&family=Cairo:wght@700;900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                <CartProvider>
                    <ToastProvider>
                        <Header />
                        {children}
                        <Footer />
                        <BackToTop />
                        <SmoothScroll />
                    </ToastProvider>
                </CartProvider>
            </body>
        </html>
    );
}
