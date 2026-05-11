'use client';

import {useState} from 'react';
import {useToast} from '@/lib/ToastContext';
import {useLanguage} from '@/lib/LanguageContext';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const {showToast} = useToast();
    const {t} = useLanguage();

    function handleSubmit(e) {
        e.preventDefault();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!valid) {
            showToast(t('news.invalid'));
            return;
        }
        showToast(t('news.success'));
        setEmail('');
    }

    return (
        <section className="newsletter" id="subscribe" aria-labelledby="newsletterHeading">
            <div className="container">
                <div className="newsletter-inner">
                    <div className="newsletter-left">
                        <h2 id="newsletterHeading" className="newsletter-title">
                            {t('news.title.1')}
                            <br />
                            {t('news.title.2')}
                        </h2>
                    </div>

                    <form
                        className="newsletter-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <input
                            type="email"
                            placeholder={t('news.placeholder')}
                            aria-label={t('news.emailAria')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-subscribe">
                            {t('news.submit')}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
