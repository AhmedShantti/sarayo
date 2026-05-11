'use client';

import Link from 'next/link';
import {useLanguage} from '@/lib/LanguageContext';

export default function CartHeader() {
    const {t} = useLanguage();
    return (
        <div className="cart-head">
            <h1 className="cart-title">{t('cart.title')}</h1>
            <Link href="/#products" className="continue-link">
                {t('cart.continue')}
            </Link>
        </div>
    );
}
