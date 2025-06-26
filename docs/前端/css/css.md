## 1、flex 实现九宫格布局

`flex: 0 0 calc(20% - 10px);`

- flex-grow: 0：指定弹性盒项不会放大，即不会占据额外的空间。
- flex-shrink: 0：指定弹性盒项不会缩小，即不会缩小占据的空间。
- flex-basis: calc(20% - 10px)：指定弹性盒项的初始大小。在这里，使用 calc() 函数来计算初始大小，该计算结果为占据父元素宽度的 20% 减去 10 像素的宽度。

## 2、水平居中/垂直居中/水平垂直居中

- position： `transform: translate(-50%, -50%)`

- flex: `justify-content: center; align-items: center;`

## 3、画一条 0.5px 的直线

:::demo

```vue
<template>
  <div>
    <span>1px</span>
    <div class="line"></div>
    <br />
    <span>svg实现0.5px</span>
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="1px">
      <line x1="0" y1="0" x2="100%" y2="0" stroke="#000"></line>
    </svg>
    <br />
    <div class="half-1px-line">单线</div>
    <br />
    <div class="half-1px-border">四周0.5px</div>
  </div>
</template>
<script>
export default {}
</script>

<style lang="scss" scoped>
.line {
  width: 100%;
  height: 1px;
  background: black;
}

.half-1px-line,
.half-1px-border {
  position: relative;
}
.half-1px-line::after,
.half-1px-border::after {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  top: 0;
  left: 0;
  transform-origin: 0 0;
  border-width: 1px;
  border-style: solid;
  transform: scale(0.5, 0.5);
  box-sizing: border-box;
  pointer-events: none;
}
.half-1px-line::after {
  border-width: 0;
  border-bottom-width: 1px;
}
</style>
```

:::

## 4、穿透样式总结

- css可以使用>>>，/deep/，::v-deep
- less和node-sass可以使用/deep/，::v-deep
- dart-sass可以使用::v-deep
- vue2.7以上版本以及包括vue3，应该使用:deep()
