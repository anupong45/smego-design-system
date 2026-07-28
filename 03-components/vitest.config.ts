import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    /* ts ด้วย — เทสต์ที่ไม่มี JSX (เช่น rac-fallback) ไม่ควรถูกบังคับเป็น .tsx */
    include: ['tests/a11y/**/*.test.{ts,tsx}'],
  },
});
