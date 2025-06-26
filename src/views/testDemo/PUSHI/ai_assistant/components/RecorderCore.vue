<template>
  <view class="record-container">
    <view class="record-status" v-if="isRecording || isWaiting">
      <view class="wave-animation" v-if="isRecording">
        <view class="wave-dot"></view>
        <view class="wave-dot"></view>
        <view class="wave-dot"></view>
        <view class="wave-dot"></view>
        <view class="wave-dot"></view>
        <view class="wave-dot"></view>
      </view>
      <text class="status-text">{{ buttonText }}</text>
    </view>
    <view
      class="record-btn"
      :class="{
        recording: isRecording,
        waiting: isWaiting
      }"
      @touchstart="startRecording"
      @touchend="stopRecording"
      @touchmove="handleTouchMove"
    >
      <text v-if="!(isRecording || isWaiting)">按住说话</text>
    </view>
  </view>
</template>

<script>
// #ifdef H5
import Recorder from '../../../uni_modules/recorder/recorder.wav.min'
// #endif

export default {
  name: 'RecorderCore',
  data() {
    return {
      isRecording: false,
      isWaiting: false,
      // #ifdef MP-WEIXIN || MP-ALIPAY
      recorderManager: null,
      // #endif
      // #ifdef H5
      recorder: null,
      // #endif
      touchStartY: 0,
      touchEndY: 0
    }
  },
  computed: {
    buttonText() {
      if (this.isRecording) return '松开发送'
      if (this.isWaiting) return '准备录音'
      return ''
    }
  },
  created() {
    // #ifdef MP-WEIXIN || MP-ALIPAY
    this.recorderManager = uni.getRecorderManager()
    this.recorderManager.onStop((res) => {
      this.isRecording = false
      this.isWaiting = false
      this.$emit('recordEnd', res.tempFilePath)
    })
    // #endif

    // #ifdef H5
    this.recorder = new Recorder({
      type: 'wav',
      sampleRate: 16000,
      bitRate: 16,
      onProcess: (buffers, powerLevel, duration, sampleRate) => {
        // 录音实时回调，可以在这里处理音量显示等
        console.log('录音中:', duration, '秒')
      }
    })
    // #endif
  },
  methods: {
    async startRecording(e) {
      this.isWaiting = true
      this.touchStartY = e.touches[0].pageY
      this.touchEndY = e.touches[0].pageY

      // #ifdef H5
      try {
        await this.recorder.open(
          () => {
            setTimeout(() => {
              if (this.isWaiting) {
                this.isWaiting = false
                this.isRecording = true
                this.recorder.start()
              }
            }, 500)
          },
          (msg, isUserNotAllow) => {
            const errMsg = (isUserNotAllow ? '用户拒绝授权,' : '') + '无法录音:' + msg
            console.log(errMsg)
            uni.$u.toast(errMsg)
            this.isWaiting = false
          }
        )
      } catch (error) {
        console.error('录音初始化失败:', error)
        uni.$u.toast(error)
        this.isWaiting = false
      }
      // #endif

      // #ifdef MP-WEIXIN || MP-ALIPAY
      // 检查授权
      const getAuthorized = await uni.getAppAuthorizeSetting().microphoneAuthorized
      const systemInfo = await uni.getAppBaseInfo()
      if (systemInfo.platform === 'ios') {
        if (getAuthorized === 'denied') {
          return uni.showModal({
            title: '提示',
            content: '是否要开启麦克风权限？',
            success(res) {
              if (res.confirm) {
                uni.openAppAuthorizeSetting()
              }
            }
          })
        }
      } else if (getAuthorized !== 'authorized') {
        return uni.showToast({
          icon: 'none',
          duration: 3000,
          title: '请允许使用或在系统设置中打开麦克风权限'
        })
      }

      setTimeout(() => {
        if (this.isWaiting) {
          this.isWaiting = false
          this.isRecording = true
          this.recorderManager.start({
            duration: 60000,
            sampleRate: 16000,
            numberOfChannels: 1,
            encodeBitRate: 48000,
            format: 'wav',
            frameSize: 1
          })
        }
      }, 500)
      // #endif
    },
    handleTouchMove(e) {
      if (this.isRecording) {
        this.touchEndY = e.touches[0].pageY
        if (this.touchStartY - this.touchEndY > 80) {
          this.stopRecording()
        }
      }
    },
    stopRecording() {
      if (this.isRecording) {
        // #ifdef H5
        this.recorder.stop(
          (blob, duration) => {
            const url = URL.createObjectURL(blob)
            this.isRecording = false
            this.isWaiting = false
            this.$emit('recordEnd', url)
          },
          (msg) => {
            console.error('录音失败:', msg)
            this.isRecording = false
            this.isWaiting = false
          }
        )
        // #endif

        // #ifdef MP-WEIXIN || MP-ALIPAY
        this.recorderManager.stop()
        // #endif
      } else {
        this.isWaiting = false
      }
    }
  },
  beforeDestroy() {
    // #ifdef H5
    if (this.recorder) {
      this.recorder.close()
    }
    // #endif
  }
}
</script>

<style lang="scss" scoped>
.record-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20rpx 0;
  position: relative;
}

.record-status {
  position: fixed;
  z-index: 999;
  left: 0;
  width: 100vw;
  bottom: 172rpx;
  /* #ifdef MP-WEIXIN */
  bottom: calc(172rpx + constant(safe-area-inset-bottom));
  bottom: calc(172rpx + env(safe-area-inset-bottom));
  /* #endif */
  padding: 40rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20rpx;
  background: #fff;
  box-sizing: content-box;
}

.status-text {
  font-size: 24rpx;
  color: #8f9295;
}

.wave-animation {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;

  .wave-dot {
    width: 12rpx;
    height: 12rpx;
    background: #fd953c;
    border-radius: 50%;
    margin: 0 6rpx;
    animation: wave 1s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
    &:nth-child(4) {
      animation-delay: 0.6s;
    }
    &:nth-child(5) {
      animation-delay: 0.8s;
    }
    &:nth-child(6) {
      animation-delay: 1s;
    }
  }
}

.record-btn {
  width: 100%;
  height: 70rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f3f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  color: #8f9295;
  transition: all 0.3s ease;

  &.waiting {
    background: #e0e3e5;
    color: #666;
  }

  &.recording {
    background: #fd953c;
    color: #fff;
  }
}

@keyframes wave {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(2);
    opacity: 1;
  }
}
</style>
