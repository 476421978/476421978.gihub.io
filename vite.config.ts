import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import loder_pxtovw from './postcss.config' // 适配
import AutoImport from 'unplugin-auto-import/vite'

function _resolve(dir: string) {
  return path.resolve(__dirname, dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // 上传地址
      '/upload': {
        target: 'https://jsonplaceholder.typicode.com/posts/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/upload/, '')
      },
      '/chatMessages': {
        target: 'http://dify.packertec.com/v1/chat-messages',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chatMessages/, '')
      }
    }
  },
  plugins: [
    vue(),
    AutoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/,
        /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: [
        // presets
        'vue',
        'vue-router'
        // custom
      ],
      dts: true // 生成auto-imports.d.ts文件配合tsconfig.json的include避免not find
      /* options */
    })
  ], // 配置项目别名
  css: {
    postcss: {
      plugins: [loder_pxtovw]
    }
  },
  resolve: {
    alias: {
      '@': _resolve('src'),
      '@p': _resolve('docs/public')
    }
  },
  assetsInclude: ['**/*.xls'], // 解决import导入xls文件无法解析
  build: {
    chunkSizeWarningLimit: 1000
  }
})
