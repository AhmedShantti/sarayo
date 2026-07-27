import { readContent } from '@/lib/contentStore.js';
import LandingNav from './LandingNav';
import type { NavItem } from '@/lib/landingData';

export default function LandingNavServer() {
    const nav = readContent('navigation') as { items: NavItem[] };
    return <LandingNav nav={nav} />;
}
