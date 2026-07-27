import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LandingNav from '@/components/landing/LandingNavServer';
import ProductsView from '@/components/landing/ProductsView';
import LandingFooter from '@/components/landing/LandingFooter';
import { fetchCategory } from '@/lib/api';

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

interface ApiCategory {
    name: string;
    nameAr?: string | null;
    slug: string;
    description?: string | null;
}

// Looks the category up in the backend. `null` means the backend answered 404
// (no such category). `undefined` means we could not reach the backend at all —
// callers keep rendering in that case rather than showing a bogus 404.
async function loadCategory(slug: string): Promise<ApiCategory | null | undefined> {
    try {
        return (await fetchCategory(slug)) as ApiCategory | null;
    } catch {
        return undefined;
    }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
    const { category } = await params;
    const cat = await loadCategory(category);
    if (!cat) return { title: 'Shop — Sarayo Alwadiya' };
    return {
        title: `${cat.name} — Sarayo Alwadiya`,
        description:
            cat.description || `${cat.name} from Sarayo Alwadiya. Cut thick, fried crisp, seasoned loud.`,
    };
}

export default async function ProductsCategoryPage({ params }: CategoryPageProps) {
    const { category } = await params;
    const cat = await loadCategory(category);

    // Only 404 when the backend positively said the category does not exist.
    if (cat === null) notFound();

    return (
        <main>
            <LandingNav />
            <ProductsView
                category={category}
                categoryName={cat?.name}
                categoryNameAr={cat?.nameAr}
            />
            <LandingFooter />
        </main>
    );
}
