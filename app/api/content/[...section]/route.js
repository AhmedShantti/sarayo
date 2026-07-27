import { readContent, writeContent } from '@/lib/contentStore';
import { revalidateForSection } from '@/lib/revalidation';

export const dynamic = 'force-dynamic';

export async function GET(req, { params }) {
    try {
        const { section: raw } = await params;
        const section = Array.isArray(raw) ? raw.join('/') : raw;
        const data = readContent(section);
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
        writeContent(section, body);
        revalidateForSection(section);
        return Response.json({ ok: true });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 400 });
    }
}
