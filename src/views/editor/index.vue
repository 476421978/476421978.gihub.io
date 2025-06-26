<template>
  <div>
    <el-upload class="upload-demo" action="/upload" :on-change="onUploadChange" :limit="1" :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <div v-html="contentVal" />
  </div>
</template>

<script setup lang="ts">
import { UploadFiles } from 'element-plus'
import mammoth from 'mammoth'
const fileList = ref([])
const contentVal = ref('')

const onUploadChange = function (file: any, fileList: UploadFiles) {
  const _file = file.raw
  let blob = new Blob([_file], { type: 'docx' })
  const reader = new FileReader()
  reader.onload = function (loadEvent: any) {
    const arrayBuffer = loadEvent.target.result
    mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(function (resultObject: any) {
      contentVal.value = resultObject.value
    })
  }
  reader.readAsArrayBuffer(blob)
}
</script>

<style lang="scss" scoped></style>
