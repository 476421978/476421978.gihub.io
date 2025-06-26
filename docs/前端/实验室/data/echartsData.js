import * as echarts from 'echarts'

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
