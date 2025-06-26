## 1、双向绑定的理解

```vue
<!-- 父组件 -->
<template>
  <Child v-model="value" />
</template>
<script>
export default {
  data() {
    return {
      value: ''
    }
  }
}
</script>

<!-- 子组件 -->
<template>
  <input v-model="input" />
</template>
<script>
export default {
  props: {
    value: String
  },
  model: {
    prop: 'value', // 指定 v-model 要绑定的参数叫什么名字，来自于 props 中定义的参数
    event: 'change' // 指定要触发的事件名字，将被用于 $emit
  },
  computed: {
    input: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val) // 触发
      }
    }
  }
}
</script>
```

<img src="/前端/vue2/1.png" />

<img src="/前端/vue2/2.png" />

vue2.3 之后增加 sync

- sync 和子组件配合 v-model 使用 computed 的 get set 方法
- 父组件：v-bind:xxx.sync="xxx"
- 子组件：props 接收，computed 重定义 get、set
- get()方法返回 props 的值（避免子组件直接改变值报错）
- set(val)方法里主动触发更新 this.$emit('update:xxx', val)

## 2、数据更新的踩坑

```js
tableData: {
  list: []
}
```

1、vue@2.5.2
this.$set(this.$data, 'tableData', result)

2、vue@2.6 以上list是不会触发更新的
this.$set(this.$data, 'tableData', result)

## 3、html直接页面导出Pdf文件

- 写一个基本html页面
- 创建jspdf实例
- 获取页面的dom节点，使用html2canvas将其转化为base64数据流
- 将base64数据流装载到jspdf提供的addImage方法中
- 保存pdf

::: demo

```vue
<template>
  <div>
    <div id="capture" style="padding: 10px; background: #f5da55">
      <h4 style="color: #000">Hello world!</h4>
      <button @click="htmlPdf">导出</button>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
export default {
  methods: {
    htmlPdf() {
      html2canvas(document.querySelector('#capture')).then((canvas) => {
        // document.body.appendChild(canvas)
        // 获取canvas转化后的宽高
        const { width: canvasWidth, height: canvasHeight } = canvas
        // 转化成图片Data
        const canvasData = canvas.toDataURL('image/png', 1.0)
        const doc = new jsPDF()
        doc.addImage(canvasData, 'png', 0, 0, 10, 10)
        // doc.addImage(canvasData, format, x, y, width, height, alias, compression)
        doc.save('output.pdf')
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
```

:::
