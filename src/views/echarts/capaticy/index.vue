<template>
  <div id="CapacityMonitoringCenter" ref="CapacityMonitoringCenter" class="com-echart-ui">
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
            <table class="tab-header" style="height: 22px; width: 100%">
              <th v-for="thTxt in tabHeadTxtOne" :key="thTxt">{{ thTxt }}</th>
            </table>
            <div style="flex: 1; overflow: hidden">
              <vue3-seamless-scroll :list="centerOneData">
                <table class="tab-content">
                  <tr v-for="(tdTxt, index) in centerOneData" :key="index" class="tr-box">
                    <td class="td-box" style="color: rgba(255, 255, 255, 0.8)">{{ tdTxt.id }}</td>
                    <td class="td-box" style="color: rgba(255, 255, 255, 0.8)">{{ tdTxt.name }}</td>
                    <td class="td-box" style="color: #66a3ff">{{ tdTxt.time }}</td>
                    <td class="td-box" style="color: #7cf6ad">{{ tdTxt.code }}</td>
                    <td class="td-box" style="color: #66a3ff">{{ tdTxt.lossNum }}</td>
                    <td class="td-box" style="color: #7cf6ad">{{ tdTxt.lossTime }}</td>
                  </tr>
                </table>
              </vue3-seamless-scroll>
            </div>
            <div style="height: 20px"></div>
          </div>
        </div>

        <div class="center-two-box" style="flex: 4">
          <div class="title flex justify-center align-center width-100" style="height: 10%; float: left">堆叠图1推移图</div>
          <div id="centerTwoDom" style="height: 100%; width: 100%"></div>
        </div>

        <div class="center-three-box" style="flex: 3; overflow: hidden">
          <div class="title ellipsis hover-active flex justify-center align-center" style="width: 20%">
            <span class="ellipsis">数据表单中心统计</span>
            <img src="@/assets/capaticy/double_arrow.png" style="margin-left: 5px; width: 14px; height: 12px" />
          </div>
          <div class="tab flex flex-column" style="height: calc(100% - 24px)">
            <table class="tab-header" style="height: 22px; width: 100%">
              <th v-for="thTxt in tabHeadTxtTwo" :key="thTxt">{{ thTxt }}</th>
            </table>
            <div style="flex: 1; overflow: hidden">
              <vue3-seamless-scroll :list="centerOneData">
                <table class="tab-content">
                  <tr v-for="(tdTxt, index) in centerOneData" :key="index" class="tr-box">
                    <td class="td-box" style="color: rgba(255, 255, 255, 0.8)">{{ tdTxt.id }}</td>
                    <td class="td-box" style="color: #66a3ff">{{ tdTxt.name }}</td>
                    <td class="td-box" style="color: #a484ff">{{ tdTxt.time }}</td>
                    <td class="td-box" style="color: #66a3ff">{{ tdTxt.code }}</td>
                    <td class="td-box" style="color: #a484ff">{{ tdTxt.lossNum }}</td>
                  </tr>
                </table>
              </vue3-seamless-scroll>
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

