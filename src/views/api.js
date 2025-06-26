const express = require('express')
const app = express()
const PORT = 3000

app.get('/sse-endpoint', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  // 每隔 5 秒发送一条消息
  const interval = setInterval(() => {
    res.write(`data: ${new Date().toLocaleTimeString()}\n\n`)
  }, 5000)

  // 监听请求关闭事件
  req.on('close', () => {
    clearInterval(interval)
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
