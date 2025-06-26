import { Theme, inBrowser, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
// 自定义布局
import Layout from '@/layout/index.vue'
// element-plus
import elementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局样式
import '@/style/index.scss'

// 模拟数据mock 会拦截请求
import '@/../mock/index'

import * as echarts from 'echarts' //引入echarts

// import elementAgain from '@/views/again/element-again/index'
// import HelloWorld from '@/components/HelloWorld.vue'

import { useComponents } from './useComponents'

import VueAutoScroll from '@fcli/vue-auto-scroll'

import 'vitepress-theme-demoblock/dist/theme/styles/index.css'

import '@nutui/nutui-bingo/dist/style.css'
// import { Marquee } from '@nutui/nutui-bingo'

const theme: Theme = {
  ...DefaultTheme,
  Layout,
  NotFound: () => 'custom 404',
  enhanceApp({ app, router, siteData }) {
    // app.use(Marquee as any)
    app.use(VueAutoScroll)
    // 全局注册
    // app.config.globalProperties.$echarts = echarts
    app.provide('$echarts', echarts)

    // app is the Vue 3 app instance from `createApp()`.
    // router is VitePress' custom router. `siteData` is
    // a `ref` of current site-level metadata.

    // 全局注册 Element-plus
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
    app.use(elementPlus)

    useComponents(app)

    // app.component('elemen-again', elementAgain)
    // app.component('HelloWorld', HelloWorld)
  },
  setup() {
    // this function will be executed inside VitePressApp's
    // setup hook. all composition APIs are available here.
  }
}

export default theme