<script>
import { Vue3SeamlessScroll } from 'vue3-seamless-scroll' // 表单滚动
import screenfull from 'screenfull'
import { leftTwoTem, leftThreeTem, centerTwoTem, rightOneTem, rightTwoTem } from './data'
export default {
  components: {
    Vue3SeamlessScroll
  },
  data() {
    return {
      isFullscreen: false, // 全屏显示
      // 图表
      leftTwoEct: null,
      leftThreeEct: null,
      centerTwoEct: null,
      rightOneEct: null,
      rightTwoEct: null,
      // 滚动数据
      leftTwoShowList: {
        names: [],
        values: []
      },
      leftTwoTime: null,
      centerTwoTime: null,
      rightOneTime: null,
      rightTwoTime: null,
      // 左列数据
      // --- 当日产量...
      leftOneData: [
        {
          name: '当日产量',
          value: '147,164件'
        },
        {
          name: '当月产量',
          value: '1517,164件'
        },
        {
          name: '日目标达成率',
          value: '83%'
        },
        {
          name: '月投入产出比',
          value: '74%'
        }
      ],
      // --- 产能效率
      leftTwoData: {
        name: ['工作中心一', '工作中心二', '工作中心三', '工作中心四', '工作中心五', '工作中心六', '工作中心七'],
        value: [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4]
      },
      // 中间数据
      // --- 设备监控
      tabHeadTxtOne: ['设备编号', '所属产品线', '故障开始时间', '故障原因代码', '产量损失', '影响工时(h)'],
      centerOneData: [
        {
          id: '001',
          name: '牛奶',
          time: '12-13-13:00',
          code: 400,
          lossNum: 180,
          lossTime: 35
        },
        {
          id: '002',
          name: '苹果',
          time: '12-13-13:00',
          code: 400,
          lossNum: 180,
          lossTime: 35
        },
        {
          id: '003',
          name: '手机',
          time: '12-13-13:00',
          code: 400,
          lossNum: 180,
          lossTime: 35
        },
        {
          id: '004',
          name: '键盘',
          time: '12-13-13:00',
          code: 400,
          lossNum: 180,
          lossTime: 35
        },
        {
          id: '005',
          name: '鼠标',
          time: '12-13-13:00',
          code: 400,
          lossNum: 180,
          lossTime: 35
        },
        {
          id: '006',
          name: '音响',
          time: '12-13-13:00',
          code: 400,
          lossNum: 180,
          lossTime: 35
        },
        {
          id: '007',
          name: '耳机',
          time: '12-13-13:00',
          code: 400,
          lossNum: 180,
          lossTime: 35
        },
        {
          id: '008',
          name: '耳机',
          time: '12-13-13:00',
          code: 400,
          lossNum: 180,
          lossTime: 35
        }
      ],
      // --- 良品与不良率统计
      centerTwoData: [
        {
          name: '工作中心一',
          lpNum: 100,
          blpNum: 10,
          fpNum: 10,
          ratio: 10
        },
        {
          name: '工作中心二',
          lpNum: 200,
          blpNum: 20,
          fpNum: 20,
          ratio: 20
        },
        {
          name: '工作中心三',
          lpNum: 100,
          blpNum: 90,
          fpNum: 10,
          ratio: 90
        },
        {
          name: '工作中心四',
          lpNum: 300,
          blpNum: 60,
          fpNum: 30,
          ratio: 30
        },
        {
          name: '工作中心五',
          lpNum: 100,
          blpNum: 10,
          fpNum: 10,
          ratio: 10
        },
        {
          name: '工作中心六',
          lpNum: 100,
          blpNum: 10,
          fpNum: 10,
          ratio: 10
        }
      ],
      // --- 工作中心产能负荷
      tabHeadTxtTwo: ['工作中心', '计划数量', '实际数量', '一次通过数', '一次未合格'],
      // 右边数据
      // --- 产能效率推移图
      rightOneData: {
        name: ['一月', '二月', '三月', '四月', '五月', '六月'],
        value: [0.3, 0.9, 0.5, 0.7, 0.5, 0.9]
      },
      rightOneTimeArrIndex: 0,
      rightOneTimeArr: [
        {
          value: 0,
          label: '日'
        },
        {
          value: 1,
          label: '月'
        },
        {
          value: 2,
          label: '年'
        }
      ],
      rightOneVisible: false,
      // 良品与不良率推移图
      rightTwoData: [
        {
          name: '3.1',
          lpNum: 1000,
          blpNum: 100,
          fpNum: 100,
          ratio: 10
        },
        {
          name: '3.2',
          lpNum: 2000,
          blpNum: 500,
          fpNum: 500,
          ratio: 25
        },
        {
          name: '3.3',
          lpNum: 1000,
          blpNum: 900,
          fpNum: 100,
          ratio: 90
        },
        {
          name: '3.4',
          lpNum: 300,
          blpNum: 60,
          fpNum: 30,
          ratio: 30
        },
        {
          name: '3.5',
          lpNum: 500,
          blpNum: 75,
          fpNum: 50,
          ratio: 15
        }
      ],
      rightTwoTimeArrIndex: 0,
      rightTwoTimeArr: [
        {
          value: 0,
          label: '日'
        },
        {
          value: 1,
          label: '月'
        },
        {
          value: 2,
          label: '年'
        }
      ],
      rightTwoVisible: false
    }
  },

  // 监听属性 类似于data概念
  // computed: {
  //   defaultOption() {
  //     return {
  //       step: 0.2, // 数值越大速度滚动越快
  //       limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
  //       hoverStop: true, // 是否开启鼠标悬停stop
  //       direction: 0, // 0向下 1向上 2向左 3向右
  //       openWatch: true, // 开启数据实时监控刷新dom
  //       singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
  //       singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
  //       waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
  //     }
  //   }
  // },
  mounted() {
    this.init()
    // 页面缩放 重新渲染大小
    window.addEventListener('resize', () => {
      this.againInit()
    })
  },
  beforeDestroy() {
    clearInterval(this.leftTwoTime)
    clearInterval(this.centerTwoTime)
    clearInterval(this.rightOneTime)
    clearInterval(this.rightTwoTime)
  },
  destroyed() {
    window.removeEventListener('resize', () => {
      this.againInit()
    })
  },
  methods: {
    // 渲染 start
    // ---------------- 产能效率
    onLeftTwo() {
      this.leftTwoEct = this.$echarts.init(document.getElementById('leftTwoDom'))
      const leftTwoNames = this.leftTwoData.name || []
      const leftTwoValues = this.leftTwoData.value || []

      leftTwoTem['xAxis']['data'] = JSON.parse(JSON.stringify(leftTwoNames)).splice(0, 4)
      leftTwoTem['series'][0]['data'] = JSON.parse(JSON.stringify(leftTwoValues)).splice(0, 4)
      this.leftTwoEct.setOption(leftTwoTem)

      // 滚动数据
      if (leftTwoNames.length > 4 && leftTwoValues.length > 4) {
        // ----------- 初始化
        let index = 4
        // ----------- 定时器
        this.leftTwoTime = setInterval(() => {
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

          this.leftTwoEct.setOption(leftTwoTem)
        }, 3000)
      }
    },
    // ---------------- 设备运行状态
    onLeftThree() {
      this.leftThreeEct = this.$echarts.init(document.getElementById('leftThreeDom'))
      this.leftThreeEct.setOption(leftThreeTem)
    },
    // ---------------- 良品与不良率统计
    onCenterTwo() {
      this.centerTwoEct = this.$echarts.init(document.getElementById('centerTwoDom'))
      this.centerTwoData = this.centerTwoData || []
      // 初始化Tem
      centerTwoTem.xAxis[0]['data'] = [] // 名称
      centerTwoTem.series[0]['data'] = [] // 良品数
      centerTwoTem.series[1]['data'] = [] // 不良品数
      centerTwoTem.series[2]['data'] = [] // 废品数
      centerTwoTem.series[3]['data'] = [] // 不良率

      // 整合对应数组集合
      const nameArr = this.centerTwoData
        .map((item) => {
          return item.name
        })
        .splice(0, 4)
      const lpNumArr = this.centerTwoData
        .map((item) => {
          return item.lpNum
        })
        .splice(0, 4)
      const blpNumArr = this.centerTwoData
        .map((item) => {
          return item.blpNum
        })
        .splice(0, 4)
      const fpNumArr = this.centerTwoData
        .map((item) => {
          return item.fpNum
        })
        .splice(0, 4)
      const ratioArr = this.centerTwoData
        .map((item) => {
          return item.ratio
        })
        .splice(0, 4)

      // 初始化图表数据
      centerTwoTem.xAxis[0]['data'] = nameArr // 名称
      centerTwoTem.series[0]['data'] = lpNumArr // 良品数
      centerTwoTem.series[1]['data'] = blpNumArr // 不良品数
      centerTwoTem.series[2]['data'] = fpNumArr // 废品数
      centerTwoTem.series[3]['data'] = ratioArr // 不良率

      this.centerTwoEct.setOption(centerTwoTem)

      // 滚动数据
      if (this.centerTwoData.length > 4) {
        // ----------- 初始化
        let index = 4
        // ----------- 定时器
        this.centerTwoTime = setInterval(() => {
          let nextObj = this.centerTwoData[index]
          if (!nextObj && index > 0) {
            nextObj = this.centerTwoData[0]
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

          this.centerTwoEct.setOption(centerTwoTem)
        }, 3000)
      }
    },
    // ---------------- 产能效率推移图
    onRightOneData() {
      this.rightOneEct = this.$echarts.init(document.getElementById('rightOneDom'))
      const rightOneNames = this.rightOneData.name || []
      const rightOneValues = this.rightOneData.value || []
      rightOneTem['xAxis']['data'] = JSON.parse(JSON.stringify(rightOneNames)).splice(0, 4)
      rightOneTem['series'][0]['data'] = JSON.parse(JSON.stringify(rightOneValues)).splice(0, 4)
      this.rightOneEct.setOption(rightOneTem)

      // 滚动数据
      if (rightOneNames.length > 4 && rightOneValues.length > 4) {
        // ----------- 初始化
        let index = 4
        // ----------- 定时器
        this.rightOneTime = setInterval(() => {
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
          this.rightOneEct.setOption(rightOneTem)
        }, 3000)
      }
    },
    // ---------------- 良品与不良率推移图
    onRightTwoData() {
      this.rightTwoEct = this.$echarts.init(document.getElementById('rightTwoDom'))

      this.rightTwoData = this.rightTwoData || []
      // 初始化Tem
      rightTwoTem.xAxis[0]['data'] = [] // 名称
      rightTwoTem.series[0]['data'] = [] // 良品数
      rightTwoTem.series[1]['data'] = [] // 不良品数
      rightTwoTem.series[2]['data'] = [] // 废品数
      rightTwoTem.series[3]['data'] = [] // 不良率

      // 整合对应数组集合
      const nameArr = this.rightTwoData
        .map((item) => {
          return item.name
        })
        .splice(0, 4)
      const lpNumArr = this.rightTwoData
        .map((item) => {
          return item.lpNum
        })
        .splice(0, 4)
      const blpNumArr = this.rightTwoData
        .map((item) => {
          return item.blpNum
        })
        .splice(0, 4)
      const fpNumArr = this.rightTwoData
        .map((item) => {
          return item.fpNum
        })
        .splice(0, 4)
      const ratioArr = this.rightTwoData
        .map((item) => {
          return item.ratio
        })
        .splice(0, 4)

      // 初始化图表数据
      rightTwoTem.xAxis[0]['data'] = nameArr // 名称
      rightTwoTem.series[0]['data'] = lpNumArr // 良品数
      rightTwoTem.series[1]['data'] = blpNumArr // 不良品数
      rightTwoTem.series[2]['data'] = fpNumArr // 废品数
      rightTwoTem.series[3]['data'] = ratioArr // 不良率
      this.rightTwoEct.setOption(rightTwoTem)

      // 滚动数据
      if (this.rightTwoData.length > 4) {
        // ----------- 初始化
        let index = 4
        // ----------- 定时器
        this.rightTwoTime = setInterval(() => {
          let nextObj = this.rightTwoData[index]
          if (!nextObj && index > 0) {
            nextObj = this.rightTwoData[0]
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

          this.rightTwoEct.setOption(rightTwoTem)
        }, 3000)
      }
    },
    // 渲染 end
    // 全屏
    screenFullClick() {
      this.$nextTick(() => {
        var dom = this.$refs.CapacityMonitoringCenter
        // 左上角
        screenfull.toggle(dom)
      })
    },
    // 重绘
    againInit() {
      const echartsArr = ['leftTwoEct', 'leftThreeEct', 'centerTwoEct', 'rightOneEct', 'rightTwoEct']
      for (let i = 0; i < echartsArr.length; i++) {
        if (this[echartsArr[i]]) {
          this[echartsArr[i]].resize()
        }
      }
    },
    // 选择日，月，年
    onSelectTime(type, value, item) {
      this[value] = item.value
      this.onShow(type)
    },
    // 显示隐藏下拉框
    onShow(type) {
      this[type] = !this[type]
    },
    init() {
      this.onLeftTwo()
      this.onLeftThree()
      this.onCenterTwo()
      this.onRightOneData()
      this.onRightTwoData()
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  margin: 0 !important;
  padding: 0 !important;
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
  background-image: url('../../../assets/capaticy/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .title-box {
    position: relative;
    height: 80px;
    line-height: 80px;
    margin-bottom: 20px;
    width: 100%;
    background-image: url('../../../assets/capaticy/title_bg.png');
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
        background-image: url('../../../assets/capaticy/left_one_bg.png');
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
      background-image: url('../../../assets/capaticy/left_two_bg.png');
    }

    .left-three-box {
      background-image: url('../../../assets/capaticy/left_three_bg.png');
    }

    // ------- 中间 --------
    .center-one-box,
    .center-two-box,
    .center-three-box {
      position: relative;
      background-image: url('../../../assets/capaticy/center_one_bg.png');
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
      background-image: url('../../../assets/capaticy/center_two_bg.png');
      text-align: center;
    }

    .center-three-box {
      background-image: url('../../../assets/capaticy/center_three_bg.png');
    }

    // ------- 右边 --------
    .right-one-box,
    .right-two-box {
      background-image: url('../../../assets/capaticy/right_two_bg.png');
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
