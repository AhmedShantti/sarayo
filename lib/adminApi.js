// Admin dashboard → backend client.
//
// Handles JWT login (admin only), token storage, authenticated fetches with a
// one-time refresh-on-401, and maps backend responses to the shapes the
// existing dashboard components expect.

import {API_BASE} from '@/lib/api';

const TOKEN_KEY = 'sarayo_admin_token';
const REFRESH_KEY = 'sarayo_admin_refresh';
const USER_KEY = 'sarayo_admin_user';

// ── Token storage ────────────────────────────────────────

export function getToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getAdminUser() {
    if (typeof window === 'undefined') return null;
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

export function isAuthed() {
    const u = getAdminUser();
    return Boolean(getToken() && u && u.role === 'ADMIN');
}

function storeSession({accessToken, refreshToken, user}) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
}

// ── Low-level fetch helpers ──────────────────────────────

async function unwrap(res) {
    let body = null;
    try {
        body = await res.json();
    } catch {
        // ignore
    }
    if (!res.ok || (body && body.success === false)) {
        const msg = (body && (body.message || body.error)) || `Request failed (${res.status})`;
        const err = new Error(Array.isArray(msg) ? msg.join(', ') : msg);
        err.status = res.status;
        throw err;
    }
    return body ? body.data : null;
}

async function tryRefresh() {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (!refreshToken) return false;
    try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({refreshToken}),
        });
        const data = await unwrap(res);
        localStorage.setItem(TOKEN_KEY, data.accessToken);
        if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);
        return true;
    } catch {
        return false;
    }
}

async function authedFetch(path, options = {}, retry = true) {
    const token = getToken();
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
        },
    });
    if (res.status === 401 && retry && (await tryRefresh())) {
        return authedFetch(path, options, false);
    }
    return unwrap(res);
}

// ── Auth ─────────────────────────────────────────────────

export async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
    });
    const data = await unwrap(res);
    if (!data.user || data.user.role !== 'ADMIN') {
        throw new Error('This account is not an admin.');
    }
    storeSession(data);
    return data.user;
}

// ── Status mapping (backend enums → dashboard vocabulary) ─

const ORDER_STATUS_MAP = {
    PENDING: 'pending',
    CONFIRMED: 'paid',
    PROCESSING: 'paid',
    SHIPPED: 'shipped',
    DELIVERED: 'shipped',
    CANCELLED: 'refunded',
    REFUNDED: 'refunded',
};

const PAYMENT_STATUS_MAP = {
    SUCCESS: 'succeeded',
    PENDING: 'pending',
    FAILED: 'failed',
    REFUNDED: 'refunded',
};

function mapOrder(o) {
    const addr = o.shippingAddress || {};
    return {
        id: o.orderNumber || o.id,
        _id: o.id,
        customer: o.user?.name || addr.fullName || 'Guest',
        customerAr: o.user?.nameAr || null,
        email: o.user?.email || addr.email || null,
        items: o.itemCount ?? (o.items ? o.items.reduce((n, i) => n + i.quantity, 0) : 0),
        total: o.total,
        status: ORDER_STATUS_MAP[o.status] || o.status?.toLowerCase() || 'pending',
        date: (o.createdAt || '').slice(0, 10),
    };
}

// ── High-level data (mapped to dashboard shapes) ─────────

export async function getProducts() {
    const data = await authedFetch('/products?limit=100');
    return data.items || [];
}

export async function getOrders() {
    const data = await authedFetch('/admin/orders?limit=100');
    return (data.items || []).map(mapOrder);
}

export async function getUsers() {
    const data = await authedFetch('/admin/users?limit=100');
    return (data.items || []).map((u) => ({
        id: u.id,
        name: u.name,
        nameAr: u.nameAr,
        email: u.email,
        joined: (u.createdAt || '').slice(0, 10),
        orders: u.orders ?? 0,
        spend: u.spend ?? 0,
    }));
}

export async function getStats() {
    const [orderStats, productsData, usersData] = await Promise.all([
        authedFetch('/admin/orders/stats'),
        authedFetch('/products?limit=1'),
        authedFetch('/admin/users?limit=1'),
    ]);

    // Re-bucket the enum status breakdown into the dashboard's 4-colour scheme.
    const statusBreakdown = {};
    Object.entries(orderStats.statusBreakdown || {}).forEach(([k, n]) => {
        const mapped = ORDER_STATUS_MAP[k] || k.toLowerCase();
        statusBreakdown[mapped] = (statusBreakdown[mapped] || 0) + n;
    });

    return {
        revenue: orderStats.revenue || 0,
        orders: orderStats.orders || 0,
        products: productsData.meta?.total ?? 0,
        users: usersData.meta?.total ?? 0,
        pendingOrders: orderStats.pendingOrders || 0,
        statusBreakdown,
        topProducts: orderStats.topProducts || [],
        deltas: {}, // no historical deltas from the backend yet
    };
}

export async function getPayments() {
    const data = await authedFetch('/admin/payments');
    const payments = (data.items || []).map((p) => ({
        ...p,
        status: PAYMENT_STATUS_MAP[p.status] || p.status?.toLowerCase(),
    }));
    return {payments, stats: data.stats || {}};
}

// ── Admin create order (used by the "New order" page) ────

export async function createAdminOrder({customer, email, sku, qty, status}) {
    const order = await authedFetch('/orders/guest', {
        method: 'POST',
        body: JSON.stringify({
            customer,
            email: email || undefined,
            items: [{sku, quantity: qty}],
        }),
    });

    // Optionally advance the status through allowed transitions.
    try {
        if (status === 'paid') {
            await authedFetch(`/admin/orders/${order.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({status: 'CONFIRMED'}),
            });
        } else if (status === 'shipped') {
            await authedFetch(`/admin/orders/${order.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({status: 'CONFIRMED'}),
            });
            await authedFetch(`/admin/orders/${order.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({status: 'SHIPPED'}),
            });
        }
    } catch {
        // Non-fatal: the order exists even if the status bump failed.
    }
    return order;
}
