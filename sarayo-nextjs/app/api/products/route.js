import {NextResponse} from 'next/server';
import {listProducts} from '@/lib/dashboardStore';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({products: listProducts()});
}
