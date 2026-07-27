import type { Metadata } from 'next';

interface PageMeta {
    titleEn?: string;
    descEn?: string;
    ogImage?: string;
}

interface Fallback {
    title: string;
    description: string;
}

export function buildPageMetadata(meta: PageMeta | undefined, fallback: Fallback): Metadata {
    const title = meta?.titleEn || fallback.title;
    const description = meta?.descEn || fallback.description;
    const images = meta?.ogImage ? [{ url: meta.ogImage }] : undefined;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            siteName: 'Sarayo Alwadiya',
            images,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: meta?.ogImage ? [meta.ogImage] : undefined,
        },
    };
}
