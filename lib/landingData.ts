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
    category: 'Classic' | 'Cheesy' | 'Spicy' | 'Tangy';
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

export const NAV_LINKS = [
    { label: 'Chipsy', labelAr: 'شيبسي', href: '/products' },
    { label: 'Wafer', labelAr: 'ويفر', href: '/wafer' },
    { label: 'Export Products', labelAr: 'منتجات التصدير', href: '/export' },
    { label: 'Careers', labelAr: 'وظائف', href: '/careers' },
    { label: 'About Us', labelAr: 'من نحن', href: '/about' },
    { label: 'Contact Us', labelAr: 'تواصل معنا', href: '/contact' },
] as const;

export const PRODUCTS: Product[] = [
    { src: '/lays-classic.png', name: 'Classic', nameAr: 'كلاسيك', flavor: 'Salted & Golden', flavorAr: 'مملّح وذهبي', tag: 'Best seller', tagAr: 'الأكثر مبيعًا', tone: 'deep', category: 'Classic', price: '25 EGP', priceValue: 25, description: 'The original golden crunch — thin-sliced potatoes fried crisp and lightly salted.', descriptionAr: 'القرمشة الذهبية الأصلية — شرائح بطاطس رفيعة مقلية حتى القرمشة ومملّحة قليلًا.' },
    { src: '/lays-cheddar.png', name: 'Cheddar', nameAr: 'شيدر', flavor: 'Sharp Cheese', flavorAr: 'جبن حاد', tag: 'Bold', tagAr: 'جريء', tone: 'yellow', category: 'Cheesy', price: '30 EGP', priceValue: 30, description: 'Sharp aged cheddar dusted thick over every crunchy ridge for a bold, cheesy hit.', descriptionAr: 'جبن شيدر معتّق ومرشوش بكثافة على كل تموجة مقرمشة لنكهة جبنية جريئة.' },
    { src: '/lays-indian.png', name: 'Indian Magic', nameAr: 'ماسالا هندي', flavor: 'Masala Spice', flavorAr: 'بهارات ماسالا', tag: 'Spicy', tagAr: 'حار', tone: 'deep', category: 'Spicy', price: '30 EGP', priceValue: 30, description: 'A bold masala blend — cumin, chili and warm spice layered into every bite.', descriptionAr: 'خلطة ماسالا جريئة — كمون وفلفل حار وبهارات دافئة في كل قضمة.' },
    { src: '/lays-salt-vinegar.png', name: 'Salt & Vinegar', nameAr: 'ملح وخل', flavor: 'Tangy Bite', flavorAr: 'لذعة منعشة', tag: 'Zesty', tagAr: 'منعش', tone: 'cream', category: 'Tangy', price: '28 EGP', priceValue: 28, description: 'A tangy vinegar zing balanced with a clean, salted finish that keeps you reaching back.', descriptionAr: 'لذعة خل منعشة متوازنة مع لمسة ملح نظيفة تجعلك تعود للمزيد.' },
    { src: '/lays-wavy.png', name: 'Wavy', nameAr: 'مموّج', flavor: 'Extra Crunch', flavorAr: 'قرمشة إضافية', tag: 'Thick cut', tagAr: 'قطع سميك', tone: 'deep', category: 'Classic', price: '32 EGP', priceValue: 32, description: 'Extra-thick ridged cut, built to scoop and crunch twice as loud.', descriptionAr: 'قطع متموّج سميك، مصمّم للغمس والقرمشة بصوت مضاعف.' },
    { src: '/lays-classic.png', name: 'Sea Salt', nameAr: 'ملح البحر', flavor: 'Pure & Simple', flavorAr: 'نقي وبسيط', tag: 'Light', tagAr: 'خفيف', tone: 'deep', category: 'Classic', price: '24 EGP', priceValue: 24, description: 'Just sea salt and golden potato — the clean, everyday crunch.', descriptionAr: 'فقط ملح بحر وبطاطس ذهبية — القرمشة النظيفة اليومية.' },
    { src: '/lays-cheddar.png', name: 'Double Cheese', nameAr: 'دبل تشيز', flavor: 'Extra Cheesy', flavorAr: 'جبن مضاعف', tag: 'Loaded', tagAr: 'محمّل', tone: 'yellow', category: 'Cheesy', price: '32 EGP', priceValue: 32, description: 'Two layers of cheese seasoning for an unapologetically rich, savory hit.', descriptionAr: 'طبقتان من تتبيلة الجبن لنكهة غنية ولذيذة بلا تحفّظ.' },
    { src: '/lays-indian.png', name: 'Chili Lime', nameAr: 'تشيلي لايم', flavor: 'Zesty Heat', flavorAr: 'حرارة منعشة', tag: 'Hot', tagAr: 'حار جدًا', tone: 'deep', category: 'Spicy', price: '30 EGP', priceValue: 30, description: 'Bright lime cuts through a slow chili burn — sharp, hot and addictive.', descriptionAr: 'ليمون منعش يخترق لذعة الفلفل الحار — حادّ وحار وإدماني.' },
    { src: '/lays-wavy.png', name: 'Sour Cream & Onion', nameAr: 'كريمة وبصل', flavor: 'Cool & Creamy', flavorAr: 'منعش وكريمي', tag: 'Fan fave', tagAr: 'المفضّل', tone: 'cream', category: 'Tangy', price: '32 EGP', priceValue: 32, description: 'Cool sour cream and toasted onion folded into every wavy ridge.', descriptionAr: 'كريمة حامضة منعشة وبصل محمّص في كل تموجة.' },
    { src: '/lays-salt-vinegar.png', name: 'Smoky BBQ', nameAr: 'باربكيو مدخّن', flavor: 'Sweet & Smoky', flavorAr: 'حلو ومدخّن', tag: 'Smoky', tagAr: 'مدخّن', tone: 'deep', category: 'Classic', price: '28 EGP', priceValue: 28, description: 'Sweet, smoky barbecue rub with a slow-grilled finish.', descriptionAr: 'تتبيلة باربكيو حلوة ومدخّنة بلمسة شواء بطيء.' },
];

