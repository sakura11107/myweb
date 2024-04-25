import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  esbuild:{
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  server:{
    proxy:{
      '/accounts':{
        target:'http://127.0.0.1:3000/accounts',
        changeOrigin:true,
        //path.replace(/^\/accounts/, '')是一个替换操作，它会将请求路径中符合正则表达式 /^\/accounts/的部分替换成空字符串。换句话说，就是将请求路径中的 /accounts 前缀移除
        rewrite:path => path.replace(/^\/accounts/,'')
      },
      '/login':{
        target:'http://127.0.0.1:3000/login',
        changeOrigin:true,
        rewrite:path => path.replace(/^\/login/,'')
      },
      '/register':{
        target:'http://127.0.0.1:3000/register',
        changeOrigin:true,
        rewrite:path => path.replace(/^\/register/,'')
      },
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
