import {NextResponse} from 'next/server';
import {createOrder, createPayment, processMockCharge} from '@/lib/dashboardStore';

export const dynamic = 'force-dynamic';

// POST /api/payments/checkout
// Body: {customer, email, items: [{sku, name, price, qty}], method, cardNumber?}
// Creates an order, charges via the mock gateway, records a payment.
export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({error: 'Invalid JSON body'}, {status: 400});
    }

    const customer = (body.customer || '').toString().trim();
    const email = (body.email || '').toString().trim() || null;
    const items = Array.isArray(body.items) ? body.items : [];
    const method = body.method || 'card';

    if (!customer) {
        return NextResponse.json({error: 'Customer name is required'}, {status: 400});
    }
    if (items.length === 0) {
        return NextResponse.json({error: 'Cart is empty'}, {status: 400});
    }

    const total = items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
    const itemCount = items.reduce((n, it) => n + (Number(it.qty) || 0), 0);

    // Charge first; only create the order if the charge clears (or is COD).
    const charge = processMockCharge({method, cardNumber: body.cardNumber});
    if (!charge.ok) {
        return NextResponse.json(
            {error: charge.error || 'Payment failed', code: charge.status},
            {status: 402}
        );
    }

    // Use the first item's SKU as the order's primary SKU (matches existing schema).
    const primary = items[0];
    const order = createOrder({
        customer,
        email,
        sku: primary.sku || 'SAR-MIX',
        items: itemCount,
        total,
        status: charge.status === 'succeeded' ? 'paid' : 'pending',
    });

    const payment = createPayment({
        orderId: order.id,
        customer,
        amount: total,
        method,
        provider: charge.provider,
        status: charge.status,
        last4: charge.last4 || null,
    });

    return NextResponse.json({order, payment}, {status: 201});
}
