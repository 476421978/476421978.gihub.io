### vue3 + setup + ts 对 Element-plus 的 upload 上传 word 文件解析成内容展示

| 工具 |   版本   |
| ---- | :------: |
| node | v16.20.2 |
| npm  |  8.19.4  |
| yarn | 1.22.19  |

安装

```
npm install mammoth
```

::: danger
报错信息
npm install --save uuid@latest 报错 ```npm WARN deprecated uuid@3.4.0: Please upgrade to version 7 or higher. Older versions may use Math.random() in certain circumstances, which is known to be problematic. See https://v8.dev/blog/math-random for details.
npm ERR! Cannot read properties of null (reading 'pickAlgorithm')

npm ERR! A complete log of this run can be found in:
npm ERR! C:\Users\HLG\AppData\Local\npm-cache_logs\2023-12-19T07_26_56_616Z-debug-0.log```
:::

更新 uuid

```
yarn add uuid@latest
```

重新安装

```
yarn add mammoth -d
```

:::demo

```vue
<template>
  <div>
    <el-descriptions title="DEMO" direction="vertical" :column="2" border>
      <el-descriptions-item label="上传文件" :span="2">
        <el-upload class="upload-demo" action="/upload" :on-change="onUploadChange" :before-upload="beforeUpload" :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-descriptions-item>

      <el-descriptions-item label="识别内容" :span="2">
        <div v-html="contentVal" />
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import mammoth from 'mammoth'
import { ref } from 'vue'
const fileList = ref([])
const contentVal = ref('')

const onUploadChange = function (file, fileList) {
  const _file = file.raw
  let blob = new Blob([_file], { type: 'docx' })
  const reader = new FileReader()
  reader.onload = function (loadEvent) {
    const arrayBuffer = loadEvent.target.result
    mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(function (resultObject) {
      contentVal.value = resultObject.value
    })
  }
  reader.readAsArrayBuffer(blob)
}

// 上传前的判断
const beforeUpload = function (file: any) {
  const reg = /^.*.(?:doc|docx)$/i //文件名可以带空格
  if (!reg.test(file.name)) {
    ElMessage.error('请选择正确的文件')
    return false
  }
  // const size = file.size / 1024 / 1024
  // if (size > 1) {
  //   this.errMessageToast('超出文件最大限制1M')
  //   return false
  // }
}
</script>

<style lang="scss" scoped></style>
```

:::
