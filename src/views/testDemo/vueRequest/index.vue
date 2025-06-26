<template>
  <div class="page-index2">VueRequest</div>
</template>

<script setup lang="ts">
import { useRequest, usePagination, useLoadMore } from 'vue-request'
import Mock from 'mockjs'
const { proxy } = getCurrentInstance() as any

const ready = ref(false)
const someRef = ref()

// 依赖刷新
// const someReactive = reactive({
//   count: 0
// })
// const { data, refresh } = useRequest(proxy.$http.AgentSelect)
// watch([someRef, () => someReactive.count], refresh)

// 分页管理（https://www.attojs.com/api/pagination.html#return-values）
// const { data, current, totalPage, loading, pageSize } = usePagination(proxy.$http.AgentSelect, {
//   defaultParams: [
//     {
//       limit: 5
//     }
//   ],
//   pagination: {
//     currentKey: 'page',
//     pageSizeKey: 'limit',
//     totalKey: 'data.total'
//   }
// })

// 加载更多 （https://www.attojs.com/guide/documentation/loadMore.html#%E4%BE%8B%E5%AD%90）
// const { data, loadingMore, dataList, loading, noMore, loadMore, refresh } = useLoadMore(getUserInfo, {
//   isNoMore: (d) => {
//     return d?.list.length === d?.total
//   }
// })

// 请求demo
useRequest(proxy.$http.AgentSelect, {
  defaultParams: [
    {
      name: Mock.mock('@name')
    }
  ],

  // 轮询（屏幕、网络状态）
  // pollingInterval: 1000,
  // initialData: 0,
  // pollingWhenHidden: true,
  // pollingWhenOffline: true,

  // 依赖请求（自动、手动模式）
  // ready: ready, // 每次 ready 从 false 变为 true 时，都会自动发起请求

  // 防抖与防抖
  // debounceInterval: 300,
  // throttleInterval: 1000,

  // 数据缓存与预加载（缓存时间、保险时间、请求共享、动态key，清除缓存、自定义缓存）
  // cacheKey: 'JobType', // 拥有相同的 cacheKey 时，同时只会有一个在发起请求，后发起的将会共用同一个请求。
  // cacheTime: 5 * 60 * 1000, // 保鲜时间

  // 错误重试（次数、间隔）
  // errorRetryCount: 5, // it will retry 5 times
  // errorRetryInterval: 3 * 1000, // The retry interval is 3 seconds

  // loading状态（延迟、持续时间）
  // loadingDelay: 400, // 如果在指定的时间内完成了请求，那就不展示 loading 动画，超过指定时间后才进行展示
  // loadingKeep: 1000, // 如果展示了 loading 动画，那至少要展示足够长的时间，不能一闪而过

  // 依赖刷新（语法糖，本质还是封装watch监听） manual=true 时，refreshDepsAction 也会被触发。这与 refreshDeps
  // refreshDeps: someRef,
  // refreshDepsAction: () => { // 自定义依赖刷新的行为
  //    run(1)
  // }

  // 聚焦时重新请求
  // refreshOnWindowFocus: true,
  // refocusTimespan: 2 * 1000, // 2s

  onSuccess: (data) => {
    console.log('onSuccess----', data)
  },
  onError: (error) => {
    console.log('onError----', error)
  },
  onBefore: (params) => {},
  onAfter: (params) => {}
})
</script>

<style lang="scss" scoped></style>
