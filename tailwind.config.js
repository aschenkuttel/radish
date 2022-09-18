/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js}",
        "./node_modules/flowbite/**/*.js"
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
        require("@tailwindcss/typography"),
        require("daisyui"),
        require('flowbite/plugin')
    ],
    daisyui: {
        themes: ["garden"],
    },
}
