import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PAGES_INDEX_FILE = path.join(CONTENT_DIR, 'pages-index.json');

const VALID_SECTIONS = [
    'products', 'features', 'navigation', 'hero', 'stats', 'footer', 'translations',
    'brand', 'chipsy', 'wafer',
    'pages/about', 'pages/contact', 'pages/careers', 'pages/export',
];

const RESERVED_SLUGS = ['about', 'careers', 'chipsy', 'contact', 'export', 'products', 'wafer', 'dashboard', 'api', 'cart'];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isDynamicPageSection(section) {
    if (!section.startsWith('pages/')) return false;
    const slug = section.slice('pages/'.length);
    return SLUG_PATTERN.test(slug) && !VALID_SECTIONS.includes(section);
}

export function readContent(section) {
    if (VALID_SECTIONS.includes(section)) {
        const file = path.join(CONTENT_DIR, `${section}.json`);
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
    if (isDynamicPageSection(section)) {
        const file = path.join(CONTENT_DIR, `${section}.json`);
        if (!fs.existsSync(file)) throw new Error(`Unknown content section: ${section}`);
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
    throw new Error(`Unknown content section: ${section}`);
}

export function writeContent(section, data) {
    if (VALID_SECTIONS.includes(section)) {
        const file = path.join(CONTENT_DIR, `${section}.json`);
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
        return;
    }
    if (isDynamicPageSection(section)) {
        const slug = section.slice('pages/'.length);
        if (!listPages().some(p => p.slug === slug)) {
            throw new Error(`Unknown content section: ${section}`);
        }
        const file = path.join(CONTENT_DIR, `${section}.json`);
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
        return;
    }
    throw new Error(`Unknown content section: ${section}`);
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
