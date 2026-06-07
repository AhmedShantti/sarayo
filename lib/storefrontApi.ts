// Storefront → backend client (TypeScript).
// Base URL from NEXT_PUBLIC_API_URL, falling back to the deployed Render API.

const API_BASE = (
    process.env.NEXT_PUBLIC_API_URL || 'https://sarayo-backend.onrender.com/api'
).replace(/\/$/, '');

export interface GuestOrderLine {
    name: string;
    price: number;
    image?: string;
    quantity: number;
}

export interface GuestOrderPayload {
    customer: string;
    email?: string;
    phone?: string;
    address?: string;
    method?: string;
    items: GuestOrderLine[];
}

export interface PlacedOrder {
    id: string;
    orderNumber: string;
    total: number;
    [key: string]: unknown;
}

export async function placeGuestOrder(payload: GuestOrderPayload): Promise<PlacedOrder> {
    const res = await fetch(`${API_BASE}/orders/guest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    let body: any = null;
    try {
        body = await res.json();
    } catch {
        /* non-JSON */
    }
    if (!res.ok || (body && body.success === false)) {
        const msg = (body && (body.message || body.error)) || `Order failed (${res.status})`;
        throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    }
    return body.data as PlacedOrder;
}
