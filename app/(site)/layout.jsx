import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import SmoothScroll from '@/components/SmoothScroll';

export default function SiteLayout({children}) {
    return (
        <div className="site-shell min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <BackToTop />
            <SmoothScroll />
        </div>
    );
}
