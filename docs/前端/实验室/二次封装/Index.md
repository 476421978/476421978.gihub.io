### vue3 + setup + ts 对 Element-plus 的 form 表单二次封装

:::demo

```vue
<template>
  <div>
    <sub-search ref="TSearchRef" @on-submit-success="onSubmitSuccess">
      <template v-slot:submit-btn>
        <el-col :span="24" style="display: flex; justify-content: center">
          <el-form-item>
            <el-button type="primary" @click="submitForm">查询</el-button>
            <el-button @click="onReset">重置</el-button>
          </el-form-item>
        </el-col>
      </template>
    </sub-search>

    <div>
      {{ formResult }}
    </div>
  </div>
</template>

<script setup lang="ts">
import subSearch from '@/components/sub-search/index.vue'
import { ref } from 'vue'

const TSearchRef = ref<any>(null)

//  查询
const formResult = ref()
const submitForm = async function () {
  const { formRef, submitForm } = TSearchRef.value
  submitForm(formRef)
}
//  重置
const onReset = function () {
  const { onReset } = TSearchRef.value
  onReset()
}

// 通过
const onSubmitSuccess = function (val: any) {
  formResult.value = val
}
</script>
```

:::

<<< @/../mock/user/index.ts
