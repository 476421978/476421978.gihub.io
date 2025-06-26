/**
 * toValue() 是一个在 3.3 版本中新增的 API。它的设计目的是将 ref 或 getter 规范化为值。如果参数是 ref，它会返回 ref 的值；
 * 如果参数是函数，它会调用函数并返回其返回值。否则，它会原样返回参数。它的工作方式类似于 unref()，但对函数有特殊处理
 */
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)

  watchEffect(async () => {
    // reset state before fetching..
    data.value = null
    error.value = null
    const urlValue = toValue(url)
    try {
      await timeout()
      const res = await fetch(urlValue) // 全局的 fetch() 方法用于发起获取资源的请求
      // const fetchData = () => {
      //   fetch(toValue(urlValue))
      //     .then((res) => res.json())
      //     .then((json) => (data.value = json))
      //     .catch((err) => (error.value = err))
      // }
      data.value = await res.json()
    } catch (e) {
      error.value = e
    }
  })
  return { data, error }
}

// 随机延迟
function timeout() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve()
      } else {
        reject(new Error('Random Error'))
      }
    }, 300)
  })
}
