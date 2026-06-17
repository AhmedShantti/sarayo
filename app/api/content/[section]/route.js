import { readContent, writeContent } from '@/lib/contentStore';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        const data = readContent(params.section);
        return Response.json(data);
    } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
    }
}

export async function PUT(req, { params }) {
    try {
        const body = await req.json();
        writeContent(params.section, body);
        revalidatePath('/');
        revalidatePath('/products');
        return Response.json({ ok: true });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
    }
}
