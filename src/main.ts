import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import http from '@/api/index'

// 全局样式
import '@/style/index.scss'

// element图标库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// vue-router4
import router from '@/router'
import '@/router/permission'

import * as echarts from 'echarts' //引入echarts

// 状态管理器
import { createPinia } from 'pinia'
const pinia = createPinia()

// 模拟数据mock 会拦截请求
import '../mock/index.js'

import { Marquee } from '@nutui/nutui-bingo'
import '@nutui/nutui-bingo/dist/style.css'

// vue-request插件
import { setGlobalOptions } from 'vue-request'
setGlobalOptions({
  manual: false // 禁止挂载时的默认请求，然后通过 run() 或者 runAsync() 来触发请求。
  // ...
})

// 创建
const app = createApp(App)

app.use(Marquee as any)

// 提供全局属性
app.provide('$echarts', echarts)
app.config.globalProperties.$http = http

// globalProperties 使用方式
// const cns = getCurrentInstance()
// console.log(cns.appContext.config.globalProperties.$http)
// const { proxy } = getCurrentInstance()
// console.log('http----', proxy.$http)

app.use(router)

app.use(pinia)

app.use(ElementPlus)

app.mount('#app')
