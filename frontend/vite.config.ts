import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],  // ✅ Only Babel plugins here
      },
    }),
    tailwindcss(),  // ✅ Vite plugin goes here, separate from Babel
  ],
})