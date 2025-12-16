import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // 前台（原本的靜態首頁）
        main: resolve(__dirname, 'index.html'),
        // 中文首頁
        zh: resolve(__dirname, 'index.zh.html'),
        // 後台（React 掛在 admin.html）
        admin: resolve(__dirname, 'admin.html'),
        // 單篇公告頁（動態讀取）
        post: resolve(__dirname, 'post.html'),
      },
    },
  },
});
