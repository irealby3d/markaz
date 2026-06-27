import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // <--- SHU QATORNI QO'SHISH SHART!
  plugins: [react()],
})
