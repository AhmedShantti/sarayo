import { revalidatePath } from 'next/cache';
import { listPages } from '@/lib/contentStore';

const STATIC_ROUTES = ['/', '/products', '/about', '/contact', '/careers', '/export', '/chipsy', '/wafer'];

const SECTION_TO_PATHS = {
    products: ['/products', '/'],
    features: ['/'],
    hero: ['/'],
    stats: ['/'],
    footer: STATIC_ROUTES,
    brand: STATIC_ROUTES,
    translations: STATIC_ROUTES,
    chipsy: ['/chipsy'],
    wafer: ['/wafer'],
};

export function revalidateForSection(section) {
    if (section === 'navigation') {
        STATIC_ROUTES.forEach(revalidatePath);
        listPages().forEach(p => revalidatePath(`/${p.slug}`));
        return;
    }

    if (section.startsWith('pages/')) {
        const slug = section.slice('pages/'.length);
        revalidatePath(`/${slug}`);
        revalidatePath('/');
        return;
    }

    (SECTION_TO_PATHS[section] || ['/']).forEach(revalidatePath);
}
