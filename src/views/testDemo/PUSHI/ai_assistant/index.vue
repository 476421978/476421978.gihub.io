<template>
  <view class="ai_assistant_container">
    <!--#ifdef MP-WEIXIN || H5 -->
    <u-navbar
      :title="$t('tabbar.ai_assistant')"
      placeholder
      :autoBack="false"
      :leftIconColor="color.navigation"
      leftIconSize="37rpx"
      :titleStyle="{ color: color.navigation, fontSize: '37rpx' }"
    >
      <view slot="left"></view>
    </u-navbar>
    <!--#endif-->

    <mescroll-uni
      ref="mescrollRef"
      :fixed="false"
      :safearea="true"
      :bottom="100"
      @init="mescrollInit"
      @up="upCallback"
      :down="{ auto: false, use: false }"
      :up="{ auto: false }"
    >
      <view class="ai_assistant_content">
        <view class="notice">
          <img src="../../static/image/ai_assistant/notice_icon.png" style="width: 32rpx; height: 32rpx" />
          内容由AI大模型生成，请注意甄别
        </view>

        <view class="corner_cut">
          <view class="top_image_box">
            <view class="top_image_box_inner">
              <img class="top_image" :src="imgPath.AI_TITLE" />
              <img class="top_image_icon" src="../../static/image/ai_assistant/ai_banner_bootom.png" style="width: 76rpx; height: 12rpx" />
            </view>
            <view class="top_image_text">Hi, 我是你的AI助手小派</view>
          </view>

          <view class="bottom_text">
            {{ parametersInfo.opening_statement }}
          </view>

          <view class="bottom_btn_box">
            <view v-for="(item, index) in parametersInfo.suggested_questions" :key="index" style="margin-bottom: 20rpx">
              <u-button :customStyle="customStyleBtn" @click="onQuickSearch(item)">
                {{ item }}
              </u-button>
            </view>
          </view>

          <img class="img_banner" :src="imgPath.AI_BANNER" alt="" />
        </view>

        <view class="chat_box">
          <view v-for="(message, index) in messages" :key="index" :class="['message', { 'message-arrow-right': message.type === 'User' }]">
            <view v-if="message.type === 'User'" class="message-user">
              <view class="time">
                {{ timeFormat(message.created_at, 'yyyy年mm月dd日 hh:MM:ss') }}
              </view>
              <view class="message-text">{{ message.concatTxt }}</view>
            </view>

            <template v-else-if="message.type === 'AI'">
              <div class="message_ai">
                <view class="left-avatar">
                  <img src="../../static/image/ai_assistant/ai_chat.png" style="width: 80rpx; height: 80rpx" />
                </view>
                <view class="right-content">
                  <view class="name">{{ message.name }}</view>
                  <view class="time">
                    {{ timeFormat(message.created_at, 'yyyy年mm月dd日 hh:MM:ss') }}
                  </view>
                </view>
              </div>
              <view class="ai_concatTxt">
                <view v-if="message.concatTxt === '正在思考中'">
                  <div class="loading">{{ message.concatTxt }}</div>
                </view>
                <view v-else>
                  <ua-markdown :source="message.concatTxt" :spareField="spareField" :spareField2="spareField2" />
                </view>
              </view>
              <div v-if="index === messages.length - 1 && error" style="color: red">
                {{ error }}
              </div>
            </template>

            <template v-else-if="message.type === 'line'">
              <u-divider :text="message.concatTxt" textSize="24"></u-divider>
              <view class="corner_cut" style="margin: 0">
                <view class="top_image_box">
                  <view class="top_image_box_inner">
                    <img class="top_image" :src="imgPath.AI_TITLE" />
                    <img class="top_image_icon" src="../../static/image/ai_assistant/ai_banner_bootom.png" style="width: 76rpx; height: 12rpx" />
                  </view>
                  <view class="top_image_text">Hi, 我是你的AI助手小派</view>
                </view>

                <view class="bottom_text">
                  {{ parametersInfo.opening_statement }}
                </view>

                <view class="bottom_btn_box">
                  <view v-for="(item, index2) in parametersInfo.suggested_questions" :key="index2" style="margin-bottom: 20rpx">
                    <u-button :customStyle="customStyleBtn" @click="onQuickSearch(item)">
                      {{ item }}
                    </u-button>
                  </view>
                </view>

                <img class="img_banner" :src="imgPath.AI_BANNER" alt="" />
              </view>
            </template>

            <view v-if="message.type === 'AI'" class="ai_btn_box">
              <img src="../../static/image/ai_assistant/ai_copy.png" style="width: 48rpx; height: 48rpx" @click="onCopyText(message.concatTxt)" />
              <view class="line" />
              <img
                src="../../static/image/ai_assistant/ai_replay.png"
                style="width: 48rpx; height: 48rpx"
                :class="[{ rotating: index === messages.length - 1 && !message.isLoading ? answerIng : '' }]"
                @click="onReplayAnser(message)"
              />
            </view>
          </view>
        </view>
      </view>
    </mescroll-uni>

    <view v-if="conversationId" class="footer_btn">
      <view class="btn" @click="getHistoryMessage">
        <img src="../../static/image/ai_assistant/ai_footer_1.png" style="width: 32rpx; height: 32rpx; margin-right: 12rpx" />
        <span>历史对话</span>
      </view>
      <view class="btn" style="margin: 0 20rpx" @click="delConversation">
        <img src="../../static/image/ai_assistant/ai_footer_2.png" style="width: 32rpx; height: 32rpx; margin-right: 12rpx" />
        <span>清空历史</span>
      </view>
      <view class="btn" @click="onNewConversation">
        <img src="../../static/image/ai_assistant/ai_footer_3.png" style="width: 32rpx; height: 32rpx; margin-right: 12rpx" />
        <span>重新对话</span>
      </view>
    </view>
    <!-- 底部输入框 -->
    <view class="voice_keyboard">
      <img v-if="!isVoice" src="../../static/image/ai_assistant/ai_radio.png" style="width: 70rpx; height: 70rpx; margin-right: 20rpx" @click="onChangeVoice" />
      <img v-else src="../../static/image/ai_assistant/ai_keyboard.png" style="width: 70rpx; height: 70rpx; margin-right: 20rpx" @click="onChangeVoice" />

      <template v-if="isVoice">
        <view style="flex: 1">
          <recorder-core @recordEnd="handleRecordEnd"></recorder-core>
        </view>
      </template>
      <template v-else>
        <u-input
          style="height: 70rpx; background: #f0f3f5; border: none; border-radius: 12rpx; flex: 1"
          placeholder="请输入"
          clearable
          confirmType="发送"
          v-model="userInput"
          @confirm="sendMessage"
        />
      </template>
    </view>

    <tabbar :current-page="1" />
  </view>
