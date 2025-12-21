/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Modern Vibrant Palette
                primary: {
                    50: '#ECFDF5',   // Backgrounds
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    300: '#6EE7B7',
                    400: '#34D399',
                    500: '#10B981',  // Main Brand
                    600: '#059669',  // Hover
                    700: '#047857',
                    800: '#065F46',
                    900: '#064E3B',
                },
                accent: {
                    500: '#F59E0B', // Amber for alerts/highlights
                    600: '#D97706',
                },
                dark: {
                    900: '#111827',
                    800: '#1F2937',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                'glow': '0 0 15px rgba(16, 185, 129, 0.5)',
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}
