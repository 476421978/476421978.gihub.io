---
layout: page
---

<script setup>
import { ref } from 'vue'
import VueOfficePdf from '@vue-office/pdf'
import PdfPath from '@/assets/pdf/personage.pdf'

// 导出本地模板
function onDownloadExcel() {
  var downloadLink = document.createElement('a')
  downloadLink.style.display = 'none' // 使其隐藏
  downloadLink.href = PdfPath
  // 设置下载文件的名称（可选）
  downloadLink.download = '前端开发工程师.pdf'
  // 添加下载链接到页面
  document.body.appendChild(downloadLink)
  // 触发点击事件以下载文件
  downloadLink.click()
  // 下载完成后移除下载链接
  document.body.removeChild(downloadLink)
}
</script>

<div style="text-align:center;">
  <vue-office-pdf :src="PdfPath"  />
  <!-- <el-button  @click="onDownloadExcel" type="primary" style="margin:20px 0;cursor: pointer;">下载到本地</el-button> -->
</div>

<style module>
</style>
