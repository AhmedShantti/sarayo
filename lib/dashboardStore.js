// In-memory store seeded from mock data. State resets on dev-server restart,
// which is fine for a demo dashboard. Swap with a real DB when one exists.

import {RECENT_ORDERS, TOP_PRODUCTS} from '@/lib/dashboardData';

let nextOrderNum = 10500;

const seedOrders = RECENT_ORDERS.map((o) => ({...o}));

const orders = [...seedOrders];

const users = [
    {id: 'u-001', name: 'Mariam Hassan', email: 'mariam.h@example.com', joined: '2026-01-12'},
    {id: 'u-002', name: 'Omar Saleh',    email: 'omar.s@example.com',   joined: '2026-01-18'},
    {id: 'u-003', name: 'Layla Adel',    email: 'layla.a@example.com',  joined: '2026-02-03'},
    {id: 'u-004', name: 'Yousef Ahmed',  email: 'yousef.a@example.com', joined: '2026-02-21'},
    {id: 'u-005', name: 'Nour Khalil',   email: 'nour.k@example.com',   joined: '2026-03-04'},
    {id: 'u-006', name: 'Karim Fathy',   email: 'karim.f@example.com',  joined: '2026-03-15'},
    {id: 'u-007', name: 'Salma Tarek',   email: 'salma.t@example.com',  joined: '2026-04-02'},
    {id: 'u-008', name: 'Hassan Adel',   email: 'hassan.a@example.com', joined: '2026-04-19'},
];

const products = [
    {sku: 'SAR-001', name: 'Cheddar & Sour Cream', price: 18, stock: 124, status: 'active'},
    {sku: 'SAR-002', name: 'Classic Salted',       price: 18, stock: 86,  status: 'active'},
    {sku: 'SAR-003', name: 'Salt & Vinegar',       price: 18, stock: 142, status: 'active'},
    {sku: 'SAR-004', name: 'Wavy Original',        price: 18, stock: 48,  status: 'active'},
    {sku: 'SAR-005', name: 'Indian Magic Masala',  price: 18, stock: 12,  status: 'low'},
    {sku: 'SAR-006', name: 'Cheddar Classic',      price: 18, stock: 76,  status: 'active'},
    {sku: 'SAR-007', name: 'Wavy BBQ',             price: 18, stock: 0,   status: 'out'},
    {sku: 'SAR-008', name: 'Tangy Salt & Vinegar', price: 18, stock: 96,  status: 'active'},
    {sku: 'SAR-009', name: 'Wavy Cheddar Ranch',   price: 18, stock: 34,  status: 'active'},
    {sku: 'SAR-010', name: 'Sour Cream & Onion',   price: 18, stock: 8,   status: 'low'},
];

export function listOrders() { return orders; }

export function createOrder(input) {
    const id = '#' + (nextOrderNum++);
    const product = products.find((p) => p.sku === input.sku);
    const order = {
        id,
        customer: input.customer,
        email: input.email || null,
        sku: input.sku,
        product: product ? product.name : input.sku,
        items: input.items,
        total: input.total,
        status: input.status || 'pending',
        date: new Date().toISOString().slice(0, 10),
    };
    orders.unshift(order);
    return order;
}

export function listUsers() {
    // Roll up order count + spend per user across all orders.
    const map = new Map(users.map((u) => [u.name, {...u, orders: 0, spend: 0}]));
    for (const o of orders) {
        const existing = map.get(o.customer);
        if (existing) {
            existing.orders += 1;
            existing.spend += o.total || 0;
        } else {
            map.set(o.customer, {
                id: 'u-' + o.customer.toLowerCase().replace(/[^a-z]/g, '').slice(0, 8),
                name: o.customer,
                email: o.email || '—',
                joined: o.date,
                orders: 1,
                spend: o.total || 0,
            });
        }
    }
    return Array.from(map.values()).sort((a, b) => b.spend - a.spend);
}

export function listProducts() { return products; }

export function topProducts() { return TOP_PRODUCTS; }
