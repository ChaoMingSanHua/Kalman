<template>
    <div class="com-container">
        <div>数据展示组件</div>
        <div class="com-sim-data">
          <p>速度</p>
          <!-- <input type="number" min="0" max="10" value="5"/> -->
          <input type="number" min="0" max="10" v-model="realInitVel"/>
          <p>加速度</p>
          <input type="number" min="0" max="10" v-model="realInitAcc"/>
        </div>
        <div class="com-data-init">
          <p>位置</p>
          <input type="number" min="0" max="10" v-model="initPos"/>
          <p>速度</p>
          <input type="number" min="0" max="10" v-model="initVel"/>
          <p>初始状态噪声方差</p>
          <input type="number" min="0" max="10" v-model="pPara">
          <p>模型噪声方差</p>
          <input type="number" min="0" max="10" v-model="qPara">
          <p>传感器噪声方差</p>
          <input type="number" min="0" max="10" v-model="rPara"/>
        </div>
        <button @click="sim">仿真</button>
        <!-- <div class="com-chart" ref="chart"></div> -->
        <div class="com-figure">
          <div class="com-chart" ref="chart1"></div>
          <div class="com-chart" ref="chart2"></div>
        </div>

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
      realInitVel: 5,
      realInitAcc: 0.1,
      initPos: 0,
      initVel: 0,
      pPara: 0.1,
      qPara: 0.0001,
      rPara: 1,

      time: null,
      realPosArray: null,
      realVelArray: null,
      modelPosArray: null,
      modelVelArray: null,
      observePosArray: null,
      observeVelArray: null,
      chart1Instance: null,
      chart2Instance: null
    }
  },
  mounted () {
    this.initChart()
    // this.updateChart()
  },
  methods: {
    sim () {
      this.time = math.range(0, 100, 5)

      // 实际数据
      this.realPosArray = math.zeros(20)
      this.realVelArray = math.zeros(20)
      this.time.forEach((item, index) => {
        this.realPosArray._data[index] = this.realInitVel * item + 0.5 * this.realInitAcc * item * item
        this.realVelArray._data[index] = this.realInitVel + this.realInitAcc * item
      })

      // 模型数据
      this.modelPosArray = new Array(20)
      this.modelVelArray = new Array(20)

      // 观测数据
      this.observePosArray = new Array(20)
      this.observeVelArray = new Array(20)
      const noise = 0.01
      this.realPosArray._data.forEach((item, index) => {
        this.observePosArray[index] = item + noise
        if (index) {
          this.observeVelArray[index] = (this.observePosArray[index] - this.observePosArray[index - 1]) / 5
        } else {
          this.observeVelArray[index] = 0
        }
      })
      this.updateChart()
    },
    initChart () {
      this.chart1Instance = this.$echarts.init(this.$refs.chart1)
      this.chart2Instance = this.$echarts.init(this.$refs.chart2)
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
      this.chart1Instance.setOption(initOption)
      this.chart2Instance.setOption(initOption)
    },
    updateChart () {
      // 数据
      // const xArr = math.range(0, 0.4, 0.1)
      // const yArr = [1, 2, 3, 4]
      // const yArr2 = [1.5, 2.5, 3.5, 4.5]
      const data1Options = {
        xAxis: {
          data: this.time._data
        },
        series: [{
          name: 'test',
          type: 'line',
          data: this.realPosArray._data
        }, {
          name: 'test2',
          type: 'scatter',
          data: this.observePosArray
        }]
      }

      const data2Options = {
        xAxis: {
          data: this.time._data
        },
        series: [{
          name: 'test',
          type: 'line',
          data: this.realVelArray._data
        }, {
          name: 'test2',
          type: 'scatter',
          data: this.observeVelArray
        }]
      }

      this.chart1Instance.setOption(data1Options)
      this.chart2Instance.setOption(data2Options)
    }
  }
}
</script>

<style scoped lang="less">
.com-container {
  .com-sim-data {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .com-data-init {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .com-figure {
    display: flex;
    justify-content: center;
    align-items: center;

    width: auto;
    height: 500px;

    .com-chart {
      width: 50%;
      height: 100%;
    }
  }
}
</style>
