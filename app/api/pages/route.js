import { listPages, registerPage, unregisterPage } from '@/lib/contentStore';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

function slugify(title) {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export async function GET() {
    return Response.json({ pages: listPages() });
}

export async function POST(req) {
    try {
        const { title } = await req.json();
        if (!title || !title.trim()) {
            return Response.json({ error: 'Title is required' }, { status: 400 });
        }
        const slug = slugify(title);
        const result = registerPage({ slug, title: title.trim() });
        return Response.json(result);
    } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
    }
}

export async function DELETE(req) {
    try {
        const { slug } = await req.json();
        if (!slug) return Response.json({ error: 'slug is required' }, { status: 400 });
        unregisterPage(slug);
        revalidatePath(`/${slug}`);
        return Response.json({ ok: true });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
    }
}
