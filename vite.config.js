// ===== IMPORTS =====

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ===== HẰNG SỐ, HÀM HỖ TRỢ & STATE SETUP =====

// ===== EXPORTS =====

// ------ Cấu hình Vite với React va TailwindCSS plugin ------
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