</template>

<script>
import tabbar from '@/custom-tab-bar/index.vue'
import { mapGetters } from 'vuex'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import { getDifyInfo, sendMessage, getMessages, deleteConversation, sendAudioToText, getConversationList, stopMessage } from './difyRequest'
import RecorderCore from './components/RecorderCore.vue'
import Cache from '@/utils/cache'
import { timeFormat } from '@/utils/date'
import UaMarkdown from './components/UaMarkdown.vue'
import { apiCardServiceCardOperateGetSpareFieldAliasPost } from '@/api/ai_assistant'
export default {
  components: {
    tabbar,
    RecorderCore,
    UaMarkdown
  },
  data() {
    return {
      spareField: '备用字段1',
      spareField2: '备用字段2',
      timeFormat, // 时间格式化
      imgPath: this.$imgPath, // 图片路径
      user: 'user', // 需要唯一值
      parametersInfo: {}, // 参数信息
      isVoice: false, // 切换输入方式
      messages: [], // 消息列表
      userInput: '', // 用户输入
      receivedData: '', // 接收到的数据
      conversationId: '', // 会话ID
      error: null, // 错误
      answerIng: false, // 回答中
      historyMessage: [], // 历史对话
      conversationList: [], // 会话列表
      customStyleBtn: {
        height: '64rpx',
        fontSize: '28rpx',
        backgroundColor: '#fff',
        borderRadius: '12rpx'
      },
      titleStyle: {
        'max-width': '400rpx',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap'
      }
    }
  },
  computed: {
    ...mapGetters(['color'])
  },
  mixins: [MescrollMixin],
  async onLoad() {
    // 获取应用信息
    this.getDifyInfo()
    // 获取用户信息
    var userInfo = Cache.get(this.$common.KEY_USER_INFO) || {}
    this.user = userInfo.account_id || '未知用户'
    this.conversationId = Cache.get(`${this.user}_conversationId`) || ''

    this.getCardUserSpareFieldAlias()
  },
  methods: {
    // 获取自定义字段
    async getCardUserSpareFieldAlias() {
      this.$showLoading({
        title: this.$t('tip.loading'),
        mask: true
      })
      const [error, res] = await this.$to(apiCardServiceCardOperateGetSpareFieldAliasPost())
      uni.hideLoading()
      if (error) {
        return uni.$u.toast(error.message)
      }
      if (res && res.code === 0) {
        let result = res.data || {}
        this.spareField = result.spare_field
        this.spareField2 = result.spare_field2
      }
    },
    // 这里可以处理录音文件，比如上传到服务器等
    async handleRecordEnd(tempFilePath) {
      try {
        console.log('录音文件路径:', tempFilePath)
        let result
        // #ifdef H5
        // H5环境下，tempFilePath是blob URL，需要先转换为文件
        const response = await fetch(tempFilePath)
        const blob = await response.blob()
        const file = new File([blob], 'audio.wav', { type: 'audio/wav' })
        result = await sendAudioToText(file, this.user)
        // #endif

        // #ifdef MP-WEIXIN || MP-ALIPAY
        // 小程序环境下直接使用临时文件路径
        result = await sendAudioToText(tempFilePath, this.user)
        // #endif

        if (!result || !result.data) {
          throw new Error('语音识别失败')
        }

        const text = JSON.parse(result.data).text || ''
        if (!text) {
          uni.showToast({
            title: '无法识别语音内容',
            icon: 'none'
          })
          return
        }

        // 发送识别后的文本
        this.sendMessage(text)
      } catch (error) {
        console.error('语音识别错误:', error)
        uni.showToast({
          title: error.message || '语音识别失败',
          icon: 'none'
        })
      } finally {
        uni.hideLoading()
      }
    },
    async scrollBottom(val = 300) {
      await this.$nextTick()
      // 使用更短的滚动时间和更精确的滚动位置
      this.mescroll.scrollTo(999999, val)
    },
    upCallback() {
      this.mescroll.endErr()
    },
    onChangeVoice() {
      this.isVoice = !this.isVoice
    },
    // 复制文本
    async onCopyText(text) {
      // 使用正则表达式移除 <command> 标签及其内容
      const filteredText = text.replace(/<command>[\s\S]*?<\/command>/g, '')
      uni.setClipboardData({
        data: filteredText,
        success: function () {
          uni.$u.toast('复制成功')
        },
        fail: function (err) {
          uni.$u.toast(err || '复制失败')
        }
      })
    },
    // 快捷搜索
    onQuickSearch(val) {
      this.userInput = val
      this.sendMessage()
    },
    // 重新回答
    async onReplayAnser(messageInfo) {
      // 获取最后一条AI消息
      const lastAIMessage = this.messages.filter((msg) => msg.type === 'AI').pop()
      // 判断是否是最后一条AI消息
      const isLastAIMessage = lastAIMessage && lastAIMessage.id === messageInfo.id

      // 停止响应
      if (this.answerIng && lastAIMessage.task_id) {
        const isStop = await stopMessage(lastAIMessage.task_id, this.user)
        if (isStop.data?.result === 'success') {
          uni.$u.toast('已停止回答')
          lastAIMessage.conversation_id && Cache.set(`${this.user}_conversationId`, lastAIMessage.conversation_id) // 缓存会话ID
        }
        this.answerIng = false
        return
      }

      // 正在回复还没消息的时候不处理
      if (this.answerIng && !lastAIMessage.task_id) {
        return
      }

      if (isLastAIMessage) {
        // 如果是最后一条AI消息，删除最后一条用户消息和AI消息
        const lastUserMessage = this.messages.filter((msg) => msg.type === 'User').pop()

        if (!lastUserMessage) {
          uni.showToast({
            title: '没有可重新发送的消息',
            icon: 'none'
          })
          return
        }

        // 删除最后一条AI消息
        const aiMessageIndex = this.messages.findIndex((msg) => msg.id === lastAIMessage.id)
        if (aiMessageIndex !== -1) {
          this.messages.splice(aiMessageIndex, 1)
        }

        // 删除最后一条用户消息
        const userMessageIndex = this.messages.findIndex((msg) => msg.id === lastUserMessage.id)
        if (userMessageIndex !== -1) {
          this.messages.splice(userMessageIndex, 1)
        }

        // 使用用户消息重新发送
        this.sendMessage(lastUserMessage.concatTxt)
      } else {
        // 如果不是最后一条AI消息，找到对应的用户消息
        const messageIndex = this.messages.findIndex((msg) => msg.id === messageInfo.id)
        if (messageIndex === -1) return

        // 向前查找最近的一条用户消息
        let userMessage = null
        for (let i = messageIndex - 1; i >= 0; i--) {
          if (this.messages[i].type === 'User') {
            userMessage = this.messages[i]
            break
          }
        }

        if (!userMessage) {
          uni.showToast({
            title: '没有找到对应的用户消息',
            icon: 'none'
          })
          return
        }

        // 使用找到的用户消息重新发送
        this.sendMessage(userMessage.concatTxt)
      }
    },
    // 重新对话 = 清空会话ID，保留messages
    async onNewConversation() {
      if (!this.conversationId) {
        uni.$u.toast('已是最新对话')
        return
      }
      this.conversationId = ''
      this.receivedData = ''
      Cache.remove(`${this.user}_conversationId`)

      this.messages.push({
        type: 'line',
        concatTxt: '以下是新对话',
        name: '分割线',
        id: this.messages.length + 1,
        created_at: new Date().getTime()
      })

      this.scrollBottom()
    },
    // 清空历史 = 删除会话、会话ID
    async delConversation() {
      try {
        if (!this.conversationId) {
          uni.$u.toast('暂无可清空历史')
          return
        }
        await deleteConversation(this.conversationId, this.user)
        // 清空消息列表
        this.messages = []
        // 重置会话ID
        this.conversationId = ''
        Cache.remove(`${this.user}_conversationId`)
        uni.showToast({
          title: '清空历史成功',
          icon: 'none'
        })
        // 重置接收到的数据
        this.receivedData = ''
      } catch (error) {
        console.log('error', error)
        uni.showToast({
          title: '清空历史失败',
          icon: 'none'
        })
      }
    },
    async getConversationList() {
      const result = await getConversationList(this.user)
      this.conversationList = result.data.data || []
    },
    // 获取历史记录
    async getHistoryMessage() {
      try {
        if (!this.conversationId) {
          uni.showToast({
            title: '暂无历史记录',
            icon: 'none'
          })
          return
        }
        const result = await getMessages(this.conversationId, this.user)

        const historyMessage = result.data.data || []

        historyMessage.forEach((item) => {
          this.messages.push({
            type: 'User',
            concatTxt: item.query,
            name: '用户',
            id: this.messages.length + 1,
            created_at: item.created_at,
            conversation_id: item.conversation_id
          })

          this.messages.push({
            type: 'AI',
            concatTxt: item.answer || item.agent_thoughts[0]?.thought,
            name: 'AI助手',
            id: this.messages.length + 1,
            created_at: item.created_at,
            conversation_id: item.conversation_id
          })
        })

        this.scrollBottom()
      } catch (error) {
        console.log('error', error)
      }
    },
    // 获取应用信息
    async getDifyInfo() {
      try {
        const difyInfo = await getDifyInfo()
        this.parametersInfo = difyInfo.data || {}
      } catch (error) {
        console.log('error', error)
      }
    },
    // 发送/创建会话
    async sendMessage(text = '') {
      if (this.answerIng) {
        return
      }

      const enterText = text || this.userInput
      if (!enterText) {
        uni.$u.toast('请输入内容')
        return
      }

      this.answerIng = true
      this.error = null

      try {
        // 添加用户消息到消息列表
        this.messages.push({
          type: 'User',
          concatTxt: enterText,
          name: '用户',
          id: this.messages.length + 1,
          created_at: new Date().getTime(),
          conversation_id: '',
          message_id: '',
          metadata: {},
          task_id: ''
        })

        // 添加 loading 状态的 AI 消息
        this.messages.push({
          type: 'AI',
          concatTxt: '正在思考中',
          name: 'AI助手',
          id: this.messages.length + 1,
          created_at: new Date().getTime(),
          conversation_id: '',
          message_id: '',
          metadata: {},
          task_id: '',
          isLoading: true
        })

        // 滚动到底部
        this.scrollBottom()

        // 清空输入框
        this.userInput = ''

        await sendMessage({
          query: enterText,
          conversationId: this.conversationId,
          user: this.user,
          onChunkReceived: (data) => {
            if (data.type) {
              if (data.type === 'completed') {
                // if (data.hasError) {
                //   this.error = '流处理过程中发生错误'
                // }
                return
              }
              // 使用动态方法名调用对应的处理函数
              const handlerName = `handle${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`
              if (typeof this[handlerName] === 'function') {
                this[handlerName](data.data)
              }
            } else {
              this.handleData(data)
            }
          }
        })
      } catch (error) {
        this.error = error.message || '请求失败'
        console.error('Error:', error)
        this.answerIng = false
      }
    },

    // ----- 数据处理 -----
    handleData(data) {
      // if (data.errorMessage) {
      //   this.error = data.errorMessage
      // }
      this.receivedData += data.message

      // 找到最后一条 AI 消息
      const aiMessages = this.messages.filter((msg) => msg.type === 'AI')
      const lastAIMessage = aiMessages[aiMessages.length - 1]

      if (lastAIMessage && this.receivedData !== '\n' && data.message) {
        const lastAIMessageIndex = this.messages.indexOf(lastAIMessage)
        // 使用 this.$set 更新指定索引的消息
        this.$set(this.messages, lastAIMessageIndex, {
          ...lastAIMessage,
          concatTxt: this.receivedData,
          // 第一次接收到数据时，设置 isLoading 为 false
          isLoading: false,
          conversation_id: data.conversationId,
          message_id: data.messageId,
          metadata: {},
          task_id: data.taskId
        })
      }

      this.$nextTick(() => {
        this.scrollBottom(0)
      })
    },
    handleCompleted(hasError) {
      // console.log('流处理完成:', hasError)
      // if (hasError) {
      //   this.error = '流处理过程中发生错误'
      // }
      // 流处理完成后也滚动到底部
      this.scrollBottom()
    },
    handleThought(thought) {
      console.log('思考过程:', thought)
    },
    handleFile(file) {
      console.log('收到文件:', file)
    },
    handleMessageEnd(data) {
      console.log('消息结束:', data)
      this.conversationId = data.conversation_id
      this.receivedData = ''
      this.answerIng = false
      Cache.set(`${this.user}_conversationId`, data.conversation_id) // 缓存会话ID
      setTimeout(() => {
        this.scrollBottom()
      }, 500)
    },
    handleMessageReplace(data) {
      console.log('消息替换:', data)
    },
    handleWorkflowStarted(data) {
      console.log('工作流开始:', data)
    },
    handleWorkflowFinished(data) {
      console.log('工作流结束:', data)
    },
    handleNodeStarted(data) {
      console.log('节点开始:', data)
    },
    handleNodeFinished(data) {
      console.log('节点结束:', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.ai_assistant_container {
  height: calc(100vh - 168rpx);
  .ai_assistant_content {
    color: #1d1e20;
    height: calc(100% - 168rpx);
    .notice {
      display: flex;
      align-items: center;
      padding: 0 40rpx;
      background-color: #fff2e8;
      height: 72rpx;
      line-height: 72rpx;
      color: #fd953c;
      margin-bottom: 68rpx;
      img {
        margin-right: 12rpx;
      }
    }
  }
  .corner_cut {
    position: relative;
    margin: 0 40rpx;
    // min-height: 400rpx;
    .img_banner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }
    .top_image_box {
      position: absolute;
      left: 20rpx;
      top: -24rpx;
      width: calc(100% - 20rpx);
      display: flex;
      align-items: flex-end;

      .top_image_box_inner {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      .top_image {
        width: 154rpx;
        height: 118rpx;
      }

      .top_image_text {
        flex: 1;
        padding-bottom: 24rpx;
        font-family: PingFang SC;
        margin-left: 40rpx;
        font-weight: 400;
        font-size: 36rpx;
        line-height: 100%;
        letter-spacing: 0px;
      }
    }
    .bottom_text {
      font-weight: 400;
      font-size: 28rpx;
      line-height: 140%;
      letter-spacing: 0px;
      padding: 0 20rpx 20rpx 20rpx;
    }
    .bottom_btn_box {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0 20rpx;
    }

    .top_image_box,
    .bottom_text,
    .bottom_btn_box {
      position: relative; // 添加相对定位
      z-index: 1; // 设置更高的层级
    }
  }
}

.chat_box {
  padding: 40rpx;
  .message {
    margin-bottom: 10rpx;
    &.message-arrow-right {
      text-align: right;
    }
    .message-user {
      border-radius: 8rpx;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      max-width: 100%;
      .time {
        color: #8f9295;
        font-family: PingFang SC;
        font-weight: 400;
        font-size: 24rpx;
        line-height: 100%;
        letter-spacing: 0%;
        margin-bottom: 12rpx;
        width: 100%;
        text-align: right;
      }
      .message-text {
        font-size: 32rpx;
        background: #fd953c;
        padding: 20rpx 24rpx;
        border-radius: 16rpx 16rpx 0 16rpx;
        color: #fff;
        text-align: left;
        max-width: 100%;
        word-break: break-word;
      }
    }

    .message_ai {
      display: flex;
      align-items: center;
      .left-avatar {
        margin-right: 10rpx;
      }
      .right-content {
        border-radius: 8rpx;
        padding: 10rpx;
        .nmae {
          font-family: PingFang SC;
          font-weight: 400;
          font-size: 32rpx;
          line-height: 100%;
          letter-spacing: 0px;
        }
        .time {
          color: #8f9295;
          font-family: PingFang SC;
          font-weight: 400;
          font-size: 24rpx;
          line-height: 100%;
          letter-spacing: 0%;
        }
      }
    }
    .ai_concatTxt {
      position: relative;
      display: inline-block;
      word-break: break-word;
    }

    .ai_btn_box {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-radius: 12rpx;
      margin-top: 10rpx;
      width: 148rpx;
      .line {
        width: 1rpx;
        height: 48rpx;
        background-color: #e5e5e5;
      }
      img {
        padding: 8rpx 12rpx;
      }
    }
  }
}

.footer_btn {
  position: fixed;
  z-index: 11000;
  bottom: 208rpx;
  width: 100%;
  // margin: 0 20rpx;
  padding: 20rpx;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  background: #f0f3f5;

  /* #ifdef MP-WEIXIN */
  bottom: calc(202rpx + constant(safe-area-inset-bottom));
  bottom: calc(202rpx + env(safe-area-inset-bottom));
  /* #endif */
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    width: 210rpx;
    padding: 16rpx 0;
    background: #fff;
    border-radius: 32rpx;
    text-align: center;
  }
}

.voice_keyboard {
  position: fixed;
  z-index: 11000;
  bottom: 100rpx;
  left: 0;
  right: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx 34rpx;
  background-color: #fff;
  height: 110rpx;
  border-bottom: 1rpx solid #efefef;
  /* #ifdef MP-WEIXIN */
  bottom: calc(94rpx + constant(safe-area-inset-bottom));
  bottom: calc(94rpx + env(safe-area-inset-bottom));
  /* #endif */
}

::v-deep .tabbar {
  box-shadow: none !important;
}

@keyframes loading {
  0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
  100% {
    content: '.';
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotating 1s linear infinite;
}

::v-deep .loading {
  background: #fff;
  font-size: 32rpx;
  padding: 20rpx 50rpx 20rpx 24rpx;
  border-radius: 16rpx 16rpx 16rpx 0;
  display: inline-block;
  max-width: 100%;
  word-break: break-word;
  &::after {
    content: '...';
    position: absolute;
    animation: loading 1.5s infinite;
  }
}
</style>
