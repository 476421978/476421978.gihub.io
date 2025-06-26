/* eslint-disable */
import Cache from '@/utils/cache'
import common from '@/common/common'
// Dify API 请求方法
const API_KEY = 'app-Z0gRzGnTcUrfBM0pXl6grIdi'

// 消息处理工具函数
export const messageUtils = {
  // 解析流式数据
  parseStreamData(text) {
    const lines = text.split('\n')
    return lines
      .filter((line) => line.startsWith('data: '))
      .map((line) => {
        try {
          return JSON.parse(line.substring(6))
        } catch (e) {
          return null
        }
      })
      .filter(Boolean)
  },

  // 处理消息事件
  handleMessageEvent(bufferObj, callback) {
    if (bufferObj.status === 400 || !bufferObj.event) {
      callback({
        message: '',
        conversationId: undefined,
        messageId: '',
        errorMessage: bufferObj.message || '未知错误',
        errorCode: bufferObj.code || 400
      })
      return
    }
    const eventHandlers = {
      message: () => ({
        message: bufferObj.answer,
        conversationId: bufferObj.conversation_id,
        taskId: bufferObj.task_id,
        messageId: bufferObj.id
      }),
      agent_message: () => ({
        message: bufferObj.answer,
        conversationId: bufferObj.conversation_id,
        taskId: bufferObj.task_id,
        messageId: bufferObj.id
      }),
      agent_thought: () => ({
        type: 'thought',
        data: bufferObj
      }),
      message_file: () => ({
        type: 'file',
        data: bufferObj
      }),
      message_end: () => ({
        type: 'messageEnd',
        data: bufferObj
      }),
      message_replace: () => ({
        type: 'messageReplace',
        data: bufferObj
      }),
      workflow_started: () => ({
        type: 'workflowStarted',
        data: bufferObj
      }),
      workflow_finished: () => ({
        type: 'workflowFinished',
        data: bufferObj
      }),
      node_started: () => ({
        type: 'nodeStarted',
        data: bufferObj
      }),
      node_finished: () => ({
        type: 'nodeFinished',
        data: bufferObj
      })
    }

    const handler = eventHandlers[bufferObj.event]
    if (handler) {
      callback(handler())
    }
  },

  // 处理二进制数据
  handleBinaryData(data, callback) {
    const uint8Array = new Uint8Array(data)
    let text = String.fromCharCode.apply(null, uint8Array)
    text = decodeURIComponent(escape(text))

    const messages = this.parseStreamData(text)
    messages.forEach((bufferObj) => {
      this.handleMessageEvent(bufferObj, callback)
    })
  },

  // 处理 H5 端流式数据
  async handleH5Stream(response, callback) {
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          callback({ type: 'completed' })
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const messages = this.parseStreamData(buffer)

        messages.forEach((bufferObj) => {
          this.handleMessageEvent(bufferObj, callback)
        })

        buffer = buffer.split('\n').pop()
      }
    } catch (error) {
      callback({
        message: '',
        conversationId: undefined,
        messageId: '',
        errorMessage: error.message || '读取流数据失败'
      })
      callback({ type: 'completed', hasError: true })
    } finally {
      reader.releaseLock()
    }
  }
}

// 获取应用信息
export const getDifyInfo = () => {
  let reqUrl = ''
  // #ifdef MP-WEIXIN || MP-ALIPAY
  reqUrl = 'https://dify.packertec.com/v1/parameters'
  // #endif

  // #ifdef H5
  reqUrl = 'https://dify.packertec.com/v1/parameters'
  // #endif

  uni.showLoading({
    title: '加载中...',
    mask: true
  })

  return new Promise((resolve, reject) => {
    uni.request({
      url: reqUrl,
      method: 'GET',
      header: {
        Authorization: `Bearer ${API_KEY}`
      },
      success: (response) => {
        uni.hideLoading()
        resolve(response)
      },
      fail: (error) => {
        uni.hideLoading()
        reject(error)
      }
    })
  })
}

// 发送消息/创建会话列表
export const sendMessage = (data) => {
  let reqUrl = ''
  // #ifdef MP-WEIXIN || MP-ALIPAY
  reqUrl = 'https://dify.packertec.com/v1/chat-messages'
  // #endif

  // #ifdef H5
  reqUrl = 'https://dify.packertec.com/v1/chat-messages'
  // #endif

  return new Promise((resolve, reject) => {
    // #ifdef H5
    fetch(reqUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: {
          token: Cache.get(common.API_TOKEN) || '',
          env: (() => {
            if (process.env.NODE_ENV === 'development' || window.location.origin.indexOf('debug') > -1) {
              return 'test'
            }
            return 'prod'
          })()
        },
        query: data.query,
        response_mode: 'streaming',
        conversation_id: data.conversationId,
        user: data.user
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        resolve(response)
        // 开始处理流式数据
        await messageUtils.handleH5Stream(response, data.onChunkReceived)
      })
      .catch((error) => {
        reject(error)
      })
    // #endif

    // #ifdef MP-WEIXIN || MP-ALIPAY
    const requestTask = uni.request({
      url: reqUrl,
      method: 'POST',
      dataType: 'arraybuffer',
      header: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        inputs: {
          token: Cache.get(common.API_TOKEN) || '',
          env: (() => {
            const envVersion = uni.getAccountInfoSync().miniProgram.envVersion
            if (envVersion === 'develop' || envVersion === 'trial') {
              return 'test'
            }
            return 'prod'
          })()
        },
        query: data.query,
        response_mode: 'streaming',
        conversation_id: data.conversationId,
        user: data.user
      },
      enableChunked: true,
      responseType: 'arraybuffer',
      success: (response) => {
        uni.hideLoading()
        // #ifdef MP-ALIPAY
        messageUtils.handleBinaryData(response.data, data.onChunkReceived)
        // #endif
        resolve(response)
      },
      fail: (error) => {
        uni.hideLoading()
        reject(error)
      }
    })
    // #endif

    // #ifdef MP-WEIXIN
    requestTask.onChunkReceived((res) => {
      messageUtils.handleBinaryData(res.data, data.onChunkReceived)
    })
    // #endif
  })
}

