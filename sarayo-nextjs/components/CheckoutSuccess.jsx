'use client';

import Link from 'next/link';
import {useLanguage} from '@/lib/LanguageContext';

export default function CheckoutSuccess({orderId}) {
    const {t} = useLanguage();
    return (
        <div className="cart-empty" style={{textAlign: 'center'}}>
            <h2>{t('checkout.success.title')}</h2>
            {orderId && (
                <p>
                    {t('checkout.success.ref')}: <strong style={{fontFamily: 'monospace'}}>{orderId}</strong>
                </p>
            )}
            <p>{t('checkout.success.body')}</p>
            <Link href="/#products" className="btn btn-primary btn-pill">
                {t('checkout.success.cta')}
            </Link>
        </div>
    );
}
