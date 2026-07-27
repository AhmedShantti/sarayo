// Declarative field schema per section type — drives the generic dashboard
// form renderer (components/dashboard/SectionFormRenderer.jsx). Keep in sync
// with the default props shape each section component in components/sections
// expects, and with SECTION_LABELS below (used for the "+ Add section" palette).

export const SECTION_SCHEMAS = {
    hero: {
        fields: [
            { key: 'chip', label: 'Chip', bi: true },
            { key: 'headline', label: 'Headline', bi: true },
            { key: 'sub', label: 'Sub', bi: true, multiline: true },
        ],
    },
    richText: {
        fields: [
            { key: 'title', label: 'Title', bi: true },
            { key: 'paragraphs', label: 'Paragraphs', type: 'list', itemFields: [
                { key: 'en', label: 'Paragraph (EN)', multiline: true },
                { key: 'ar', label: 'Paragraph (AR)', multiline: true, rtl: true },
            ] },
        ],
    },
    statGrid: {
        fields: [
            { key: 'title', label: 'Title', bi: true },
            { key: 'stats', label: 'Stats', type: 'list', itemFields: [
                { key: 'value', label: 'Value' },
                { key: 'labelEn', label: 'Label (EN)' },
                { key: 'labelAr', label: 'Label (AR)', rtl: true },
            ] },
        ],
    },
    cardGrid: {
        fields: [
            { key: 'chip', label: 'Chip', bi: true },
            { key: 'title', label: 'Title', bi: true },
            { key: 'cards', label: 'Cards', type: 'list', itemFields: [
                { key: 'icon', label: 'Icon', type: 'icon' },
                { key: 'titleEn', label: 'Title (EN)' },
                { key: 'titleAr', label: 'Title (AR)', rtl: true },
                { key: 'textEn', label: 'Text (EN)', multiline: true },
                { key: 'textAr', label: 'Text (AR)', multiline: true, rtl: true },
            ] },
        ],
    },
    imageGallery: {
        fields: [
            { key: 'title', label: 'Title', bi: true },
            { key: 'images', label: 'Images', type: 'list', itemFields: [
                { key: 'src', label: 'Image', type: 'image' },
                { key: 'altEn', label: 'Alt text (EN)' },
                { key: 'altAr', label: 'Alt text (AR)', rtl: true },
            ] },
        ],
    },
    ctaBanner: {
        fields: [
            { key: 'title', label: 'Title', bi: true },
            { key: 'sub', label: 'Sub', bi: true, multiline: true },
            { key: 'btn1En', label: 'Button 1 (EN)' },
            { key: 'btn1Ar', label: 'Button 1 (AR)', rtl: true },
            { key: 'btn1Href', label: 'Button 1 URL' },
            { key: 'btn2En', label: 'Button 2 (EN)' },
            { key: 'btn2Ar', label: 'Button 2 (AR)', rtl: true },
            { key: 'btn2Href', label: 'Button 2 URL' },
        ],
    },
    contactForm: {
        fields: [
            { key: 'title', label: 'Title', bi: true },
            { key: 'sub', label: 'Sub', bi: true, multiline: true },
            { key: 'recipient', label: 'Recipient email' },
            { key: 'submitEn', label: 'Submit button (EN)' },
            { key: 'submitAr', label: 'Submit button (AR)', rtl: true },
            { key: 'successEn', label: 'Success message (EN)' },
            { key: 'successAr', label: 'Success message (AR)', rtl: true },
        ],
    },
    jobListings: {
        fields: [
            { key: 'title', label: 'Title', bi: true },
            { key: 'noJobsEn', label: 'No openings message (EN)' },
            { key: 'noJobsAr', label: 'No openings message (AR)', rtl: true },
            { key: 'jobs', label: 'Jobs', type: 'list', itemFields: [
                { key: 'titleEn', label: 'Title (EN)' },
                { key: 'titleAr', label: 'Title (AR)', rtl: true },
                { key: 'deptEn', label: 'Department (EN)' },
                { key: 'deptAr', label: 'Department (AR)', rtl: true },
                { key: 'locationEn', label: 'Location (EN)' },
                { key: 'locationAr', label: 'Location (AR)', rtl: true },
                { key: 'typeEn', label: 'Type (EN)' },
                { key: 'typeAr', label: 'Type (AR)', rtl: true },
                { key: 'descEn', label: 'Description (EN)', multiline: true },
                { key: 'descAr', label: 'Description (AR)', multiline: true, rtl: true },
                { key: 'applyUrl', label: 'Apply URL' },
                { key: 'active', label: 'Active', type: 'boolean' },
            ] },
        ],
    },
};

export const SECTION_LABELS = {
    hero: 'Hero banner',
    richText: 'Rich text / story',
    statGrid: 'Stat grid',
    cardGrid: 'Card grid (features / values)',
    imageGallery: 'Image gallery',
    ctaBanner: 'CTA banner',
    contactForm: 'Contact form',
    jobListings: 'Job listings',
};

export function defaultPropsFor(type) {
    switch (type) {
        case 'hero': return { chipEn: '', chipAr: '', headlineEn: '', headlineAr: '', subEn: '', subAr: '' };
        case 'richText': return { titleEn: '', titleAr: '', paragraphs: [] };
        case 'statGrid': return { titleEn: '', titleAr: '', stats: [] };
        case 'cardGrid': return { chipEn: '', chipAr: '', titleEn: '', titleAr: '', cards: [] };
        case 'imageGallery': return { titleEn: '', titleAr: '', images: [] };
        case 'ctaBanner': return { titleEn: '', titleAr: '', subEn: '', subAr: '', btn1En: '', btn1Ar: '', btn1Href: '', btn2En: '', btn2Ar: '', btn2Href: '' };
        case 'contactForm': return { titleEn: '', titleAr: '', subEn: '', subAr: '', recipient: '', submitEn: 'Send', submitAr: 'إرسال', successEn: 'Thanks — we\'ll be in touch.', successAr: 'شكرًا لك — سنتواصل معك قريبًا.' };
        case 'jobListings': return { titleEn: '', titleAr: '', noJobsEn: 'No openings right now — check back soon.', noJobsAr: 'لا توجد وظائف شاغرة حاليًا — تابعنا قريبًا.', jobs: [] };
        default: return {};
    }
}
