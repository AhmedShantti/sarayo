// Static content for the Sarayo Alwadiya landing page.
// Frontend-only — no fetching, no API. Uses the real brand photos in /public.

export const NAV_LINKS = [
    { label: 'Flavors', href: '/#showcase' },
    { label: 'Shop', href: '/products' },
    { label: 'Why Sarayo', href: '/#features' },
] as const;

export interface Product {
    src: string;
    name: string;
    flavor: string;
    tag: string;
    tone: 'deep' | 'cream' | 'yellow';
    category: 'Classic' | 'Cheesy' | 'Spicy' | 'Tangy';
    price: string;
    priceValue: number;
    description: string;
}

// The Lay's lineup — built from the provided brand photos in /public.
export const PRODUCTS: Product[] = [
    {
        src: '/lays-classic.png', name: 'Classic', flavor: 'Salted & Golden', tag: 'Best seller',
        tone: 'deep', category: 'Classic', price: '25 EGP', priceValue: 25,
        description: 'The original golden crunch — thin-sliced potatoes fried crisp and lightly salted.',
    },
    {
        src: '/lays-cheddar.png', name: 'Cheddar', flavor: 'Sharp Cheese', tag: 'Bold',
        tone: 'yellow', category: 'Cheesy', price: '30 EGP', priceValue: 30,
        description: 'Sharp aged cheddar dusted thick over every crunchy ridge for a bold, cheesy hit.',
    },
    {
        src: '/lays-indian.png', name: 'Indian Magic', flavor: 'Masala Spice', tag: 'Spicy',
        tone: 'deep', category: 'Spicy', price: '30 EGP', priceValue: 30,
        description: 'A bold masala blend — cumin, chili and warm spice layered into every bite.',
    },
    {
        src: '/lays-salt-vinegar.png', name: 'Salt & Vinegar', flavor: 'Tangy Bite', tag: 'Zesty',
        tone: 'cream', category: 'Tangy', price: '28 EGP', priceValue: 28,
        description: 'A tangy vinegar zing balanced with a clean, salted finish that keeps you reaching back.',
    },
    {
        src: '/lays-wavy.png', name: 'Wavy', flavor: 'Extra Crunch', tag: 'Thick cut',
        tone: 'deep', category: 'Classic', price: '32 EGP', priceValue: 32,
        description: 'Extra-thick ridged cut, built to scoop and crunch twice as loud.',
    },
    {
        src: '/lays-classic.png', name: 'Sea Salt', flavor: 'Pure & Simple', tag: 'Light',
        tone: 'deep', category: 'Classic', price: '24 EGP', priceValue: 24,
        description: 'Just sea salt and golden potato — the clean, everyday crunch.',
    },
    {
        src: '/lays-cheddar.png', name: 'Double Cheese', flavor: 'Extra Cheesy', tag: 'Loaded',
        tone: 'yellow', category: 'Cheesy', price: '32 EGP', priceValue: 32,
        description: 'Two layers of cheese seasoning for an unapologetically rich, savory hit.',
    },
    {
        src: '/lays-indian.png', name: 'Chili Lime', flavor: 'Zesty Heat', tag: 'Hot',
        tone: 'deep', category: 'Spicy', price: '30 EGP', priceValue: 30,
        description: 'Bright lime cuts through a slow chili burn — sharp, hot and addictive.',
    },
    {
        src: '/lays-wavy.png', name: 'Sour Cream & Onion', flavor: 'Cool & Creamy', tag: 'Fan fave',
        tone: 'cream', category: 'Tangy', price: '32 EGP', priceValue: 32,
        description: 'Cool sour cream and toasted onion folded into every wavy ridge.',
    },
    {
        src: '/lays-salt-vinegar.png', name: 'Smoky BBQ', flavor: 'Sweet & Smoky', tag: 'Smoky',
        tone: 'deep', category: 'Classic', price: '28 EGP', priceValue: 28,
        description: 'Sweet, smoky barbecue rub with a slow-grilled finish.',
    },
];

export const CATEGORIES = ['All', 'Classic', 'Cheesy', 'Spicy', 'Tangy'] as const;

export interface Feature {
    title: string;
    text: string;
    chip: string;
    icon: 'flame' | 'leaf' | 'spark' | 'globe';
}

export const FEATURES: Feature[] = [
    {
        title: 'Cut Thick, Fried Crisp',
        text: 'Every chip is sliced thick and fried to a loud, shattering crunch you can hear across the room.',
        chip: 'The Crunch',
        icon: 'spark',
    },
    {
        title: 'Real, Loud Flavor',
        text: 'Spices toasted in small batches and tumbled on warm — never dusted with a whisper.',
        chip: 'Big Taste',
        icon: 'flame',
    },
    {
        title: 'Clean Ingredients',
        text: 'No mystery list. Potatoes, oil, and seasoning you can actually pronounce.',
        chip: 'Honest',
        icon: 'leaf',
    },
    {
        title: 'Crunched Since 2002',
        text: 'Two decades of getting the snack right — now shipped fresh across the region.',
        chip: 'Since 2002',
        icon: 'globe',
    },
];
