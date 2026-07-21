import { readContent, writeContent } from '@/lib/contentStore';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
<<<<<<< HEAD
        const section = Array.isArray(params.section) ? params.section.join('/') : params.section;
        const data = await readContent(section);
=======
        const { section: raw } = await params;
        const section = Array.isArray(raw) ? raw.join('/') : raw;
        const data = readContent(section);
>>>>>>> upstream/main
        return Response.json(data);
    } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
    }
}

export async function PUT(req, { params }) {
    try {
        const { section: raw } = await params;
        const section = Array.isArray(raw) ? raw.join('/') : raw;
        const body = await req.json();
        await writeContent(section, body);
        revalidatePath('/');
        revalidatePath('/products');
        revalidatePath('/about');
        revalidatePath('/contact');
        revalidatePath('/careers');
        revalidatePath('/export');
        revalidatePath('/chipsy');
        revalidatePath('/wafer');
        return Response.json({ ok: true });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
    }
}