export const FEATURES: Feature[] = [
    { title: 'Cut Thick, Fried Crisp', titleAr: 'شرائح سميكة، مقلية ومقرمشة', text: 'Every chip is sliced thick and fried to a loud, shattering crunch you can hear across the room.', textAr: 'كل شريحة تُقطع سميكة وتُقلى حتى قرمشة صاخبة تُسمع عبر الغرفة.', chip: 'The Crunch', chipAr: 'القرمشة', icon: 'spark' },
    { title: 'Real, Loud Flavor', titleAr: 'نكهة حقيقية وجريئة', text: 'Spices toasted in small batches and tumbled on warm — never dusted with a whisper.', textAr: 'بهارات مُحمّصة على دفعات صغيرة وتُقلّب وهي دافئة — لا مجرد رشّة خفيفة.', chip: 'Big Taste', chipAr: 'طعم كبير', icon: 'flame' },
    { title: 'Clean Ingredients', titleAr: 'مكونات نظيفة', text: 'No mystery list. Potatoes, oil, and seasoning you can actually pronounce.', textAr: 'لا قائمة غامضة. بطاطس وزيت وتتبيلة تستطيع نطقها فعلًا.', chip: 'Honest', chipAr: 'صادق', icon: 'leaf' },
    { title: 'Crunched Since 2002', titleAr: 'نقرمش منذ ٢٠٠٢', text: 'Two decades of getting the snack right — now shipped fresh across the region.', textAr: 'عقدان من إتقان السناك — والآن يُشحن طازجًا عبر المنطقة.', chip: 'Since 2002', chipAr: 'منذ ٢٠٠٢', icon: 'globe' },
];

export const CATEGORIES = ['All', 'Classic', 'Cheesy', 'Spicy', 'Tangy'] as const;

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