// 获取会话列表
export const getConversationList = (user) => {
  let reqUrl = ''
  // #ifdef MP-WEIXIN || MP-ALIPAY
  reqUrl = `https://dify.packertec.com/v1/conversations?user=${user}`
  // #endif

  // #ifdef H5
  reqUrl = `https://dify.packertec.com/v1/conversations?user=${user}`
  // #endif

  uni.showLoading({
    title: '加载中...',
    mask: true
  })

  return new Promise((resolve, reject) => {
    uni.request({
      url: reqUrl,
      method: 'GET',
      header: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      success: (response) => {
        uni.hideLoading()
        resolve(response)
      },
      fail: (error) => {
        uni.hideLoading()
        reject(error)
      }
    })
  })
}

// 获取历史会话消息 默认近20条
export const getMessages = (conversationId, user) => {
  let reqUrl = ''
  let params = `?user=${user}&conversation_id=${conversationId}`
  // #ifdef MP-WEIXIN || MP-ALIPAY
  reqUrl = `https://dify.packertec.com/v1/messages` + params
  // #endif

  // #ifdef H5
  reqUrl = `https://dify.packertec.com/v1/messages` + params
  // #endif

  uni.showLoading({
    title: '加载中...',
    mask: true
  })

  return new Promise((resolve, reject) => {
    uni.request({
      url: reqUrl,
      method: 'GET',
      header: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      success: (response) => {
        uni.hideLoading()
        resolve(response)
      },
      fail: (error) => {
        uni.hideLoading()
        reject(error)
      }
    })
  })
}

// 删除会话
export const deleteConversation = (conversationId, user) => {
  let reqUrl = ''
  // #ifdef MP-WEIXIN || MP-ALIPAY
  reqUrl = `https://dify.packertec.com/v1/conversations/${conversationId}`
  // #endif

  // #ifdef H5
  reqUrl = `https://dify.packertec.com/v1/conversations/${conversationId}`
  // #endif

  uni.showLoading({
    title: '删除中...',
    mask: true
  })

  return new Promise((resolve, reject) => {
    uni.request({
      url: reqUrl,
      method: 'DELETE',
      header: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        user
      },
      success: (response) => {
        uni.hideLoading()
        resolve(response)
      },
      fail: (error) => {
        uni.hideLoading()
        reject(error)
      }
    })
  })
}

// 停止响应
export const stopMessage = (taskId, user) => {
  let reqUrl = ''
  // #ifdef MP-WEIXIN || MP-ALIPAY
  reqUrl = `https://dify.packertec.com/v1/chat-messages/${taskId}/stop`
  // #endif

  // #ifdef H5
  reqUrl = `https://dify.packertec.com/v1/chat-messages/${taskId}/stop`
  // #endif

  uni.showLoading({
    title: '停止中...',
    mask: true
  })

  return new Promise((resolve, reject) => {
    uni.request({
      url: reqUrl,
      method: 'POST',
      header: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        user
      },
      success: (response) => {
        uni.hideLoading()
        resolve(response)
      },
      fail: (error) => {
        uni.hideLoading()
        reject(error)
      }
    })
  })
}

// 语音转文字
export const sendAudioToText = (filePath, user) => {
  let reqUrl = ''
  // #ifdef MP-WEIXIN || MP-ALIPAY
  reqUrl = `https://dify.packertec.com/v1/audio-to-text`
  // #endif

  // #ifdef H5
  reqUrl = `https://dify.packertec.com/v1/audio-to-text`
  // #endif

  uni.showLoading({
    title: '识别中...',
    mask: true
  })

  return new Promise((resolve, reject) => {
    // #ifdef H5
    if (filePath instanceof File) {
      const formData = new FormData()
      formData.append('file', filePath)
      formData.append('user', user)

      fetch(reqUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`
        },
        body: formData
      })
        .then((response) => response.json())
        .then((data) => {
          uni.hideLoading()
          resolve({ data: JSON.stringify(data) })
        })
        .catch((error) => {
          uni.hideLoading()
          reject(error)
        })
    } else {
      // 处理字符串类型的文件路径
      uni.uploadFile({
        url: reqUrl,
        filePath: filePath,
        name: 'file',
        header: {
          Authorization: `Bearer ${API_KEY}`
        },
        formData: {
          user
        },
        success: (response) => {
          uni.hideLoading()
          resolve(response)
        },
        fail: (error) => {
          uni.hideLoading()
          reject(error)
        }
      })
    }
    // #endif

    // #ifdef MP-WEIXIN || MP-ALIPAY
    uni.uploadFile({
      url: reqUrl,
      filePath: filePath,
      name: 'file',
      header: {
        Authorization: `Bearer ${API_KEY}`
      },
      formData: {
        user
      },
      success: (response) => {
        uni.hideLoading()
        resolve(response)
      },
      fail: (error) => {
        uni.hideLoading()
        reject(error)
      }
    })
    // #endif
  })
}

export default {
  getDifyInfo,
  sendMessage,
  getMessages,
  deleteConversation,
  stopMessage,
  sendAudioToText,
  getConversationList
}
