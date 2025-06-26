:::demo
```vue
<template>
  <div>
    <div id="capture" style="padding: 10px; background: #f5da55">
      <h4 style="color: #000">Hello world!</h4>
    </div>
    <el-button type="primary" style="margin-top: 10px;"  @click="htmlPdf">生成pdf</el-button> 
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
// 写一个基本html页面
// 创建jspdf实例
// 获取页面的dom节点，使用html2canvas将其转化为base64数据流
// 将base64数据流装载到jspdf提供的addImage方法中
// 保存pdf
export default {
  methods: {
    htmlPdf() {
      html2canvas(document.querySelector('#capture')).then((canvas) => {
        // 获取canvas转化后的宽高
        const { width: canvasWidth, height: canvasHeight } = canvas
        // 转化成图片Data
        const canvasData = canvas.toDataURL('image/png', 1.0)
        const doc = new jsPDF()
        doc.addImage(canvasData, 'png', 0, 0, 10, 10)
        doc.save('output.pdf')
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>

```
:::