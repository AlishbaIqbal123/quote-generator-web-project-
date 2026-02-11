export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
                playfair: ['Playfair Display', 'serif'],
            },
            colors: {
                primary: {
                    light: '#6366f1', // Indigo-500
                    dark: '#4338ca',  // Indigo-700
                },
                bg: {
                    light: '#f8fafc', // Slate-50
                    dark: '#0f172a',  // Slate-900
                }
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            }
        },
    },
    plugins: [],
}
