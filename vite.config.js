import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // 1. 가져오기

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // 2. 여기에 플러그인 추가
  ],
})