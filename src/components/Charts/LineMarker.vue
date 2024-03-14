<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    pi: {
      type: Array,
      default: ''
    },
    chartName: {
      type: String,
      default: ''
    },
    yAxisName: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100px'
    },
    height: {
      type: String,
      default: '100px'
    }
  },
  data() {
    return {
      chart: null,
      lineColor: ['red', 'blue', 'green', 'yellow'],
      names: [],
      date: [],
      data: []
    }
  },
  watch: {
    pi(newValue, oldValue) {
      this.updateChart()
    }
  },
  mounted() {
    this.parseProps()
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    updateChart() {
      this.parseProps()
      this.initChart()
    },
    initChart() {
      if (this.chart) {
        this.chart.dispose()
      }
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 10,
          text: this.chartName,
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        legend: {
          top: 40,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: this.names,
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 130,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            data: this.date
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: this.createSeries().length ? this.yAxisName : '-',
            axisTick: { show: false },
            axisLine: {
              lineStyle: {
                color: '#57617B'
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: '#57617B'
              }
            }
          }
        ],
        series: this.createSeries()
      })
    },
    createSeries() {
      const series = []
      for (let i = 0; i < this.names.length; i++) {
        series.push({
          name: this.names[i],
          type: 'line',
          smooth: true,
          itemStyle: {
            normal: {
              color: this.lineColor[i]
            }
          },
          data: this.data[i]
        })
      }
      return series
    },
    parseProps() {
      const names = []
      const date = []
      const data = []
      this.pi.forEach((item) => {
        names.push(item.name)

        const arr_date = []
        const arr_data = []
        item.data.forEach((elem) => {
          arr_date.push(Object.keys(elem).join())
          arr_data.push(Object.values(elem).join())
        })
        date.push(arr_date)
        data.push(arr_data)
      })
      this.names = names
      this.date = date[0]
      this.data = data
    }
  }
}
</script>
