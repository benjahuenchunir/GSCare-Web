/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Principales
        primary1: '#62CBC9',
        primary2: '#FFC600',
        primary3: '#FF8D6B',
        // Segunda prioridad
        secondary1: '#006881',
        secondary2: '#009982',
        // Secundarios
        a1: '#36A2A1',
        a2: '#88C4C3',
        a3: '#B89000',
        a4: '#FFB326',
        a5: '#FF4006',
        a6: '#FF9A81',
        a7: '#00495C',
        a8: '#1F7D9A',
        a9: '#006E5E',
        a10:'#20AF94',

        actividadBg: '#F3E8FF',   // fondo suave morado
        actividadText: '#6B21A8', // texto morado intenso
        actividadTag: '#E9D5FF',  // tag suave
      },
      fontFamily: {
        sans: ['Poppins', 'Lato', 'sans-serif']
      }
    }
  },
  plugins: []
}