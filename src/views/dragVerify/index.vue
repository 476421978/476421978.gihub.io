<template>
  <div v-if="visible" class="com_drag_verify" :style="comDragVerifyStyle" @touchmove.prevent>
    <div
      class="drag_verify"
      ref="dragVerifyRef"
      :style="dragVerifyStyle"
      @touchmove="dragMoving"
      @touchend="dragFinish"
      @mousemove="dragMoving"
      @mouseup="dragFinish"
    >
      <div class="dv_progress_bar" ref="progressBar" :style="progressBarStyle"></div>
      <div class="dv_text" :style="textStyle" ref="message">{{ message }}</div>
      <div class="dv_handler" ref="handler" style="left: 0" @mousedown="dragStart" @touchstart="dragStart">
        <slot name="icon">
          <i :class="['dv_handler_icon', handlerIconClass]" />
        </slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dragVerify',
  props: {
    cWidth: {
      // 组件宽度
      type: [Number, String],
      default: 500
    },
    cHeight: {
      // 组件高度
      type: [Number, String],
      default: 44
    },
    isCircle: {
      // 是否开启圆角
      type: Boolean,
      default: false
    },
    isAnima: {
      // 是否开启动画
      type: Boolean,
      default: true
    },
    text: {
      // 背景文案
      type: String,
      default: '向右拖动验证'
    },
    successText: {
      // 验证通过文案
      type: String,
      default: '验证通过'
    },
    background: {
      // 背景文案-背景色
      type: String,
      default: '#eeeeee'
    },
    progressBarBg: {
      // 滑动覆盖-背景色
      type: String,
      default: '#FFEFC9'
    },
    handlerBg: {
      // 可移动块-背景色
      type: String,
      default: '#ff9f14'
    },
    // 默认base64图片
    handlerIcon: {
      type: String,
      default: 'drag-icon'
    },
    successIcon: {
      type: String,
      default: 'drag-success-icon'
    }
  },
  computed: {
    getHandleWidth() {
      return Number((this.$refs.handler && this.$refs.handler.style.width.replace('px', '')) || this.cWidth / 10)
    },
    comDragVerifyStyle() {
      return {
        height: this.cHeight + 'px',
        width: this.cWidth + 'px'
      }
    },
    getBorderRadius() {
      return this.isCircle ? this.cHeight / 2 + 'px' : 0
    },
    message() {
      return this.isPassing ? this.successText : this.text
    },
    dragVerifyStyle() {
      return {
        width: '100%',
        height: this.cHeight + 'px',
        lineHeight: this.cHeight + 'px',
        background: this.background,
        borderRadius: this.getBorderRadius
      }
    },
    progressBarStyle() {
      return {
        background: this.progressBarBg,
        height: this.cHeight + 'px',
        borderRadius: this.getBorderRadius
      }
    },
    textStyle() {
      return {
        width: '100%',
        color: this.isPassing ? '#FF9F14' : '#333'
      }
    },
    handlerIconClass() {
      return this.isPassing ? this.successIcon : this.handlerIcon
    },
    // 可移动距离
    getDistance() {
      return Number(this.cWidth - this.getHandleWidth) || 0
    }
  },
  data() {
    return {
      visible: false, // 显示-隐藏
      x: 0, // 鼠标点击组件距离左边的值
      isMoving: false, // 是否移动
      isPassing: false // 是否通过
    }
  },
  mounted: function () {
    this.onShow()
  },
  methods: {
    onShow() {
      this.visible = true
      this.$nextTick(() => {
        this.init()
      })
    },
    onClose() {
      this.visible = false
    },
    initHandleStyle(width) {
      const handler = this.$refs.handler
      handler.style.width = width / 10 + 'px'
      handler.style.borderRadius = this.getBorderRadius
      handler.style.backgroundColor = this.handlerBg
    },

    init: function () {
      this.initHandleStyle(this.$refs.dragVerifyRef.clientWidth)
    },
    dragStart: function (e) {
      this.isMoving = true
      this.isPassing = false
      let handler = this.$refs.handler
      this.x = (e.pageX || e.touches[0].pageX) - parseInt(handler.style.left.replace('px', ''), 10)
    },
    dragMoving: function (e) {
      if (this.isMoving) {
        let _x = (e.pageX || e.touches[0].pageX) - this.x
        let { handler, progressBar } = this.$refs
        if (_x < this.getDistance) {
          handler.style.left = `${_x}px`
          progressBar.style.width = `${_x + this.getHandleWidth}px`
        }
      }
    },
    dragFinish: function (e) {
      if (this.isMoving && !this.isPassing) {
        let _x = (e.pageX || e.changedTouches[0].pageX) - this.x
        if (_x >= this.getDistance) {
          this.isPassing = true
          setTimeout(
            () => {
              this.onReset()
            },
            this.isAnima ? 1000 : 0
          )

          this.$emit('drag-event', true)
        } else {
          this.onReset()
          this.$emit('drag-event', false)
        }
      }
    },
    onReset() {
      if (this.visible) {
        const { handler, progressBar } = this.$refs
        handler.style.transition = `left .3s ease-out`
        progressBar.style.transition = `width .3s ease-out`
        handler.style.left = '0px'
        progressBar.style.width = `${this.getHandleWidth}px`
        setTimeout(
          () => {
            handler.style.transition = ''
            progressBar.style.transition = ''
          },
          this.isAnima ? 300 : 0
        )

        this.isPassing = false
        this.isMoving = false
      }
    }
  }
}
</script>

