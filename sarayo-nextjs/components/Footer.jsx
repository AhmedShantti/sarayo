'use client';

import Link from 'next/link';
import {useLanguage} from '@/lib/LanguageContext';
import BrandLogo from './BrandLogo';

export default function Footer() {
    const {t} = useLanguage();
    return (
        <footer className="site-footer">
            <div className="container footer-grid">
                <div className="footer-brand">
                    <span className="brand-logo brand-logo-lg" aria-hidden="true">
                        <BrandLogo gradientId="logoGrad2" />
                    </span>
                    <p className="footer-desc">
                        {t('footer.desc')}
                    </p>
                    <p className="made-with">
                        {t('footer.madeWith')} <span className="heart">♥</span> {t('footer.inCairo')}
                    </p>
                </div>

                <div className="footer-col">
                    <h4>{t('footer.explore')}</h4>
                    <ul>
                        <li><Link href="/#home">{t('footer.home')}</Link></li>
                        <li><Link href="/#products">{t('footer.shop')}</Link></li>
                        <li><Link href="/#story">{t('footer.story')}</Link></li>
                        <li><Link href="/cart">{t('footer.cart')}</Link></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>{t('footer.care')}</h4>
                    <ul>
                        <li><a href="#">{t('footer.contact')}</a></li>
                        <li><a href="#">{t('footer.faqs')}</a></li>
                        <li><a href="#">{t('footer.shipping')}</a></li>
                        <li><a href="#">{t('footer.returns')}</a></li>
                    </ul>
                </div>

                <div className="footer-col">
                    <h4>{t('footer.contact')}</h4>
                    <ul className="contact-list">
                        <li>
                            <span className="ic">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M12 2 C8 2 5 5 5 9 C5 14 12 22 12 22 C12 22 19 14 19 9 C19 5 16 2 12 2 Z" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="9" r="2.5" fill="currentColor" />
                                </svg>
                            </span>
                            {t('footer.location')}
                        </li>
                        <li>
                            <span className="ic">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M5 4 L9 4 L11 9 L8.5 11 Q11 16 14 18 L16 15 L21 17 L21 20 Q21 21 20 21 C12 21 4 13 4 5 Q4 4 5 4 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <a href="tel:+201234567890">{t('footer.phone')}</a>
                        </li>
                        <li>
                            <span className="ic">
                                <svg viewBox="0 0 24 24" width="16" height="16">
                                    <path d="M14 4 L17 4 Q20 4 20 7 L20 10 L17 10 L17 13 L20 13 L19 16 L17 16 L17 22 L13 22 L13 16 L11 16 L11 13 L13 13 L13 9 Q13 4 14 4 Z" fill="currentColor" />
                                </svg>
                            </span>
                            <a
                                href="https://facebook.com/Sarayoegypt"
                                target="_blank"
                                rel="noopener noreferrer"
                                dir="ltr"
                            >
                                facebook.com/Sarayoegypt
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>{t('footer.copyright')}</p>
            </div>
        </footer>
    );
}
