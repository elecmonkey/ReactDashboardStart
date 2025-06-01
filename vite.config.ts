// import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            // 第三方库分包
            {
              name: 'vendor',
              test: /node_modules[\\/]+(react|react-dom|react-router|@ant-design|antd|axios|zustand|lucide-react)/,
              priority: 100,
            },
            {
              name: 'pages',
              test: /src[\\/]pages[\\/]/,
              priority: 90,
            },
            // 公共模块分包
            {
              name: 'shared',
              test: /src[\\/](components|utils|hooks|services)/,
              priority: 80,
            },
            // 其他第三方库
            {
              name: 'vendor-common',
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      }
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1500,
  },
}; 