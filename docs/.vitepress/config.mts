import { defineConfig } from 'vitepress'
import { ES6, JavaScript, Back, Front, Notes } from './catalog'

// element-plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'

import path from 'path'

function _resolve(dir) {
  return path.resolve(__dirname, dir)
}

export default defineConfig({
  // site-level options
  title: 'HLG随笔',
  lang: 'zh-CN',
  description: '包含HTML、CSS、JavaScript、Vue、React、TypeScript、Node.js...',
  outDir: '../dist',
  head: [
    // 在 Chrome 85 版本中，为了保护用户的隐私，默认的 Referrer Policy 则变成了 strict-origin-when-cross-origin
    // 所以必须加入此部分代码，否则文章统计访问量的数据则不正确
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
    // 添加百度统计
    [
      'script',
      {},
      `var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?d5157f2f0cc7fe0c7547aa91448d6b6d";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();`
    ]
    // ['script', { async: '', src: 'https://unpkg.com/browse/vue3-seamless-scroll@1.0.2/dist/vue3-seamless-scroll.min.js' }]
    // [
    //   "script",
    //   { async: '', src: '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js' }
    // ]
  ],
  themeConfig: {
    nav: [
      {
        text: '前端',
        items: Front
      },
      {
        text: 'ES6',
        items: ES6
      },
      {
        text: 'JavaScript',
        items: JavaScript
      },
      {
        text: '杂记',
        items: Notes
      },
      {
        text: '后端',
        items: Back
      },
      {
        text: '关于',
        items: [{ text: '更新日志', link: '/关于/更新日志' }]
      }
    ],
    sidebar: {
      '/前端/': Front,
      '/ES6/': ES6,
      '/JavaScript/': JavaScript,
      '/杂记/': Notes,
      '/后端/': Back
    },
    search: {
      provider: 'local'
      // options: {
      //   locales: {
      //     zh: {
      //       translations: {
      //         button: {
      //           buttonText: '搜索文档',
      //           buttonAriaLabel: '搜索文档'
      //         },
      //         modal: {
      //           noResultsText: '无法找到相关结果',
      //           resetButtonTitle: '清除查询条件',
      //           footer: {
      //             selectText: '选择',
      //             navigateText: '切换'
      //           }
      //         }
      //       }
      //     }
      //   }
      // }
    },
    outlineTitle: '此页目录', // 大纲中显示的标题级别
    // lastUpdatedText: "最后更新时间",
    outline: [2, 6],
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    footer: {
      message: '© <a href="https://hlgshare.top">hlgshare.top</a> @2023-2024',
      copyright: '<a href="https://beian.miit.gov.cn/#/Integrated/index">粤公网安备 44122502000031号</a>'
    }
    // theme-level options
  },
  // 插件
  plugins: [
    // ...
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  // vite配置，不需要单独vite配置文件
  vite: {
    server: {
      proxy: {
        // 上传地址
        '/upload': {
          target: 'https://jsonplaceholder.typicode.com/posts/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/upload/, '')
        }
      }
    },
    plugins: [demoblockVitePlugin()],
    optimizeDeps: {
      // 此选项可强制预构建链接的包
      include: ['element-plus']
    },
    resolve: {
      alias: {
        '@': _resolve('../../src'),
        '@p': _resolve('../public')
      }
    },
    assetsInclude: ['**/*.xls'], // 解决import导入xls文件无法解析
    build: {
      chunkSizeWarningLimit: 1000
    }
  },
  // ssr: {
  //   noExternal: [
  //     "element-plus",
  //   ],
  // },
  // ...
  markdown: {
    config: (md) => {
      md.use(demoblockPlugin, {
        customClass: 'demoblock-custom'
      })
    }
  }
})
