<template>
  <div class="content">
    <div id="container">{{ a?.b?.c }}</div>
  </div>
</template>

<script setup>
const a = reactive({
  b: {
    c: 1
  }
})
onMounted(() => {
  console.log()
})
</script>

<style lang="scss" scoped></style>
