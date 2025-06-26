---
layout: page
---

:::demo

```vue
<template>
  <div id="CapacityMonitoringCenter" ref="CMCRef" class="com-echart-ui">
    <div class="title-box">
      <div class="flex justify-center align-center">
        <div class="ui-title">数据展示</div>
      </div>
      <img class="screen-full-btn hover-active" src="@/assets/capaticy/full_btn.png" @click="screenFullClick" />
    </div>
    <div class="content-box flex" style="height: calc(100vh - 108px); gap: 10px">
      <!-- 左列 -->
      <div class="flex flex-column flex-main height-100" style="gap: 10px">
        <!-- 当日产量 当月产量 日目标达成率 月投入产出比 -->
        <div class="left-one-box flex flex-main" style="gap: 10px">
          <div v-for="(item, index) in leftOneData" :key="index" class="item-box flex-main">
            <div class="item-title">{{ item.name }}</div>
            <div class="item-value">{{ item.value }}</div>
          </div>
        </div>
        <!-- 产能效率 -->
        <div class="left-two-box" style="flex: 8">
          <div class="title flex justify-center align-center" style="height: 7%">滚动折线推移图</div>
          <div id="leftTwoDom" style="height: 93%; width: 100%" />
        </div>
        <!-- 设备运行状态 -->
        <div class="left-three-box" style="flex: 7">
          <div class="title flex justify-center align-center">饼图状态</div>
          <div id="leftThreeDom" style="height: 90%; width: 100%" />
        </div>
      </div>
      <!-- 中间 -->
      <div class="flex flex-column" style="gap: 10px; flex: 1.5">
        <div class="center-one-box" style="flex: 3; overflow: hidden">
          <div class="title ellipsis" style="width: 20%">数据表单</div>
          <div class="tab flex flex-column" style="height: calc(100% - 24px)">
            <table class="tab-header" style="height: auto; width: 100%; margin:0;">
              <th v-for="thTxt in tabHeadTxtOne" :key="thTxt" style="background:#000;">{{ thTxt }}</th>
            </table>
            <div style="flex: 1; overflow: hidden">
              <vue-auto-scroll :data="centerOneData" :steep="0.5" scrollDirection="top" :isRoller="true" :rollerScrollDistance="50">
                <table class="tab-content">
                  <tr v-for="(tdTxt, index) in centerOneData" :key="index" class="tr-box" style="background:#000;">
                    <td class="td-box" style="color: rgba(255, 255, 255, 0.8)">{{ tdTxt.id }}</td>
                    <td class="td-box" style="color: rgba(255, 255, 255, 0.8)">{{ tdTxt.name }}</td>
                    <td class="td-box" style="color: #66a3ff">{{ tdTxt.time }}</td>
                    <td class="td-box" style="color: #7cf6ad">{{ tdTxt.code }}</td>
                    <td class="td-box" style="color: #66a3ff">{{ tdTxt.lossNum }}</td>
                    <td class="td-box" style="color: #7cf6ad">{{ tdTxt.lossTime }}</td>
                  </tr>
                </table>
              </vue-auto-scroll>
            </div>
            <div style="height: 20px"></div>
          </div>
        </div>

        <div class="center-two-box" style="flex: 4">
          <div class="title flex justify-center align-center width-100" style="height: 10%; float: left">堆叠图1推移图</div>
          <div id="centerTwoDom" style=" width: 100%"></div>
        </div>

        <div class="center-three-box" style="flex: 3; overflow: hidden">
          <div class="title ellipsis hover-active flex justify-center align-center" style="width: 20%">
            <span class="ellipsis">数据表单中心统计</span>
            <img src="@/assets/capaticy/double_arrow.png" style="margin-left: 5px; width: 14px; height: 12px" />
          </div>
          <div class="tab flex flex-column" style="height: calc(100% - 24px)">
            <table class="tab-header" style=" width: 100%;margin:0; ">
              <th v-for="thTxt in tabHeadTxtTwo" :key="thTxt" class="ellipsis" style="background:#000;">{{ thTxt }}</th>
            </table>
            <div style="flex: 1; overflow: hidden">
              <vue-auto-scroll :data="centerOneData" :steep="0.5" scrollDirection="top" :isRoller="true" :rollerScrollDistance="50">
                <table class="tab-content">
                  <tr v-for="(tdTxt, index) in centerOneData" :key="index" class="tr-box" style="background:#000;">
                    <td class="td-box ellipsis" style="color: rgba(255, 255, 255, 0.8)">{{ tdTxt.id }}</td>
                    <td class="td-box ellipsis" style="color: #66a3ff">{{ tdTxt.name }}</td>
                    <td class="td-box ellipsis" style="color: #a484ff">{{ tdTxt.time }}</td>
                    <td class="td-box ellipsis" style="color: #66a3ff">{{ tdTxt.code }}</td>
                    <td class="td-box ellipsis" style="color: #a484ff">{{ tdTxt.lossNum }}</td>
                  </tr>
                </table>
              </vue-auto-scroll>
            </div>
            <div style="height: 20px"></div>
          </div>
        </div>
      </div>
      <!-- 右列 -->
      <div class="flex flex-column flex-main" style="gap: 10px">
        <div class="right-one-box" style="flex: 4; position: relative">
          <!-- 下拉选择框 -->
          <div class="select-time">
            <div class="title hover-active" @click="onShow('rightOneVisible')">
              <span>{{ rightOneTimeArr[rightOneTimeArrIndex].label }}</span>
              <img :class="['arrow-right', rightOneVisible ? '' : 'click-90deg']" src="@/assets/capaticy/arrow_white.png" />
            </div>
            <div v-show="rightOneVisible" class="options">
              <div
                v-for="(item, index) in rightOneTimeArr"
                :key="index"
                :class="['item-box hover-active', item.value === rightOneTimeArrIndex ? 'active' : '']"
                @click="onSelectTime('rightOneVisible', 'rightOneTimeArrIndex', item)"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="title flex justify-center align-center" style="height: 7%">滚动折线推移图</div>
          <div id="rightOneDom" style="height: 93%; width: 100%"></div>
        </div>

        <div class="right-two-box" style="flex: 5; position: relative">
          <!-- 下拉选择框 -->
          <div class="select-time">
            <div class="title hover-active" @click="onShow('rightTwoVisible')">
              <span>{{ rightTwoTimeArr[rightTwoTimeArrIndex].label }}</span>
              <img :class="['arrow-right', rightTwoVisible ? '' : 'click-90deg']" src="@/assets/capaticy/arrow_white.png" />
            </div>
            <div v-show="rightTwoVisible" class="options">
              <div
                v-for="(item, index) in rightTwoTimeArr"
                :key="index"
                :class="['item-box hover-active', item.value === rightTwoTimeArrIndex ? 'active' : '']"
                @click="onSelectTime('rightTwoVisible', 'rightTwoTimeArrIndex', item)"
              >
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="title flex justify-center align-center width-100" style="height: 7%; float: left">堆叠图2推移图</div>
          <div id="rightTwoDom" style="height: 100%; width: 100%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, nextTick, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
import VueAutoScroll from '@/views/echarts/components/scrollCom.vue'
import screenfull from 'screenfull'
import {
  leftTwoTem,
  leftThreeTem,
  centerTwoTem,
  rightOneTem,
  rightTwoTem,
  leftOneData,
  leftTwoData,
  tabHeadTxtOne,
  centerOneData,
  centerTwoData,
  tabHeadTxtTwo,
  rightOneData,
  rightOneTimeArr,
  rightTwoData,
  rightTwoTimeArr
} from '@/views/echarts/capaticy3/data'
// 图表
const leftTwoEct = ref(null)
const leftThreeEct = ref(null)
const centerTwoEct = ref(null)
const rightOneEct = ref(null)
const rightTwoEct = ref(null)

// 滚动数据
const leftTwoTime = ref(null)
const centerTwoTime = ref(null)
const rightOneTime = ref(null)
const rightTwoTime = ref(null)

const $echarts = ref(inject('$echarts'))

// 重绘
const EctList = {
  leftTwoEct,
  leftThreeEct,
  centerTwoEct,
  rightOneEct,
  rightTwoEct
}
const againInit = () => {
  const echartsArr = ['leftTwoEct', 'leftThreeEct', 'centerTwoEct', 'rightOneEct', 'rightTwoEct']
  for (let i = 0; i < echartsArr.length; i++) {
    const type = echartsArr[i]
    if (EctList[type]) {
      EctList[type].value.resize()
    }
  }
}

onMounted(() => {
  init()
  // 页面缩放 重新渲染大小
  window.addEventListener('resize', () => {
    againInit()
  })
})

onBeforeUnmount(() => {
  clearInterval(leftTwoTime)
  clearInterval(centerTwoTime)
  clearInterval(rightOneTime)
  clearInterval(rightTwoTime)
})

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    againInit()
  })
})

// 初始化
const init = () => {
  onLeftTwo()
  onLeftThree()
  onCenterTwo()
  onRightOneData()
  onRightTwoData()
}

// 渲染 start
// ---------------- 产能效率
const onLeftTwo = () => {
  try {
    leftTwoEct.value = $echarts.value.init(document.getElementById('leftTwoDom'))
    const leftTwoNames = leftTwoData.name || []
    const leftTwoValues = leftTwoData.value || []
    leftTwoTem['xAxis']['data'] = JSON.parse(JSON.stringify(leftTwoNames)).splice(0, 4)
    leftTwoTem['series'][0]['data'] = JSON.parse(JSON.stringify(leftTwoValues)).splice(0, 4)
    leftTwoEct.value.setOption(leftTwoTem)
    // 滚动数据
    if (leftTwoNames.length > 4 && leftTwoValues.length > 4) {
      let index = 4
      leftTwoTime.value = setInterval(() => {
        let nextName = leftTwoNames[index]
        let nextValue = leftTwoValues[index]

        if (!nextName || !nextValue) {
          nextName = leftTwoNames[0]
          nextValue = leftTwoValues[0]
          index = 1
        } else {
          index++
        }
        leftTwoTem['xAxis']['data'].shift()
        leftTwoTem['xAxis']['data'].push(nextName)
        leftTwoTem['series'][0]['data'].shift()
        leftTwoTem['series'][0]['data'].push(nextValue)

        leftTwoEct.value.setOption(leftTwoTem)
      }, 3000)
    }
  } catch (error) {
    console.log(error)
  }
}
// ---------------- 设备运行状态
const onLeftThree = () => {
  leftThreeEct.value = $echarts.value.init(document.getElementById('leftThreeDom'))
  leftThreeEct.value.setOption(leftThreeTem)
}
// ---------------- 良品与不良率统计
const onCenterTwo = () => {
  centerTwoEct.value = $echarts.value.init(document.getElementById('centerTwoDom'))
  // 初始化Tem
  centerTwoTem.xAxis[0]['data'] = [] // 名称
  centerTwoTem.series[0]['data'] = [] // 良品数
  centerTwoTem.series[1]['data'] = [] // 不良品数
  centerTwoTem.series[2]['data'] = [] // 废品数
  centerTwoTem.series[3]['data'] = [] // 不良率

  // 整合对应数组集合
  const nameArr = centerTwoData.map((item) => item.name).splice(0, 4)
  const lpNumArr = centerTwoData.map((item) => item.lpNum).splice(0, 4)
  const blpNumArr = centerTwoData.map((item) => item.blpNum).splice(0, 4)
  const fpNumArr = centerTwoData.map((item) => item.fpNum).splice(0, 4)
  const ratioArr = centerTwoData.map((item) => item.ratio).splice(0, 4)

  // 初始化图表数据
  centerTwoTem.xAxis[0]['data'] = nameArr // 名称
  centerTwoTem.series[0]['data'] = lpNumArr // 良品数
  centerTwoTem.series[1]['data'] = blpNumArr // 不良品数
  centerTwoTem.series[2]['data'] = fpNumArr // 废品数
  centerTwoTem.series[3]['data'] = ratioArr // 不良率

  centerTwoEct.value.setOption(centerTwoTem)

  // 滚动数据
  if (centerTwoData.length > 4) {
    // ----------- 初始化
    let index = 4
    // ----------- 定时器
    centerTwoTime.value = setInterval(() => {
      let nextObj = centerTwoData[index]
      if (!nextObj && index > 0) {
        nextObj = centerTwoData[0]
        index = 1
      } else {
        index++
      }

      centerTwoTem.xAxis[0]['data'].shift() // 名称
      centerTwoTem.xAxis[0]['data'].push(nextObj.name) // 名称

      centerTwoTem.series[0]['data'].shift() // 良品数
      centerTwoTem.series[0]['data'].push(nextObj.lpNum) // 良品数

      centerTwoTem.series[1]['data'].shift() // 不良品数
      centerTwoTem.series[1]['data'].push(nextObj.blpNum) // 不良品数

      centerTwoTem.series[2]['data'].shift() // 废品数
      centerTwoTem.series[2]['data'].push(nextObj.fpNum) // 废品数

      centerTwoTem.series[3]['data'].shift() // 不良率
      centerTwoTem.series[3]['data'].push(nextObj.ratio) // 不良率

      centerTwoEct.value.setOption(centerTwoTem)
    }, 3000)
  }
}
// ---------------- 产能效率推移图
const onRightOneData = () => {
  rightOneEct.value = $echarts.value.init(document.getElementById('rightOneDom'))
  const rightOneNames = rightOneData.name || []
  const rightOneValues = rightOneData.value || []
  rightOneTem['xAxis']['data'] = JSON.parse(JSON.stringify(rightOneNames)).splice(0, 4)
  rightOneTem['series'][0]['data'] = JSON.parse(JSON.stringify(rightOneValues)).splice(0, 4)
  rightOneEct.value.setOption(rightOneTem)

  // 滚动数据
  if (rightOneNames.length > 4 && rightOneValues.length > 4) {
    // ----------- 初始化
    let index = 4
    // ----------- 定时器
    rightOneTime.value = setInterval(() => {
      let nextName = rightOneNames[index]
      let nextValue = rightOneValues[index]
      if (!nextName || !nextValue) {
        nextName = rightOneNames[0]
        nextValue = rightOneValues[0]
        index = 1
      } else {
        index++
      }
      rightOneTem['xAxis']['data'].shift()
      rightOneTem['xAxis']['data'].push(nextName)
      rightOneTem['series'][0]['data'].shift()
      rightOneTem['series'][0]['data'].push(nextValue)
      rightOneEct.value.setOption(rightOneTem)
    }, 3000)
  }
}
// ---------------- 良品与不良率推移图
const onRightTwoData = () => {
  rightTwoEct.value = $echarts.value.init(document.getElementById('rightTwoDom'))
  // 初始化Tem
  rightTwoTem.xAxis[0]['data'] = [] // 名称
  rightTwoTem.series[0]['data'] = [] // 良品数
  rightTwoTem.series[1]['data'] = [] // 不良品数
  rightTwoTem.series[2]['data'] = [] // 废品数
  rightTwoTem.series[3]['data'] = [] // 不良率

  // 整合对应数组集合
  const nameArr = rightTwoData.map((item) => item.name).splice(0, 4)
  const lpNumArr = rightTwoData.map((item) => item.lpNum).splice(0, 4)
  const blpNumArr = rightTwoData.map((item) => item.blpNum).splice(0, 4)
  const fpNumArr = rightTwoData.map((item) => item.fpNum).splice(0, 4)
  const ratioArr = rightTwoData.map((item) => item.ratio).splice(0, 4)

  // 初始化图表数据
  rightTwoTem.xAxis[0]['data'] = nameArr // 名称
  rightTwoTem.series[0]['data'] = lpNumArr // 良品数
  rightTwoTem.series[1]['data'] = blpNumArr // 不良品数
  rightTwoTem.series[2]['data'] = fpNumArr // 废品数
  rightTwoTem.series[3]['data'] = ratioArr // 不良率
  rightTwoEct.value.setOption(rightTwoTem)

  // 滚动数据
  if (rightTwoData.length > 4) {
    // ----------- 初始化
    let index = 4
    // ----------- 定时器
    rightTwoTime.value = setInterval(() => {
      let nextObj = rightTwoData[index]
      if (!nextObj && index > 0) {
        nextObj = rightTwoData[0]
        index = 1
      } else {
        index++
      }

      rightTwoTem.xAxis[0]['data'].shift() // 名称
      rightTwoTem.xAxis[0]['data'].push(nextObj.name) // 名称

      rightTwoTem.series[0]['data'].shift() // 良品数
      rightTwoTem.series[0]['data'].push(nextObj.lpNum) // 良品数

      rightTwoTem.series[1]['data'].shift() // 不良品数
      rightTwoTem.series[1]['data'].push(nextObj.blpNum) // 不良品数

      rightTwoTem.series[2]['data'].shift() // 废品数
      rightTwoTem.series[2]['data'].push(nextObj.fpNum) // 废品数

      rightTwoTem.series[3]['data'].shift() // 不良率
      rightTwoTem.series[3]['data'].push(nextObj.ratio) // 不良率

      rightTwoEct.value.setOption(rightTwoTem)
    }, 3000)
  }
}
// 渲染 end

// 全屏
const CMCRef = ref(null)
const screenFullClick = () => {
  nextTick(() => {
    var dom = CMCRef.value
    screenfull.toggle(dom)
  })
}

const rightOneTimeArrIndex = ref(0)
const rightOneVisible = ref(false)
const rightTwoTimeArrIndex = ref(0)
const rightTwoVisible = ref(false)

const showIndex = {
  rightOneTimeArrIndex,
  rightTwoTimeArrIndex
}

// 选择日，月，年
const onSelectTime = (type, value, item) => {
  showIndex[value].value = item.value
  onShow(type)
}

const showList = {
  rightTwoVisible,
  rightOneVisible
}

// 显示隐藏下拉框
const onShow = (type) => {
  showList[type].value = !showList[type].value
}
</script>

<style lang="scss" scoped>
#app {
  margin: 0 !important;
  padding: 0 !important;
}

#CapacityMonitoringCenter {
  overflow: hidden;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}

.flex-column {
  flex-direction: column;
}

.flex-main {
  flex: 1;
}

.height-100 {
  height: 100%;
}

.width-100 {
  width: 100%;
}

// 鼠标手
.hover-active {
  &:hover {
    cursor: pointer;
  }
}

/* 单行超出隐藏 省略号 */
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 多行超出隐藏 */
.area-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

// 默认div字体颜色
div {
  color: #19ecff;
}

// 图表标题
.title {
  font-size: 14px;
  color: #00fff4;
  font-weight: 800;
  height: 10%;
}

// -----------  内容区  -----------
.com-echart-ui {
  // padding: 0 10px;
  width: 100%;
  height: 100vh;
  background-image: url('../../../src/assets/capaticy/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .title-box {
    position: relative;
    height: 80px;
    line-height: 80px;
    margin-bottom: 20px;
    width: 100%;
    background-image: url('../../../src/assets/capaticy/title_bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .ui-title {
      letter-spacing: 4px;
      font-weight: 600;
    }
    .screen-full-btn {
      position: absolute;
      top: 30px;
      right: 20px;
      width: 40px;
      height: 40px;
    }
  }

  .content-box {
    // ------- 左边 --------
    .left-two-one,
    .left-two-box,
    .left-three-box {
      background-repeat: no-repeat;
      background-size: 100% 100%;
      text-align: center;
    }

    .left-one-box {
      .item-box {
        background-image: url('../../../src/assets/capaticy/left_one_bg.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        padding: 12px 10px;
        .item-title {
          font-size: 13px;
          color: #fff;
        }
        .item-value {
          margin-top: 5px;
          font-size: 14px;
          color: #66ffff;
          font-weight: bold;
          font-family: DIN-BOLD, DIN;
        }
      }
    }

    .left-two-box {
      background-image: url('../../../src/assets/capaticy/left_two_bg.png');
    }

    .left-three-box {
      background-image: url('../../../src/assets/capaticy/left_three_bg.png');
    }

    // ------- 中间 --------
    .center-one-box,
    .center-two-box,
    .center-three-box {
      position: relative;
      background-image: url('../../../src/assets/capaticy/center_one_bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }

    .center-one-box,
    .center-three-box {
      .title {
        position: absolute;
        padding-left: 16px;
      }
      .tab {
        padding-top: 24px;
        .tab-header {
          border-collapse: separate;
          border-spacing: 0 0;
          th {
            color: #66ffff;
            width: 10%;
            font-size: 14px;
            text-align: center;
          }
        }
        .tab-content {
          font-size: 14px;
          border-collapse: separate;
          //   border-spacing: 0 8px;
          .tr-box {
            height: 50px;
            .td-box {
              width: 10%;
              color: #fff;
              text-align: center;
            }
          }
        }
      }
    }

    .center-two-box {
      background-image: url('../../../src/assets/capaticy/center_two_bg.png');
      text-align: center;
    }

    .center-three-box {
      background-image: url('../../../src/assets/capaticy/center_three_bg.png');
    }

    // ------- 右边 --------
    .right-one-box,
    .right-two-box {
      background-image: url('../../../src/assets/capaticy/right_two_bg.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
      .title {
        text-align: center;
      }
    }
  }
}
// ------------ 媒体查询   ----------------
@media screen and (min-width: 768px) and (max-width: 992px) {
  .title-box {
    .ui-title {
      font-size: 32px;
    }
  }
}
@media screen and (min-width: 992px) and (max-width: 1200px) {
  .title-box {
    .ui-title {
      font-size: 34px;
    }
  }
}
@media screen and (min-width: 1200px) {
  .title-box {
    .ui-title {
      font-size: 38px;
    }
  }
}

// 下拉选择框
.right-one-box,
.right-two-box {
  .select-time {
    width: 60px;
    position: absolute;
    left: 15px;
    top: 10px;
    text-align: center;
    z-index: 999;
    .title {
      font-size: 12px;
      line-height: 20px;
      color: #fff;
      border: 1px solid #00e9ef;
      padding-right: 20px;
      .arrow-right {
        position: absolute;
        right: 0;
        width: 20px;
        height: 20px;
        transition: 1s;
        transform: rotate(0deg);
        -ms-transform: rotate(0deg); /* IE 9 */
        -moz-transform: rotate(0deg); /* Firefox */
        -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
        -o-transform: rotate(0deg); /* Opera */
        &.click-90deg {
          transform: rotate(90deg);
          -ms-transform: rotate(90deg); /* IE 9 */
          -moz-transform: rotate(90deg); /* Firefox */
          -webkit-transform: rotate(90deg); /* Safari 和 Chrome */
          -o-transform: rotate(90deg); /* Opera */
        }
      }
    }
    .options {
      background: #051c3c;
      border: 1px solid #00e9ef;
      border-top: none;
      padding-right: 20px;
      .item-box {
        color: #fff;
        font-size: 14px;
        line-height: 30px;
        &.active {
          color: #66ffff;
        }
      }
    }
  }
}
</style>
```

:::
