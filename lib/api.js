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

// `category` is a category slug. When given, the backend filters in the
// database rather than us fetching everything and filtering client-side.
/** @param {{limit?: number, category?: string}} [opts] */
export async function fetchProducts({limit = 50, category} = {}) {
    const qs = new URLSearchParams({limit: String(limit)});
    if (category) qs.set('category', category);
    const res = await fetch(`${API_BASE}/products?${qs}`, {cache: 'no-store'});
    const data = await handle(res);
    return data.items || [];
}

export async function fetchCategories() {
    const res = await fetch(`${API_BASE}/categories`, {cache: 'no-store'});
    const data = await handle(res);
    return Array.isArray(data) ? data : [];
}

// A single category by slug. Returns null when the backend says the category
// does not exist (404), so callers can render a not-found page. Any other
// failure (backend down, network) still throws, so an outage is not mistaken
// for a missing category.
export async function fetchCategory(slug) {
    const res = await fetch(`${API_BASE}/categories/${encodeURIComponent(slug)}`, {cache: 'no-store'});
    if (res.status === 404) return null;
    return handle(res);
}

export async function placeGuestOrder(payload) {
    const res = await fetch(`${API_BASE}/orders/guest`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
    });
    return handle(res); // returns the created order
}
