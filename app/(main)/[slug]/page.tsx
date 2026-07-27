import { notFound } from 'next/navigation';
import { readContent, listPages } from '@/lib/contentStore';
import { buildPageMetadata } from '@/lib/seo';
import SectionRenderer from '@/components/sections/SectionRenderer';
import LandingNav from '@/components/landing/LandingNavServer';
import LandingFooter from '@/components/landing/LandingFooter';

export const dynamic = 'force-dynamic';

function findPage(slug: string) {
    return listPages().find((p: { slug: string }) => p.slug === slug);
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const page = findPage(params.slug);
    if (!page) return {};
    const data = await readContent(`pages/${params.slug}`);
    return buildPageMetadata(data.meta, { title: `${page.title} — Sarayo Alwadiya`, description: '' });
}

export default async function DynamicPageRoute({ params }: { params: { slug: string } }) {
    const page = findPage(params.slug);
    if (!page) notFound();

    const data = await readContent(`pages/${params.slug}`);
    return (
        <main>
            <LandingNav />
            <div className="pt-24">
                <SectionRenderer sections={data.sections || []} />
            </div>
            <LandingFooter />
        </main>
    );
}
