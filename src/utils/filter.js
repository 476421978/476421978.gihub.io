// chrome浏览器其实提供了一个Idle DetectionAPI，来实现网页空闲状态的检测，但是这个API还是一个实验性特性，并且Firefox与Safari不支持。API参考

/**
 * 网页空闲检测
 * @param {() => void} callback 空闲时执行，即一定时长无操作时触发
 * @param {number} [timeout=15] 时长，默认15s，单位：秒
 * @param {boolean} [immediate=false] 是否立即开始，默认 false
 * @returns
 */
function onIdleDetection(callback, timeout = 15, immediate = false) {
  let pageTimer
  let beginTime = 0
  const onClearTimer = () => {
    pageTimer && clearTimeout(pageTimer)
    pageTimer = undefined
  }
  const onStartTimer = () => {
    const currentTime = Date.now()
    if (pageTimer && currentTime - beginTime < 100) {
      return
    }

    onClearTimer()
    beginTime = currentTime
    pageTimer = setTimeout(() => {
      callback()
    }, timeout * 1000)
  }

  const onPageVisibility = () => {
    // 页面显示状态改变时，移除延时器
    onClearTimer()

    if (document.visibilityState === 'visible') {
      const currentTime = Date.now()
      // 页面显示时，计算时间，如果超出限制时间则直接执行回调函数
      if (currentTime - beginTime >= timeout * 1000) {
        callback()
        return
      }
      // 继续计时
      pageTimer = setTimeout(
        () => {
          callback()
        },
        timeout * 1000 - (currentTime - beginTime)
      )
    }
  }

  const startDetection = () => {
    onStartTimer()
    document.addEventListener('keydown', onStartTimer)
    document.addEventListener('mousemove', onStartTimer)
    document.addEventListener('visibilitychange', onPageVisibility)
  }

  const stopDetection = () => {
    onClearTimer()
    document.removeEventListener('keydown', onStartTimer)
    document.removeEventListener('mousemove', onStartTimer)
    document.removeEventListener('visibilitychange', onPageVisibility)
  }

  const restartDetection = () => {
    onClearTimer()
    onStartTimer()
  }

  if (immediate) {
    startDetection()
  }

  return {
    startDetection,
    stopDetection,
    restartDetection
  }
}
