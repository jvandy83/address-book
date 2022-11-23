/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				karla: ['Libre Franklin', 'sans-serif'],
				indiaFlower: ['Indie Flower', 'cursive'],
			},
			colors: {
				mediumBlack: '#293540',
				fadedBlue: '#2b3d4f',
				fadedBlueHover: '#3a526b',
				grayBlue: '#2e4b63',
				darkBlue: '#293540',
				orangeBrown: '#872907',
				darkGreen: '#1f3d07',
				transparentBlack: 'rgba(0, 0, 0, 2)',
			},
			boxShadow: {
				'inner-sm': 'inset 0 0 4px rgba(0, 0, 0, 3)',
			},
		},
	},
	plugins: [],
};
