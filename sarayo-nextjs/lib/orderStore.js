// Dashboard-only order store. Persists in localStorage so orders created from
// the New Order page survive a refresh. Marketing-site code never touches this.

const KEY = 'sarayo_dash_orders';

export function readOrders() {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(KEY)) || [];
    } catch {
        return [];
    }
}

export function writeOrders(orders) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEY, JSON.stringify(orders));
}

export function addOrder(order) {
    const orders = readOrders();
    const next = [order, ...orders];
    writeOrders(next);
    return next;
}

export function nextOrderId(orders) {
    const last = orders[0];
    if (!last) return '#10500';
    const num = parseInt(String(last.id).replace(/\D/g, ''), 10);
    return '#' + (Number.isFinite(num) ? num + 1 : 10500);
}
