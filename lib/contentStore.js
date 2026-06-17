import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), 'content');

const VALID_SECTIONS = [
    'products', 'features', 'navigation', 'hero', 'stats', 'footer', 'translations',
    'brand', 'chipsy', 'wafer',
    'pages/about', 'pages/contact', 'pages/careers', 'pages/export',
];

export function readContent(section) {
    if (!VALID_SECTIONS.includes(section)) {
        throw new Error(`Unknown content section: ${section}`);
    }
    const file = path.join(CONTENT_DIR, `${section}.json`);
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

export function writeContent(section, data) {
    if (!VALID_SECTIONS.includes(section)) {
        throw new Error(`Unknown content section: ${section}`);
    }
    const file = path.join(CONTENT_DIR, `${section}.json`);
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}

export function listMediaFiles() {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) return [];
    return fs.readdirSync(uploadsDir)
        .filter(f => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
        .map(f => ({ name: f, url: `/uploads/${f}` }));
}
