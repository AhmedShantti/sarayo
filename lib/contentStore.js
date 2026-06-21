import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const VALID_SECTIONS = [
    'products', 'features', 'navigation', 'hero', 'stats', 'footer', 'translations',
    'brand', 'chipsy', 'wafer',
    'pages/about', 'pages/contact', 'pages/careers', 'pages/export',
];

// Use the database whenever a connection string is configured (Vercel/prod).
// Without one (local dev), fall back to the bundled JSON files on disk.
const useDb = !!process.env.DATABASE_URL;

function assertValid(section) {
    if (!VALID_SECTIONS.includes(section)) {
        throw new Error(`Unknown content section: ${section}`);
    }
}

// The JSON shipped in the repo — the default/seed content for a section.
function readFileContent(section) {
    const file = path.join(CONTENT_DIR, `${section}.json`);
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export async function readContent(section) {
    assertValid(section);

    if (useDb) {
        try {
            const row = await prisma.siteContent.findUnique({ where: { section } });
            if (row) return row.data;
        } catch (e) {
            // DB unreachable / table missing — don't break the public site,
            // fall back to the bundled defaults so pages still render.
            console.error(`[contentStore] DB read failed for "${section}":`, e.message);
        }
        // No saved row yet: serve the bundled default.
        return readFileContent(section);
    }

    return readFileContent(section);
}

export async function writeContent(section, data) {
    assertValid(section);

    if (useDb) {
        await prisma.siteContent.upsert({
            where: { section },
            create: { section, data },
            update: { data },
        });
        return;
    }

    // No DATABASE_URL configured — local dev persists back to the JSON file.
    try {
        const file = path.join(CONTENT_DIR, `${section}.json`);
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
        if (e.code === 'EROFS' || e.code === 'EACCES') {
            throw new Error(
                'Cannot save: DATABASE_URL is not set on this deployment and the filesystem is read-only. ' +
                'Add DATABASE_URL and DIRECT_URL to the Vercel environment variables (Production + Preview) and redeploy.'
            );
        }
        throw e;
    }
}

export function listMediaFiles() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) return [];
    return fs.readdirSync(uploadsDir)
        .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
        .map(f => ({ name: f, url: `/uploads/${f}` }));
}
