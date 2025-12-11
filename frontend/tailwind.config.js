/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    500: '#a855f7',
                    600: '#9333ea',
                    700: '#7e22ce',
                },
                accent: {
                    cyan: '#06b6d4',
                    magenta: '#ec4899',
                    purple: '#a855f7',
                    orange: '#f97316',
                },
                dark: {
                    900: '#0f0f23',
                    800: '#1a1a2e',
                    700: '#16213e',
                    600: '#1f2937',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(168, 85, 247, 0.4)',
                'neon': '0 0 20px rgba(168, 85, 247, 0.6)',
            }
        },
    },
    plugins: [],
}
