'use client';

import Link from 'next/link';
import {useLanguage} from '@/lib/LanguageContext';

export default function CheckoutHeader() {
    const {t} = useLanguage();
    return (
        <div className="cart-head">
            <h1 className="cart-title">{t('checkout.title')}</h1>
            <Link href="/cart" className="continue-link">
                {t('checkout.back')}
            </Link>
        </div>
    );
}
