import {NextResponse} from 'next/server';
import {listOrders, listUsers, listProducts, topProducts} from '@/lib/dashboardStore';

export const dynamic = 'force-dynamic';

export async function GET() {
    const orders = listOrders();
    const users = listUsers();
    const products = listProducts();

    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);

    const statusBreakdown = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {});

    return NextResponse.json({
        revenue,
        orders: orders.length,
        products: products.length,
        users: users.length,
        topProducts: topProducts(),
        statusBreakdown,
        deltas: {
            revenue: 12.4,
            orders: 8.1,
            products: 0,
            users: 5.2,
        },
    });
}
