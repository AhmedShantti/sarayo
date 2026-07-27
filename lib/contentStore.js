import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PAGES_INDEX_FILE = path.join(CONTENT_DIR, 'pages-index.json');

const VALID_SECTIONS = [
    'products', 'features', 'navigation', 'hero', 'stats', 'footer', 'translations',
    'brand', 'chipsy', 'wafer',
    'pages/about', 'pages/contact', 'pages/careers', 'pages/export',
];

const RESERVED_SLUGS = ['about', 'careers', 'chipsy', 'contact', 'export', 'products', 'wafer', 'dashboard', 'api', 'cart'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// A dynamically-registered page lives at content/pages/<slug>.json and is not
// one of the built-in sections above.
function isDynamicPageSection(section) {
    if (!section.startsWith('pages/')) return false;
    const slug = section.slice('pages/'.length);
    return SLUG_PATTERN.test(slug) && !VALID_SECTIONS.includes(section);
}

// Use the database whenever a connection string is configured (Vercel/prod).
// Without one (local dev), fall back to the bundled JSON files on disk.
const useDb = !!process.env.DATABASE_URL;

function assertValid(section) {
    if (!VALID_SECTIONS.includes(section) && !isDynamicPageSection(section)) {
        throw new Error(`Unknown content section: ${section}`);
    }
}

// The JSON shipped in the repo — the default/seed content for a section.
function readFileContent(section) {
    const file = path.join(CONTENT_DIR, `${section}.json`);
    if (!fs.existsSync(file)) throw new Error(`Unknown content section: ${section}`);
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

    // Dynamic pages must be registered before their content can be saved.
    if (isDynamicPageSection(section)) {
        const slug = section.slice('pages/'.length);
        if (!listPages().some(p => p.slug === slug)) {
            throw new Error(`Unknown content section: ${section}`);
        }
    }

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

export function listPages() {
    if (!fs.existsSync(PAGES_INDEX_FILE)) return [];
    return JSON.parse(fs.readFileSync(PAGES_INDEX_FILE, 'utf-8')).pages || [];
}

function writePagesIndex(pages) {
    fs.writeFileSync(PAGES_INDEX_FILE, JSON.stringify({ pages }, null, 2), 'utf-8');
}

export function registerPage({ slug, title }) {
    if (!SLUG_PATTERN.test(slug)) {
        throw new Error('Invalid slug: use lowercase letters, numbers, and hyphens only');
    }
    if (RESERVED_SLUGS.includes(slug)) {
        throw new Error(`"${slug}" is a reserved route and can't be used as a page slug`);
    }
    const pages = listPages();
    if (pages.some(p => p.slug === slug)) {
        throw new Error(`A page with slug "${slug}" already exists`);
    }
    pages.push({ slug, title, createdAt: new Date().toISOString(), status: 'published' });
    writePagesIndex(pages);

    const pageFile = path.join(CONTENT_DIR, 'pages', `${slug}.json`);
    fs.writeFileSync(pageFile, JSON.stringify({
        meta: { titleEn: title, titleAr: '', descEn: '', descAr: '', ogImage: '' },
        sections: [],
    }, null, 2), 'utf-8');

    return { slug };
}

export function unregisterPage(slug) {
    const pages = listPages();
    writePagesIndex(pages.filter(p => p.slug !== slug));
}

export function listMediaFiles() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) return [];
    return fs.readdirSync(uploadsDir)
        .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
        .map(f => ({ name: f, url: `/uploads/${f}` }));
}
