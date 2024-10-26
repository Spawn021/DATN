/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./src/**/*.{html,js}', 'public/index.html'],
   theme: {
      fontFamily: {
         main: ['Poppins', 'sans-serif'],
      },
      extend: {
         width: {
            main: '1220px',
         },
         flex: {
            2: '2 2 0%',
            3: '3 3 0%',
            4: '4 4 0%',
         },
         backgroundColor: {
            main: '#ee3131',
         },
         colors: {
            main: '#ee3131',
         },
         keyframes: {
            'slide-top': {
               '0%': {
                  transform: 'translateY(20px)',
               },
               '100%': {
                  transform: 'translateY(0px)',
               },
            },
            'slide-top-sm': {
               '0%': {
                  transform: 'translateY(10px)',
               },
               '100%': {
                  transform: 'translateY(0px)',
               },
            },
            moveLeft: {
               '0%': { transform: 'translateX(100%)', opacity: '0' },
               '100%': { transform: 'translateX(0)', opacity: '1' },
            },
            moveRight: {
               '0%': { transform: 'translateX(-100%)', opacity: '0' },
               '100%': { transform: 'translateX(0)', opacity: '1' },
            },
         },
         animation: {
            'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
            'slide-top-sm': 'slide-top-sm 0.2s both',
            moveLeft: 'moveLeft 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            moveRight: 'moveRight 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards',
         },
      },
   },
   plugins: [],
}