<style scoped>
.com_drag_verify .drag_verify {
  position: relative;
  background-color: #e8e8e8;
  text-align: center;
  margin-top: 20px;
}

.com_drag_verify .drag_verify .dv_handler {
  position: absolute;
  top: 0;
  cursor: move;
  background: #ff9f14;
}

.com_drag_verify .drag_verify .dv_progress_bar {
  position: absolute;
  width: 0px;
}

.com_drag_verify .drag_verify .dv_text {
  position: absolute;
  top: 0px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  user-select: none;
}

.com_drag_verify .drag_verify .dv_handler_icon {
  display: inline-block;
  width: 16px;
  height: 16px;
}

.drag-icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABFdJREFUWEftl99Pm1UYx7/PaTsaGW0i/gEs1hGLlPacEBKjwjTL4m68MPHS6BI3HQubP+YcuixzOklcHExQg8vUe+Pl/K24TRPSvu0LSCPaeGt2MbOCSLW872Me8pa8YqEtM8ELz13Tc57n83yfH+e8xAwiAmOLFm05wBYFvuqW/geopoDW+hEiegHAV6VS6czs7Oyva/e1tbWFW1tbDwDYB+BCsVgcLxQKfzSqaNUUGGM+A7AbwDIzX3Rd95ht2zf8xhOJxI5QKPQhAM3MvwE4TUTnLMsqNwJRFUBr/QQRvQ4g6kG8R0RHLcsqVowbY24BcAyAKLVNIIjoFICRRiCqAsTj8W3hcPgxDyICQKK6sLS09Hw+n5doV1Z7e3tLc3OzOO0nohUIAMdLpdJ4Pp//sx4lNuqCoDGmH8DLAARCDL5TLBZPFAqF+YrxeDy+PRwOnyWix0UJAKLSIIB361FiwzY0xoSY+QARvVqBYOYxkdqfjp6ensjy8vJpAAcBBAEI4PGWlpbxiYmJ5Y2UqDkH+vr6ggsLC/sBvCYQzCxKjC8uLg7Ozc0trFHiFSISCAG/QUQnLcsaA+CsB1ETQA6KEgCeZOYzRLSdmaXd3p6fnz/pT0csFotEo9EhZt5HRE0ApH1fKhaLF9dr0boABCIWizVFo9FDAE543VEC8FYwGDw1OTm5WhMdHR23NjU1iVpSxFIT15l5sFQqvV+tMOsGqEBEIpEBInrRg1gEMOo4zpB/TngQopYMKVHvGjMPZbPZ4bWpaAjAB/EoEUmUrQB+B3C/ZVmTfuMCEQ6HjzLz0146rluWddtNA4iB7u7upOu6HwHYIb9d1+3N5XKX1xgnY8xDAD7wOqhsWZak5G+rYQU6Ozs7Q6HQKIB7iEgBmHEc52Hbtn/yW04mk3uVUiNEdDsgjx66nMlkem8KwBjTyczi/N6VZxTztOu6/bZtfwesvqoomUw+qJQaJqI7mNklokvlcvm56enpuU0DpFKpLqXUKDPf7UU+7TjOQdu2v/UZDWit9wJ4g4hiXv9/opQaSKfTP1ebBXWlQGudAHAewH2ipUQeCASeSqfTEnllBZLJ5J5AIHAOwE6JHMCn5XL50MzMTFXncrAmgNb6TiIaY+Y+ce7lfMC27W/8sqdSqQeUUjL1Vp07jnNkamrqx02PYsk5gGFx7hXSLDMfzmazX/uda633ENFZAB1e5F8Q0WHLsn6odSOuq0AikbgrFAqdZ+ZeyTkzTzHzQC6Xuyqd5xlWWuvdRDQit7PknJk/dhzn2VqRV8CqAqRSqbhS6k1m3uXJ/r3rukdyudyX/oiMMbvkTqg4ByD/1xX5hgDGmCvS57KJmQuu60q1f+533tXVtTMYDMowEtnlw+aKUmp/JpP5R6s1XANa62sA5Mn1C4BnstnsJZ/sK/aMMT0iNxEFmVkUEki7Vs43PQcaNVzv/pptWK+hze7bUoCV79LNkv8b5/4TAH8BVSHlLXXBDSwAAAAASUVORK5CYII=');
  background-repeat: no-repeat;
  background-size: contain;
}

