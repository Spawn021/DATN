/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ['./src/**/*.{html,js}', 'public/index.html'],
   theme: {
      listStyleType: {
         square: 'square',
         roman: 'upper-roman',
      },
      fontFamily: {
         main: ['Poppins', 'sans-serif'],
      },
      extend: {
         boxShadow: {
            variant: '0 0 5px #1a1b188c',
            'custom': '0 2px 20px #00000017',
         },
         width: {
            main: '1220px',
         },
         minHeight: {
            'hp': 'calc(100vh - 84px)',
         },
         inset: {
            'calc-100-plus-4': 'calc(100% + 4px)',
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
            'scale-up-center': {
               '0%': {
                  transform: 'scale(0.5)',

               },
               '100%': {
                  transform: 'scale(1)',
               },
            }
         },
         animation: {
            'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
            'slide-top-sm': 'slide-top-sm 0.2s both',
            moveLeft: 'moveLeft 1s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            moveRight: 'moveRight 1s cubic-bezier(0.25, 1, 0.5, 1) forwards',
            'scale-up-center': 'scale-up-center 0.15s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
         },
      },
   },
   plugins: [],
}
