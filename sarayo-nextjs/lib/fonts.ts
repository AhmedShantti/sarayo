import { Anton, Space_Grotesk } from 'next/font/google';

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
