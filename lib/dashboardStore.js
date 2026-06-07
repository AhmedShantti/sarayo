// In-memory store seeded from mock data. State resets on dev-server restart,
// which is fine for a demo dashboard. Swap with a real DB when one exists.

import {RECENT_ORDERS, TOP_PRODUCTS} from '@/lib/dashboardData';

let nextOrderNum = 10500;

const seedOrders = RECENT_ORDERS.map((o) => ({...o}));

const orders = [...seedOrders];

const users = [
    {id: 'u-001', name: 'Mariam Hassan', nameAr: 'مريم حسن',  email: 'mariam.h@example.com', joined: '2026-01-12'},
    {id: 'u-002', name: 'Omar Saleh',    nameAr: 'عمر صالح',  email: 'omar.s@example.com',   joined: '2026-01-18'},
    {id: 'u-003', name: 'Layla Adel',    nameAr: 'ليلى عادل', email: 'layla.a@example.com',  joined: '2026-02-03'},
    {id: 'u-004', name: 'Yousef Ahmed',  nameAr: 'يوسف أحمد', email: 'yousef.a@example.com', joined: '2026-02-21'},
    {id: 'u-005', name: 'Nour Khalil',   nameAr: 'نور خليل',  email: 'nour.k@example.com',   joined: '2026-03-04'},
    {id: 'u-006', name: 'Karim Fathy',   nameAr: 'كريم فتحي', email: 'karim.f@example.com',  joined: '2026-03-15'},
    {id: 'u-007', name: 'Salma Tarek',   nameAr: 'سلمى طارق', email: 'salma.t@example.com',  joined: '2026-04-02'},
    {id: 'u-008', name: 'Hassan Adel',   nameAr: 'حسن عادل',  email: 'hassan.a@example.com', joined: '2026-04-19'},
];

// Matches the storefront lineup (see lib/landingData.ts) with EGP pricing.
const products = [
    {sku: 'SAR-001', name: 'Classic',            nameAr: 'كلاسيك',            price: 25, stock: 124, status: 'active'},
    {sku: 'SAR-002', name: 'Cheddar',            nameAr: 'شيدر',              price: 30, stock: 86,  status: 'active'},
    {sku: 'SAR-003', name: 'Indian Magic',       nameAr: 'ماسالا هندي',       price: 30, stock: 12,  status: 'low'},
    {sku: 'SAR-004', name: 'Salt & Vinegar',     nameAr: 'ملح وخل',           price: 28, stock: 142, status: 'active'},
    {sku: 'SAR-005', name: 'Wavy',               nameAr: 'مموج',              price: 32, stock: 48,  status: 'active'},
    {sku: 'SAR-006', name: 'Sea Salt',           nameAr: 'ملح البحر',         price: 24, stock: 76,  status: 'active'},
    {sku: 'SAR-007', name: 'Double Cheese',      nameAr: 'دبل تشيز',          price: 32, stock: 0,   status: 'out'},
    {sku: 'SAR-008', name: 'Chili Lime',         nameAr: 'تشيلي لايم',        price: 30, stock: 96,  status: 'active'},
    {sku: 'SAR-009', name: 'Sour Cream & Onion', nameAr: 'كريمة حامضة وبصل',  price: 32, stock: 34,  status: 'active'},
    {sku: 'SAR-010', name: 'Smoky BBQ',          nameAr: 'باربكيو مدخن',      price: 28, stock: 8,   status: 'low'},
];

export function listOrders() { return orders; }

export function createOrder(input) {
    const id = '#' + (nextOrderNum++);
    const product = products.find((p) => p.sku === input.sku);
    const order = {
        id,
        customer: input.customer,
        customerAr: input.customer,
        email: input.email || null,
        sku: input.sku,
        product: product ? product.name : input.sku,
        productAr: product ? (product.nameAr || product.name) : input.sku,
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
                nameAr: o.customerAr || o.customer,
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

// ---------- Payments ----------

let nextPaymentNum = 8800;

const PAYMENT_METHODS = ['card', 'cod', 'wallet'];

const payments = [];

function seedPaymentsFromOrders() {
    for (const o of orders) {
        if (o.status === 'paid' || o.status === 'shipped') {
            payments.push({
                id: 'PMT-' + (nextPaymentNum++),
                orderId: o.id,
                customer: o.customer,
                customerAr: o.customerAr || o.customer,
                amount: o.total || 0,
                method: 'card',
                provider: 'mock-stripe',
                status: 'succeeded',
                last4: String(4000 + Math.floor(Math.random() * 5999)).slice(-4),
                date: o.date,
            });
        }
    }
}
seedPaymentsFromOrders();

export function listPayments() {
    return [...payments].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function createPayment(input) {
    const id = 'PMT-' + (nextPaymentNum++);
    const payment = {
        id,
        orderId: input.orderId || null,
        customer: input.customer || 'Guest',
        amount: Number(input.amount) || 0,
        method: PAYMENT_METHODS.includes(input.method) ? input.method : 'card',
        provider: input.provider || 'mock-stripe',
        status: input.status || 'succeeded',
        last4: input.last4 || null,
        date: new Date().toISOString().slice(0, 10),
    };
    payments.unshift(payment);
    return payment;
}

export function paymentStats() {
    const totalReceived = payments
        .filter((p) => p.status === 'succeeded')
        .reduce((s, p) => s + p.amount, 0);
    const refunded = payments
        .filter((p) => p.status === 'refunded')
        .reduce((s, p) => s + p.amount, 0);
    const pending = payments
        .filter((p) => p.status === 'pending')
        .reduce((s, p) => s + p.amount, 0);
    const failed = payments.filter((p) => p.status === 'failed').length;

    const byMethod = payments.reduce((acc, p) => {
        acc[p.method] = (acc[p.method] || 0) + (p.status === 'succeeded' ? p.amount : 0);
        return acc;
    }, {});

    return {
        totalReceived,
        refunded,
        pending,
        failedCount: failed,
        successCount: payments.filter((p) => p.status === 'succeeded').length,
        byMethod,
    };
}

// Mock payment-gateway processor. Always succeeds for COD/wallet; for cards,
// fails when the card number ends in "0002" (Stripe-style test card convention).
export function processMockCharge({method, cardNumber}) {
    if (method === 'cod') {
        return {ok: true, status: 'pending', provider: 'cash-on-delivery'};
    }
    if (method === 'wallet') {
        return {ok: true, status: 'succeeded', provider: 'mock-wallet'};
    }
    const digits = (cardNumber || '').replace(/\s+/g, '');
    if (digits.endsWith('0002')) {
        return {ok: false, status: 'failed', provider: 'mock-stripe', error: 'Card declined'};
    }
    return {
        ok: true,
        status: 'succeeded',
        provider: 'mock-stripe',
        last4: digits.slice(-4),
    };
}
