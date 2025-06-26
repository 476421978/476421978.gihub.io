import mqtt from 'mqtt'
// MQTT Broker配置
const brokerUrl = 'mqtt://127.0.0.1:8084' // broker地址和端口，我是本地的，就是这个
const clientId = 'mqttx_5f5b2336' // 客户端ID，可以自定义

// 创建MQTT客户端实例
const client = mqtt.connect(brokerUrl, {
  connectTimeout: 40000,
  clientId: clientId,
  clean: true
})

// 连接成功后的回调函数
client.on('connect', () => {
  console.log(`客户端${clientId}已连接到MQTT Broker`)

  // 订阅主题
  const subscribeTopic = 'topic1'
  client.subscribe(subscribeTopic, (err) => {
    if (!err) {
      console.log(`已订阅主题：${subscribeTopic}`)
    } else {
      console.error('订阅主题时发生错误：', err)
    }
  })

  // 发布消息
  const publishTopic = 'topic1'
  const message = 'Hello from Node.js MQTT Client!'
  client.publish(publishTopic, message, { qos: 0 }, (err) => {
    if (!err) {
      console.log(`已向主题${publishTopic}发送消息：${message}`)
    } else {
      console.error('发布消息时发生错误：', err)
    }
  })
})

// 收到消息的回调函数
client.on('message', (topic, payload) => {
  console.log(`从主题${topic}收到消息：`, payload.toString())
})

// 断开连接事件处理
client.on('disconnect', () => {
  console.log('与MQTT Broker断开连接')
})

// 错误处理
client.on('error', (err) => {
  console.error('MQTT客户端发生错误：', err)
})
