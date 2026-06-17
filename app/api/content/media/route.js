import { writeFile, readdir } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadsDir() {
    if (!existsSync(UPLOADS_DIR)) mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function GET() {
    ensureUploadsDir();
    const files = await readdir(UPLOADS_DIR);
    const images = files
        .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
        .map(f => ({ name: f, url: `/uploads/${f}` }));
    return Response.json({ images });
}

export async function POST(req) {
    ensureUploadsDir();
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        if (!file) return Response.json({ error: 'No file provided' }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const ext = path.extname(file.name).toLowerCase();
        if (!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(ext)) {
            return Response.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        const dest = path.join(UPLOADS_DIR, safeName);
        await writeFile(dest, buffer);

        return Response.json({ ok: true, url: `/uploads/${safeName}`, name: safeName });
    } catch (e) {
        return Response.json({ error: e.message }, { status: 500 });
    }
}