.drag-success-icon {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoFJREFUWEftl71r1GAcx7/ftFRF1H+hlMuTUhAFSUDQtpZKoU5SB53EQRzESSiC4AsIWnASRSfp6OJQRKiKi069a+G0KE1yd4aqKCJocei9JT9J73qm9u3uvPYcmi15Xj6f38uTEIqAJARNuth0gSYFXsFyS2ArA5uRAUO37gvkJDXesu34SJS54U2olDVK4HQZWrCdeNumCRi6+RDkmQpQ8Nx24wObImDo1gMQ5xZhAkyQc0dt2/614QJKmXcJno+AJgtFvz+TmZr7u+ca3gNKt+6QuBCJPJnP5494XvLnSg3fUAGlzNsEL/4ByfR8NtszOzv9Y7XTtkSgs31/e9DadlYoz1w38aqWI2ro1giI4UrkgvfZ3PyhteDh3CUCSrfekegKBwTBKceZfFSNhKFbN0BcjkQ+IwgOO87U9/XWLxVQZppgx+KiQHjCdScer7WJUtY1Alej8KKf60mn335bD74sA50dB/YGrS2vCexZyILApwRDdmpybKXNVMy8Qo3XI+fczRWk2/MSX6uBLxMIHyhl7SMQ1n/34tvLD2QolUo8iW6qlHmJ4M1IzVNgrtdx3nyuFr6iQEnCNAm+BLCrvFkWvhy304nx8N7QrWEQlXe6QDK+j950OvGxFviqAuFAZ8w6KJq8ALizXI55TYLBAOyixnsR0Afm830zXtKrFb6mQDio62Y3wXESO0onA1mItJHUyjDPD/z+VGoqXQ98XYGFdBtWnwR4SmJ7FCKCT0U/35fJJN164VUJhJNiMWugRZMxgNtKMPlSKLI3k4k7/wKvWqBUDuuYRhkVwVzR52Aj4DUJ/Gukq61v6MeoHsktgaZmYOG/tJ66NWrNfyHwG19q8B69a3bEAAAAAElFTkSuQmCC');
  background-repeat: no-repeat;
  background-size: contain;
}
</style>
