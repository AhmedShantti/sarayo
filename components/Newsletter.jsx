'use client';

import {useState} from 'react';
import {useToast} from '@/lib/ToastContext';

export default function Newsletter() {
    const [email, setEmail] = useState('');
    const {showToast} = useToast();

    function handleSubmit(e) {
        e.preventDefault();
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        if (!valid) {
            showToast('Please enter a valid email');
            return;
        }
        showToast('Thanks for subscribing');
        setEmail('');
    }

    return (
        <section className="newsletter" id="subscribe" aria-labelledby="newsletterHeading">
            <div className="container">
                <div className="newsletter-inner">
                    <div className="newsletter-left">
                        <h2 id="newsletterHeading" className="newsletter-title">
                            JOIN THE
                            <br />
                            CRUNCH CLUB
                        </h2>
                    </div>

                    <form
                        className="newsletter-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <input
                            type="email"
                            placeholder="Your email address"
                            aria-label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn-subscribe">
                            Join the crunch
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
