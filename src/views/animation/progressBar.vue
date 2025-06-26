<template>
  <div class="content">
    <div class="circle-box">
      <div class="circle a">
        <div class="txt">{{ getProcess }}%</div>
      </div>
      <div class="circle b" :style="{ transform: `rotate(${fillProcess}deg)` }"></div>
      <div class="mark"></div>
    </div>
  </div>
</template>

<script setup>
const ROTATE = 180
const fillProcess = ref(0)
const fillAction = ref(null)

const getProcess = computed(() => {
  return ((fillProcess.value / ROTATE) * 100).toFixed(0)
})

const start = () => {
  fillAction.value = setInterval(() => {
    const str = Math.floor(Math.random() * 10) + 1
    if (str + fillProcess.value >= ROTATE) {
      fillProcess.value = ROTATE
    } else if (fillProcess.value >= ROTATE) {
      stop()
    } else {
      fillProcess.value += str
    }
  }, 200)
}

const stop = () => {
  clearInterval(fillAction.value)
}

onMounted(() => {
  start()
})

onUnmounted(() => {
  stop()
})
</script>

<style lang="scss" scoped>
.circle-box {
  position: relative;
  width: 200px;
  height: 200px;
}

.circle {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  clip-path: inset(0 0 50% 0);
  box-sizing: border-box;
}
.a {
  border: 10px solid #ccc;
  transform: rotate(180deg);
}
.b {
  border: 10px solid green;
  position: relative;
  &::after {
    position: absolute;
    transform: rotate(180deg);
    left: 90%;
    bottom: 50%;
    content: '';
    width: 10px;
    height: 10px;
    background: red;
  }
}

.txt {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%) rotate(180deg);
}

.mark {
  position: absolute;
  left: -5%;
  top: 0;
  width: 110%;
  height: 50%;
  background-color: white;
}
</style>
