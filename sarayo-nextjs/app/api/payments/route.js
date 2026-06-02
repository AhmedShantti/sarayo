import {NextResponse} from 'next/server';
import {listPayments, paymentStats} from '@/lib/dashboardStore';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const {searchParams} = new URL(request.url);
    if (searchParams.get('stats') === '1') {
        return NextResponse.json({stats: paymentStats()});
    }
    return NextResponse.json({
        payments: listPayments(),
        stats: paymentStats(),
    });
}
