// Mock data shown on the analytics dashboard. Swap with real API calls when a
// backend is wired up — the dashboard reads from these arrays directly.

export const TOP_PRODUCTS = [
    {name: 'Cheddar & Sour Cream', flavor: 'cheese', sold: 412, revenue: 7416},
    {name: 'Salt & Vinegar', flavor: 'salt-vinegar', sold: 308, revenue: 5544},
    {name: 'Wavy BBQ', flavor: 'bbq', sold: 246, revenue: 4428},
    {name: 'Indian Magic Masala', flavor: 'chili', sold: 188, revenue: 3384},
    {name: 'Classic Salted', flavor: 'salt-vinegar', sold: 154, revenue: 2772},
];

export const RECENT_ORDERS = [
    {id: '#10428', customer: 'Mariam Hassan', items: 3, total: 54, status: 'paid',     date: '2026-05-06'},
    {id: '#10427', customer: 'Omar Saleh',    items: 2, total: 36, status: 'shipped',  date: '2026-05-06'},
    {id: '#10426', customer: 'Layla Adel',    items: 5, total: 90, status: 'paid',     date: '2026-05-05'},
    {id: '#10425', customer: 'Yousef Ahmed',  items: 1, total: 18, status: 'pending',  date: '2026-05-05'},
    {id: '#10424', customer: 'Nour Khalil',   items: 4, total: 72, status: 'paid',     date: '2026-05-04'},
    {id: '#10423', customer: 'Karim Fathy',   items: 2, total: 36, status: 'refunded', date: '2026-05-04'},
    {id: '#10422', customer: 'Salma Tarek',   items: 6, total: 108, status: 'shipped', date: '2026-05-03'},
    {id: '#10421', customer: 'Hassan Adel',   items: 3, total: 54, status: 'paid',     date: '2026-05-03'},
];

export const STATS = {
    revenue: 24580,
    revenueDelta: 12.4,
    orders: 162,
    ordersDelta: 8.1,
    products: 15,
    productsDelta: 0,
    customers: 312,
    customersDelta: 5.2,
};
