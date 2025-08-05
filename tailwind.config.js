/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './App.tsx',
        './components/**/*.{js,jsx,ts,tsx}',
        './screens/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
    ],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                'dark-blue': '#252C4A',
            },
            backgroundColor: {
                default: '#252C4A',
                'pink-900': '#831843',
                'blue-200': '#BFDBFE',
                'green-200': '#BBF7D0',
                'purple-200': '#E9D5FF',
                'yellow-200': '#FEF08A',
            },
        },
    },
    plugins: [],
};
