import { Anton, Space_Grotesk, IBM_Plex_Sans_Arabic, Almarai } from 'next/font/google';

// Display: Anton — heavy, condensed, editorial impact for oversized headlines.
export const anton = Anton({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-anton',
    display: 'swap',
});

// Body / UI: Space Grotesk — distinctive geometric sans with character.
export const grotesk = Space_Grotesk({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-grotesk',
    display: 'swap',
});

// ---- Arabic ----
// Anton and Space Grotesk are Latin-only, so Arabic needs its own pairing.
// Body: IBM Plex Sans Arabic — modern, highly legible, wide weight range.
export const arabicBody = IBM_Plex_Sans_Arabic({
    weight: ['400', '500', '600', '700'],
    subsets: ['arabic'],
    variable: '--font-ar-body',
    display: 'swap',
});

// Display: Almarai ExtraBold — heavy geometric Arabic that carries the same
// punch as Anton does in Latin.
export const arabicDisplay = Almarai({
    weight: ['400', '700', '800'],
    subsets: ['arabic'],
    variable: '--font-ar-display',
    display: 'swap',
});
