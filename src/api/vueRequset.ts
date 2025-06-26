import axios from 'axios'

export const handQueue = (
  reqs: [] // 请求总数
) => {
  reqs = reqs || []

  const requestQueue = (concurrency: number) => {
    concurrency = concurrency || 6 // 最大并发数
    const queue: Function[] = [] // 请求池
    let current = 0

    const dequeue = () => {
      while (current < concurrency && queue.length) {
        current++
        const requestPromiseFactory = queue.shift() as Function // 出列
        requestPromiseFactory()
          .then(() => {
            // 成功的请求逻辑
          })
          .catch((error: object | string) => {
            // 失败
            console.log(error)
          })
          .finally(() => {
            current--
            dequeue()
          })
      }
    }

    return (requestPromiseFactory: Function) => {
      queue.push(requestPromiseFactory) // 入队
      dequeue()
    }
  }

  // 测试
  // const enqueue = requestQueue(6)
  // for (let i = 0; i < reqs.length; i++) {
  //   enqueue(() => axios.get('/api/test' + i))
  // }
}
