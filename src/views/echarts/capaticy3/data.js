import * as echarts from 'echarts'

/**
 * mock start--------------------------------
 */
// --- 当日产量...
export const leftOneData = [
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
]

// --- 产能效率
export const leftTwoData = {
  name: ['工作中心一', '工作中心二', '工作中心三', '工作中心四', '工作中心五', '工作中心六', '工作中心七'],
  value: [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4]
}
export const tabHeadTxtOne = ['设备编号', '所属产品线', '故障开始时间', '故障原因代码', '产量损失', '影响工时(h)']
export const centerOneData = [
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
]

// --- 良品与不良率统计
export const centerTwoData = [
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
]

// --- 工作中心产能负荷
export const tabHeadTxtTwo = ['工作中心', '计划数量', '实际数量', '一次通过数', '一次未合格']
// 右边数据
// --- 产能效率推移图
export const rightOneData = {
  name: ['一月', '二月', '三月', '四月', '五月', '六月'],
  value: [0.3, 0.9, 0.5, 0.7, 0.5, 0.9]
}

export const rightOneTimeArr = [
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
]

// 良品与不良率推移图
export const rightTwoData = [
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
]

export const rightTwoTimeArr = [
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
]
/**
 * mock end--------------------------------
 */

// 产能效率
const leftTwoTem = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      show: false
    },
    axisLabel: {
      textStyle: {
        color: '#fff'
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.5)'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#fff'
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.5)'
      }
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      symbol: 'circle',
      itemStyle: {
        normal: {
          color: '#fff',
          borderColor: '#66FFFF',
          borderWidth: 2,
          lineStyle: {
            color: '#66FFFF'
          }
        }
      }
    }
  ]
}

// 设备运行状态
const color = ['#418DFE', '#FFEE53', '#17D161', '#FD7E7E', '#66FFFF', '#ff1111', '#E6B426', '#3262D0', '#6F59D7']
const leftThreeTem = {
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '设备运行状态',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '50%'],
      hoverAnimation: false,
      color: color,
      label: {
        show: true,
        fontSize: 14,
        formatter: '{b}\n\n{d}%',
        color: '#fff'
      },
      // emphasis: {
      //     label: {
      //         show: true,
      //         fontSize: '24'
      //     }
      // },
      labelLine: {
        show: true
      },
      data: [
        { value: 25, name: '空闲' },
        { value: 25, name: '高负荷运转' },
        { value: 25, name: '低负荷运转' },
        { value: 25, name: '检修' }
      ]
    }
  ]
}

// 产品与损坏率统计
const centerTwoTem = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  legend: [
    {
      data: ['苹果', '损坏苹果', '废苹果', '损坏率'],
      itemWidth: 10,
      itemHeight: 10,
      width: '30%',
      right: 10,
      top: '1%',
      textStyle: {
        color: '#fff'
      }
    }
  ],
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
      axisPointer: {
        type: 'shadow'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.5)'
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        },
        formatter: '{value}'
      },
      splitLine: {
        show: false
      }
    },
    {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        },
        formatter: '{value}%'
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.5)'
        }
      }
    }
  ],
  series: [
    {
      name: '苹果',
      type: 'bar',
      stack: 'Total',
      barWidth: 20,
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      itemStyle: {
        // barBorderRadius: [5, 5, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#66FFFF'
          },
          {
            offset: 1,
            color: '#66A3FF'
          }
        ])
      },

      data: []
      // z: 1,
      // barGap: '-100%'
    },
    {
      name: '损坏苹果',
      type: 'bar',
      stack: 'Total',
      barWidth: 20,
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      itemStyle: {
        // barBorderRadius: [5, 5, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#FFF0A2'
          },
          {
            offset: 1,
            color: '#FFC555'
          }
        ])
      },
      data: []
      // z: 1,
      // barGap: '-100%'
    },
    {
      name: '废苹果',
      type: 'bar',
      stack: 'Total',
      barWidth: 20,
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      itemStyle: {
        // barBorderRadius: [5, 5, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#FD8080'
          },
          {
            offset: 1,
            color: '#DF1E1E'
          }
        ])
      },
      data: []
      // z: 1,
      // barGap: '-100%'
    },
    {
      name: '损坏率',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + '%'
        }
      },
      itemStyle: {
        normal: {
          color: '#FFEA2D',
          borderWidth: 5,
          lineStyle: {
            color: '#FFEA2D'
          }
        }
      },
      data: []
    }
  ]
}

// 产能效率推移图
const rightOneTem = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#fff'
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.5)'
      }
    }
  },
  yAxis: {
    type: 'value',
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#fff'
      }
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.5)'
      }
    }
  },
  series: [
    {
      data: [],
      type: 'line',
      symbol: 'circle',
      itemStyle: {
        normal: {
          color: '#fff',
          borderColor: '#66FFFF',
          borderWidth: 2,
          lineStyle: {
            color: '#66FFFF'
          }
        }
      }
    }
  ]
}

// 良品与损坏率推移图
const rightTwoTem = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      crossStyle: {
        color: '#999'
      }
    }
  },
  grid: {
    left: '2%',
    right: '2%',
    bottom: '5%',
    containLabel: true
  },
  legend: {
    data: ['苹果', '损坏苹果', '废苹果', '损坏率'],
    itemWidth: 8,
    itemHeight: 8,
    width: '32%',
    right: 0,
    top: '1%',
    textStyle: {
      color: '#fff'
    }
  },
  xAxis: [
    {
      type: 'category',
      data: [],
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        }
      },
      axisPointer: {
        type: 'shadow'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.5)'
        }
      }
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        },
        formatter: '{value}'
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.5)'
        }
      }
    },
    {
      type: 'value',
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#fff'
        },
        formatter: '{value}%'
      },
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.5)'
        }
      }
    }
  ],
  series: [
    {
      name: '苹果',
      type: 'bar',
      barWidth: 20,
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#66FFFF'
          },
          {
            offset: 1,
            color: '#66A3FF'
          }
        ])
      },

      data: [],
      z: 1,
      barGap: '-100%'
    },
    {
      name: '损坏苹果',
      type: 'bar',
      barWidth: 20,
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#FFF0A2'
          },
          {
            offset: 1,
            color: '#FFC555'
          }
        ])
      },
      data: [],
      z: 1,
      barGap: '-100%'
    },
    {
      name: '废苹果',
      type: 'bar',
      barWidth: 20,
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      },
      itemStyle: {
        barBorderRadius: [5, 5, 0, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: '#FD8080'
          },
          {
            offset: 1,
            color: '#DF1E1E'
          }
        ])
      },
      z: 1,
      barGap: '-100%',
      data: []
    },
    {
      name: '损坏率',
      type: 'line',
      yAxisIndex: 1,
      tooltip: {
        valueFormatter: function (value) {
          return value + '%'
        }
      },
      itemStyle: {
        normal: {
          color: '#FFEA2D',
          borderWidth: 5,
          lineStyle: {
            color: '#FFEA2D'
          }
        }
      },
      data: [],
      z: 1,
      barGap: '-100%'
    }
  ]
}

export { leftTwoTem, leftThreeTem, centerTwoTem, rightOneTem, rightTwoTem }
