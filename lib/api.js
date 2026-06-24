// Frontend → backend API client.
//
// Base URL comes from NEXT_PUBLIC_API_URL (set in Vercel). Falls back to the
// deployed Render backend so the site still works if the env var is missing.

export const API_BASE =
    (process.env.NEXT_PUBLIC_API_URL || 'https://sarayo-backend.onrender.com/api').replace(/\/$/, '');

// The backend wraps every success as { success, data, timestamp }. This unwraps
// it and throws a useful error on failure.
async function handle(res) {
    let body = null;
    try {
        body = await res.json();
    } catch {
        // non-JSON response
    }
    if (!res.ok || (body && body.success === false)) {
        const msg = (body && (body.message || body.error)) || `Request failed (${res.status})`;
        throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    }
    return body ? body.data : null;
}

// ── Public storefront calls ──────────────────────────────

export async function fetchProducts({limit = 50} = {}) {
    const res = await fetch(`${API_BASE}/products?limit=${limit}`, {cache: 'no-store'});
    const data = await handle(res);
    return data.items || [];
}

export async function fetchCategories() {
    const res = await fetch(`${API_BASE}/categories`, {cache: 'no-store'});
    const data = await handle(res);
    return Array.isArray(data) ? data : [];
}

export async function placeGuestOrder(payload) {
    const res = await fetch(`${API_BASE}/orders/guest`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    });
    return handle(res); // returns the created order
}
