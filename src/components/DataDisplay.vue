<template>
    <div class="com-container">
        <div>数据展示组件</div>
        <div class="com-chart" ref="chart"></div>
    </div>
</template>

<script>
import { create, all } from 'mathjs'
const config = {
  number: 'number',
  precision: 1
}
const math = create(all, config)

export default {
  name: 'DataDisPlay',
  data () {
    return {
      chartInstance: null
    }
  },
  mounted () {
    this.initChart()
    this.updateChart()
  },
  methods: {
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.chart)
      const initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    updateChart () {
      // 数据
      const xArr = math.range(0, 0.4, 0.1)
      console.log(xArr)
      const yArr = [1, 2, 3, 4]
      const yArr2 = [1.5, 2.5, 3.5, 4.5]
      const dataOptions = {
        xAxis: {
          data: xArr._data.map(item => {
            return item.toFixed(2)
          })
        },
        series: [{
          name: 'test',
          type: 'line',
          data: yArr
        }, {
          name: 'test2',
          type: 'scatter',
          data: yArr2
        }]
      }
      this.chartInstance.setOption(dataOptions)
    }
  }
}
</script>

<style scoped lang="less">
.com-container {
    div {
        width: 1000px;
        height: 1000px;
    }
}
</style>
