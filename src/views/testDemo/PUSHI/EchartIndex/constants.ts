import dayjs from 'dayjs'
import { ref } from 'vue'

// 条状图
export const BAR_CHART_DATA = {
  xAxis: Array.from({ length: 7 }, (_, i) => {
    return dayjs()
      .subtract(6 - i, 'day')
      .format('M.DD')
  }),
  yAxis: [5496.12, 4885.37, 5321.65, 5794.28, 6033.91, 4976.44, 6142.07]
}

export const BAR_ECHART_OPTION = ref({
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params: any) {
      const item = params[0]
      return `${item.axisValue}<br/>${item.data}`
    }
  },
  grid: {
    top: 50,
    left: 40,
    right: 30,
    bottom: 40,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: BAR_CHART_DATA.xAxis,
    axisLine: {
      lineStyle: {
        color: '#E9ECF1'
      }
    },
    axisLabel: {
      color: '#737373',
      fontSize: 16
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 8000,
    interval: 2000,
    axisLine: {
      show: false
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: '#E9ECF1'
      }
    },
    axisLabel: {
      color: '#737373',
      fontSize: 16
    }
  },
  series: [
    {
      type: 'bar',
      data: BAR_CHART_DATA.yAxis,
      barWidth: 36,
      itemStyle: {
        color: '#2f77ff'
        // borderRadius: [6, 6, 0, 0]
      },
      label: {
        show: true,
        position: 'top',
        color: '#222',
        fontSize: 16,
        formatter: function (params: any) {
          return `${params.data}`
        }
      }
    }
  ]
})
