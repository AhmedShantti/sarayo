/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // ----- Existing site tokens (untouched) -----
                accent: {
                    DEFAULT: '#E2532B',
                    soft:    '#F4E4DC',
                    deep:    '#C53D17',
                },
                ink:    '#1A1A1A',
                paper:  '#FAFAF8',

                // ----- Sarayo landing brand tokens -----
                // Dominant: a rich, warm, confident red.
                // Accents (used sparingly): a little white + a little yellow.
                brand: {
                    red:          '#D7261E',
                    'red-deep':   '#8E0E06',
                    'red-soft':   '#F0463C',
                    yellow:       '#FFD400',
                    'yellow-deep':'#F5B500',
                    cream:        '#FFF6F1',
                    ink:          '#2A0A07',
                },
            },
            fontFamily: {
                // Existing keys preserved
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
                // Landing pairing (via next/font CSS variables)
                anton: ['var(--font-anton)', 'Anton', 'Impact', 'sans-serif'],
                grotesk: ['var(--font-grotesk)', '"Space Grotesk"', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '8px',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%':      { transform: 'translateY(-12px)' },
                },
                marquee: {
                    from: { transform: 'translateX(0)' },
                    to:   { transform: 'translateX(-50%)' },
                },
            },
            animation: {
                float: 'float 5s ease-in-out infinite',
                marquee: 'marquee 30s linear infinite',
            },
        },
    },
    plugins: [],
};
