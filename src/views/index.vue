<template>
  <div class="chat-container">
    <button @click="downloadFile">下载</button>

    <!-- <button @click="downloadFile('/api/download', {}, 'name')">下载2</button> -->
  </div>
</template>

<script>
export default {
  name: 'Chat',
  data() {
    return {}
  },
  methods: {
    downloadFile() {
      // 定义文件的 URL
      const fileUrl = 'https://imgtool.net/cdn/image/2023/20230401_1.jpg'

      // 创建一个 a 标签
      const aTag = document.createElement('a')

      // 设置 a 标签的属性
      aTag.href = fileUrl // 设置文件的 URL
      aTag.download = '20230401_1.jpg' // 设置下载时的文件名

      // 将 a 标签添加到文档中
      document.body.appendChild(aTag)

      // 触发点击事件，开始下载
      aTag.click()

      // 下载完成后移除 a 标签，避免内存泄漏
      document.body.removeChild(aTag)
    }
  }
}
</script>

<style scoped></style>
