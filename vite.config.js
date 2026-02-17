import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {}]
        ],
      },
    }),
    tailwindcss(),
  ],

  server: {
    proxy: {
      // forward all /api requests to your backend
      '/api': {
        target: 'https://ai-explore.onrender.com',
        changeOrigin: true,   // ensures the host header matches target
        secure: false,        // skip SSL check if needed
      },
    },
  },
})
