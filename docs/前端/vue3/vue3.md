## 1、父子组件实现双向绑定的理解

借助 computed 方法，proxy 代理对象，实现 get,set 方法
<img src="/前端/vue3/4.png" />

## 2、动态组件

<img src="/前端/vue3/5.png" />

### 组件暴露

<img src="/前端/vue3/6.png" />

### 父组调用

```vue
const tabOptions = ref() TabPaneAllRef?.value[index].executeRefFn()
```

## 3、public 使用本地文件

导入本地文件
<img src="/前端/vue3/7.png" />

- /public/panel/cdn/\*\*

## 4、vite.config.js 插件优化

### 插件配置信息

<img src="/前端/vue3/8.png" />

- resolvers: [ElementPlusResolver]是 element-plus 的按需引入

### 扩展 vite+vue3+ts

```js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入element-plus
import AutoImport from 'unplugin-auto-import/vite' // 自动引入包
import Components from 'unplugin-vue-components/vite' // 自动引入组件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { htmlPlugin } from './html-plugin.js'
import path from 'path'
import progress from 'vite-plugin-progress' // 打包进度条
import { visualizer } from 'rollup-plugin-visualizer' // 分析代码结构
import vueSetupExtend from 'vite-plugin-vue-setup-extend' // 组件命名

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const timestamp = +new Date()
  return {
    server: {
      host: '0.0.0.0',
      port: 5173,
      cors: true,
      open: true,
      hmr: true,
      proxy: {
        '/api': {
          target: loadEnv(mode, process.cwd()).VITE_BASE_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/upload': {
          target: 'https://upload-z2.qiniup.com/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^upload/, '')
        }
      }
    },
    plugins: [
      vue(),
      AutoImport({
        // 需要去解析的文件
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        // imports 指定自动引入的包位置（名）
        imports: ['vue', 'pinia', 'vue-router', '@vueuse/core'],
        dts: 'src/auto-imports.d.ts', // 生成ts文件不然volar会报错找不到
        // 生成相应的自动导入json文件。
        eslintrc: {
          // 启用
          enabled: true,
          // 生成自动导入json文件位置
          filepath: './.eslintrc-auto-import.json',
          // 全局属性值
          globalsPropValue: true
        },
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        // imports 指定组件所在目录，默认为 src/components
        dirs: ['src/components/', 'src/view/'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [ElementPlusResolver()]
      }),
      vueSetupExtend(),
      progress(),
      visualizer()
    ].concat(mode === 'production' ? htmlPlugin() : []),
    // 配置别名
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    // 构建
    build: {
      assetsDir: 'assets/css/', // 静态资源存放
      target: 'modules', // 设置最终构建的浏览器兼容目标。modules:支持原生 ES 模块的浏览器
      sourcemap: false, // 构建后是否生成 source map 文件
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      /** 在打包代码时移除 console.log 和 注释 */
      terserOptions: {
        compress: {
          drop_console: false,
          pure_funcs: ['console.log']
        },
        format: {
          /** 删除注释 */
          comments: false
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].' + timestamp + '.js',
          entryFileNames: 'assets/js/[name]-[hash].' + timestamp + '.js',
          assetFileNames: 'assets/[ext]/[name]-[hash].' + timestamp + '.[ext]'
        }
      }
    }
  }
})
```

## 5、ant-design-vue2.2.8 踩坑 依赖问题

::: danger

`[vite] Failed to load source map for /node_modules/.vite/chunk-CCWPAK2K.js?v=XXXXXXXX.`
or
`[vite]:new dependencies found: ant-design-vue/es/spin/style/css, ant-design-vue/es/select/style/css, updating...`
:::

### 图片：

<img src="/前端/vue3/1.png" />

<img src="/前端/vue3/2.png" />

### 原因：`node_modules/.vite`只有`pack.json`文件

### 已经排除方法

- 1.删除 node_modules，重新安装
- 2.版本 less，vite，vue，ant-design-vue 版本问题
- 3.三方插件影响【新增插件重新安装影响到 node_modules 都会出现这个问题】
- 4.vite.config.js 文件中的 vite-plugin-components 已经停更，ant-design-vue3 转用 # **[unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)**

### 解决 ✨ dependencies updated, reloading page...

<img src="/前端/vue3/3.png" />
看 node_modules/.vite 中缺少文件，有时也会出现，找不到 ant-design-vue 的 css 或者 js 文件等自动补充，一般点击跳转页面后会出，等待自动修复，不确定性。
**当页面需要跳转时可以暂时把判断逻辑注释，不要拦截让其先跳转最简单的页面布局，自动修复后再复原页面。
