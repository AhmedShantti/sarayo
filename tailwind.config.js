/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx}',
        './components/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                // Single warm accent. Everything else uses neutral gray scale.
                accent: {
                    DEFAULT: '#E2532B',
                    soft:    '#F4E4DC',
                    deep:    '#C53D17',
                },
                ink:    '#1A1A1A',
                paper:  '#FAFAF8',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '8px',
            },
        },
    },
    plugins: [],
};
