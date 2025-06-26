  
<template>
  <div class="pdf-div">
    <vue-office-pdf :src="PdfPath" @rendered="renderedHandler" @error="errorHandler" />
  </div>
</template>
<script setup>
import VueOfficePdf from '@vue-office/pdf'
import PdfPath from '@/assets/pdf/test.pdf'

function renderedHandler() {
  console.log('渲染完成')
}

function errorHandler() {
  console.log('渲染失败')
}
</script>

<style>
#app {
  max-width: auto !important;
  margin: 0 !important;
  padding: 0 !important;
}
</style>

<style lang="scss" scoped>
.pdf-div {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
}
</style>
