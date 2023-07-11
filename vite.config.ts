import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// @ts-ignore
import { name, version } from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: any) {
            if (id.includes('node_modules')) {
              return id
                .toString()
                .split('node_modules/')[1]
                .split('/')[0]
                .toString();
            }
          },
          entryFileNames: '[name].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
  };
});
