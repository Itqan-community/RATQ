import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: { exclude: ['e2e/**', 'node_modules/**', '.open-next/**'], globals: true, environment: 'jsdom', setupFiles: './src/test/setup.ts' },
});
