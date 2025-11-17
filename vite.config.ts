import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/wherewindsmeet-ngl/',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
