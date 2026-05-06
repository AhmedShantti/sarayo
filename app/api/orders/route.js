import {NextResponse} from 'next/server';
import {listOrders, createOrder} from '@/lib/dashboardStore';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({orders: listOrders()});
}

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({error: 'Invalid JSON body'}, {status: 400});
    }

    const customer = (body.customer || '').toString().trim();
    const sku = (body.sku || '').toString().trim();
    const items = parseInt(body.items, 10);
    const total = parseFloat(body.total);

    if (!customer) return NextResponse.json({error: 'Customer name is required'}, {status: 400});
    if (!sku) return NextResponse.json({error: 'Product SKU is required'}, {status: 400});
    if (!Number.isFinite(items) || items < 1) return NextResponse.json({error: 'Items must be a positive number'}, {status: 400});
    if (!Number.isFinite(total) || total < 0) return NextResponse.json({error: 'Total must be a positive number'}, {status: 400});

    const order = createOrder({
        customer,
        email: body.email || null,
        sku,
        items,
        total,
        status: body.status || 'pending',
    });

    return NextResponse.json({order}, {status: 201});
}
