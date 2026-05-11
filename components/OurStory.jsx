'use client';

import {useLanguage} from '@/lib/LanguageContext';

export default function OurStory() {
    const {t} = useLanguage();
    return (
        <section className="our-story" id="story" aria-labelledby="storyHeading">
            <div className="story-bg">
                <div className="container story-grid">
                    <h2 id="storyHeading" className="story-title">
                        {t('story.title.1')}
                        <br />
                        {t('story.title.2')}
                    </h2>
                    <p className="story-text">
                        {t('story.body')}
                    </p>
                    <a href="#" className="btn btn-primary btn-pill">
                        {t('story.cta')}
                    </a>
                </div>
            </div>
        </section>
    );
}
