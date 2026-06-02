// Mock data shown on the analytics dashboard. Swap with real API calls when a
// backend is wired up — the dashboard reads from these arrays directly.

export const TOP_PRODUCTS = [
    {name: 'Classic',        nameAr: 'كلاسيك',      flavor: 'salt-vinegar', sold: 412, revenue: 10300},
    {name: 'Cheddar',        nameAr: 'شيدر',        flavor: 'cheese',       sold: 308, revenue: 9240},
    {name: 'Wavy',           nameAr: 'مموج',        flavor: 'bbq',          sold: 246, revenue: 7872},
    {name: 'Indian Magic',   nameAr: 'ماسالا هندي', flavor: 'chili',        sold: 188, revenue: 5640},
    {name: 'Salt & Vinegar', nameAr: 'ملح وخل',     flavor: 'salt-vinegar', sold: 154, revenue: 4312},
];

export const RECENT_ORDERS = [
    {id: '#10428', customer: 'Mariam Hassan', customerAr: 'مريم حسن',  items: 3, total: 54,  status: 'paid',     date: '2026-05-06'},
    {id: '#10427', customer: 'Omar Saleh',    customerAr: 'عمر صالح',  items: 2, total: 36,  status: 'shipped',  date: '2026-05-06'},
    {id: '#10426', customer: 'Layla Adel',    customerAr: 'ليلى عادل', items: 5, total: 90,  status: 'paid',     date: '2026-05-05'},
    {id: '#10425', customer: 'Yousef Ahmed',  customerAr: 'يوسف أحمد', items: 1, total: 18,  status: 'pending',  date: '2026-05-05'},
    {id: '#10424', customer: 'Nour Khalil',   customerAr: 'نور خليل',  items: 4, total: 72,  status: 'paid',     date: '2026-05-04'},
    {id: '#10423', customer: 'Karim Fathy',   customerAr: 'كريم فتحي', items: 2, total: 36,  status: 'refunded', date: '2026-05-04'},
    {id: '#10422', customer: 'Salma Tarek',   customerAr: 'سلمى طارق', items: 6, total: 108, status: 'shipped',  date: '2026-05-03'},
    {id: '#10421', customer: 'Hassan Adel',   customerAr: 'حسن عادل',  items: 3, total: 54,  status: 'paid',     date: '2026-05-03'},
];

export const STATS = {
    revenue: 24580,
    revenueDelta: 12.4,
    orders: 162,
    ordersDelta: 8.1,
    products: 10,
    productsDelta: 0,
    customers: 312,
    customersDelta: 5.2,
};
