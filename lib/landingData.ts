// Client-safe static data — no Node.js imports.
// Client components import from here. Server components use lib/contentStore.js
// to read the live JSON files so CMS edits are reflected immediately.

export type Locale = 'en' | 'ar';

export interface Product {
    id?: string;
    src: string;
    name: string;
    nameAr: string;
    flavor: string;
    flavorAr: string;
    tag: string;
    tagAr: string;
    tone: 'deep' | 'cream' | 'yellow';
    category: 'Crisps' | 'Wafer';
    price: string;
    priceValue: number;
    description: string;
    descriptionAr: string;
}

export interface Feature {
    id?: string;
    title: string;
    titleAr: string;
    text: string;
    textAr: string;
    chip: string;
    chipAr: string;
    icon: 'flame' | 'leaf' | 'spark' | 'globe';
}

export interface NavItem {
    id: string;
    label: string;
    labelAr: string;
    href: string;
    menuLabel?: string;
    menuLabelAr?: string;
    viewAllLabel?: string;
    viewAllLabelAr?: string;
    img?: string;
    sub?: string;
    subAr?: string;
    badge?: string;
    badgeAr?: string;
    children?: NavItem[];
}

export const PRODUCTS: Product[] = [
    { src: '/uploads/1781697285378-____________________________-97.png', name: 'Cornice Mexican Chili', nameAr: 'كورنيس بالشطة المكسيكية', flavor: 'Mexican Chili', flavorAr: 'الشطة المكسيكية', tag: 'Spicy', tagAr: 'حار', tone: 'deep', category: 'Crisps', price: '25 EGP', priceValue: 25, description: "A Mexican-style chili kick over Cornice's golden corn crunch.", descriptionAr: 'شطة مكسيكية حارة وجريئة فوق قرمشة كورنيس الذهبية.' },
    { src: '/uploads/1783218621522-cornice_chili_and_lemon_flavor_10_L.E-Photoroom.png', name: 'Cornice Chili & Lemon', nameAr: 'كورنيس بالشطة والليمون', flavor: 'Chili & Lemon', flavorAr: 'شطة وليمون', tag: 'Bold', tagAr: 'جريء', tone: 'yellow', category: 'Crisps', price: '22 EGP', priceValue: 22, description: 'Bright lemon meets chili heat in every crunchy piece.', descriptionAr: 'لمسة ليمون منعشة تلتقي بحرارة الشطة في كل قرمشة.' },
    { src: '/wafer-products/wafer-choco.png', name: 'Choco Hazel', nameAr: 'شوكو هيزل', flavor: 'Dark Chocolate & Hazelnut', flavorAr: 'شوكولاتة داكنة وهيزل', tag: 'Bestseller', tagAr: 'الأكثر مبيعاً', tone: 'deep', category: 'Wafer', price: '22 EGP', priceValue: 22, description: 'Rich dark chocolate meets roasted hazelnut in every crispy wafer layer.', descriptionAr: 'الشوكولاتة الداكنة الغنية تلتقي بالهيزل المحمّص في كل طبقة ويفر مقرمشة.' },
    { src: '/wafer-products/wafer-strewberry.png', name: 'Strawberry', nameAr: 'فراولة', flavor: 'Strawberry Cream', flavorAr: 'كريمة فراولة', tag: 'Fan Fave', tagAr: 'المفضّل', tone: 'cream', category: 'Wafer', price: '20 EGP', priceValue: 20, description: 'Sweet strawberry cream filling in a perfectly crunchy wafer shell.', descriptionAr: 'حشوة كريمة فراولة حلوة في قشرة ويفر مقرمشة تماماً.' },
];

export const FEATURES: Feature[] = [
    { title: 'Baked, Not Fried', titleAr: 'مخبوز مش مقلي', text: 'Every Cornice piece is baked, not fried — a lighter, cleaner crunch you can still hear across the room.', textAr: 'كل قطعة كورنيس بتتخبز مش بتتقلى — قرمشة أخف وأنضف تسمعها من غير ما تشوفها.', chip: 'The Crunch', chipAr: 'القرمشة', icon: 'spark' },
    { title: 'Bold, Real Flavor', titleAr: 'نكهة حقيقية وجريئة', text: 'From Korean chili to hot sausage — every flavor is built to be noticed.', textAr: 'من الشطة الكورية للسجق الحار — كل نكهة اتصممت عشان تتحس.', chip: 'Big Taste', chipAr: 'طعم كبير', icon: 'flame' },
    { title: 'Clean Ingredients', titleAr: 'مكونات نظيفة', text: 'No mystery list — ingredients you can actually read and pronounce.', textAr: 'من غير قايمة غامضة — مكونات تقدر تقراها وتنطقها فعلاً.', chip: 'Honest', chipAr: 'صادق', icon: 'leaf' },
    { title: 'Four Decades of Craft', titleAr: 'أربعة عقود من الخبرة', text: "Built on Sarayo Alwadiya's expertise since 1985 — now made fresh in Egypt.", textAr: 'خبرة سرايو الوادية الممتدة منذ ١٩٨٥ — الآن بتتصنّع طازة في مصر.', chip: 'Since 1985', chipAr: 'منذ ١٩٨٥', icon: 'globe' },
];

export const CATEGORIES = ['All', 'Crisps', 'Wafer'] as const;

export function localizeProduct(p: Product, locale: Locale) {
    return locale === 'ar'
        ? { name: p.nameAr, flavor: p.flavorAr, tag: p.tagAr, description: p.descriptionAr }
        : { name: p.name, flavor: p.flavor, tag: p.tag, description: p.description };
}

export function localizeFeature(f: Feature, locale: Locale) {
    return locale === 'ar'
        ? { title: f.titleAr, text: f.textAr, chip: f.chipAr }
        : { title: f.title, text: f.text, chip: f.chip };
}

export function formatPrice(value: number, locale: Locale) {
    return locale === 'ar' ? `${value} جنيه` : `${value} EGP`;
}
