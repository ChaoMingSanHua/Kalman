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
      initVel: 5,
      pPara: 0.1,
      qPara: 0.0001,
      rPara: 3,

      time: null,
      realPosArray: null,
      realVelArray: null,

      modelPosArray: null,
      modelVelArray: null,

      observePosArray: null,
      observeVelArray: null,

      kalmanPosArray: null,
      kalmanVelArray: null,

      chart1Instance: null,
      chart2Instance: null
    }
  },
  mounted () {
    this.initChart()
  },
  methods: {
    sim () {
      const timeN = 51
      this.time = math.range(0, timeN, 1)

      // 实际数据
      this.realPosArray = math.zeros(timeN)
      this.realVelArray = math.zeros(timeN)
      this.time.forEach((item, index) => {
        this.realPosArray._data[index] = this.realInitVel * item + 0.5 * this.realInitAcc * item * item
        this.realVelArray._data[index] = this.realInitVel + this.realInitAcc * item
      })

      // 模型数据
      this.modelPosArray = new Array(timeN)
      this.modelVelArray = new Array(timeN)
      const modelF = math.matrix([[1, 1], [0, 1]])
      const modelB = math.matrix([[0.5], [1]])
      const modelH = math.matrix([[1, 0]])
      let modelX = math.matrix([[this.initPos], [this.initVel]])
      const modelU = math.matrix([[this.realInitAcc]])
      this.time.forEach((item, index) => {
        this.modelPosArray[index] = modelX._data[0][0]
        this.modelVelArray[index] = modelX._data[1][0]
        modelX = math.add(math.multiply(modelF, modelX), math.multiply(modelB, modelU))
      })

      // 观测数据
      this.observePosArray = new Array(timeN)
      this.observeVelArray = new Array(timeN)
      const mean = 0.0
      const std = this.rPara
      const noise = this.normalRandomSize(mean, std, timeN)
      console.log(noise)
      this.realPosArray._data.forEach((item, index) => {
        this.observePosArray[index] = item + noise[index]
        if (index) {
          this.observeVelArray[index] = (this.observePosArray[index] - this.observePosArray[index - 1])
        } else {
          this.observeVelArray[index] = 0
        }
      })

      // Kalman数据
      let kalmanX = math.matrix([[this.initPos], [this.initVel]])
      const kalmanU = math.matrix([[this.realInitAcc]])
      let kalmanP = math.matrix([[this.pPara, 0], [0, this.pPara]])
      const kalmanQ = math.matrix([[this.qPara, 0], [0, this.qPara]])
      const kalmanR = math.matrix([[this.rPara]])
      let kalmanX_
      let kalmanP_
      let kalmanK

      this.kalmanPosArray = new Array(timeN)
      this.kalmanVelArray = new Array(timeN)
      this.time.forEach((item, index) => {
        this.kalmanPosArray[index] = kalmanX._data[0][0]
        this.kalmanVelArray[index] = kalmanX._data[1][0]
        kalmanX_ = math.add(math.multiply(modelF, kalmanX), math.multiply(modelB, kalmanU))
        kalmanP_ = math.add(math.multiply(math.multiply(modelF, kalmanP), math.transpose(modelF)), kalmanQ)
        kalmanK = math.multiply(math.multiply(kalmanP_, math.transpose(modelH)), math.inv(math.add(math.multiply(math.multiply(modelH, kalmanP_), math.transpose(modelH)), kalmanR)))
        kalmanX = math.add(kalmanX_, math.multiply(kalmanK, math.subtract(this.observePosArray[index], math.multiply(modelH, kalmanX_))))
        kalmanP = math.multiply(math.subtract(math.identity(2), math.multiply(kalmanK, modelH)), kalmanP_)
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
      const data1Options = {
        xAxis: {
          data: this.time._data
        },
        series: [{
          name: 'real',
          type: 'line',
          data: this.realPosArray._data
        }, {
          name: 'observation',
          type: 'scatter',
          data: this.observePosArray
        }, {
          name: 'model',
          type: 'scatter',
          data: this.modelPosArray
        }, {
          name: 'kalman',
          type: 'scatter',
          data: this.kalmanPosArray
        }]
      }

      const data2Options = {
        xAxis: {
          data: this.time._data
        },
        series: [{
          name: 'real',
          type: 'line',
          data: this.realVelArray._data
        }, {
          name: 'observation',
          type: 'scatter',
          data: this.observeVelArray
        }, {
          name: 'model',
          type: 'scatter',
          data: this.modelVelArray
        }, {
          name: 'kalman',
          type: 'scatter',
          data: this.kalmanVelArray
        }]
      }

      this.chart1Instance.setOption(data1Options)
      this.chart2Instance.setOption(data2Options)
    },
    normalRandom (mean, std) {
      let u = 0.0
      let v = 0.0
      let w = 0.0
      let c = 0.0
      do {
        u = Math.random() * 2 - 1.0
        v = Math.random() * 2 - 1.0
        w = u * u + v * v
      } while (w === 0.0 || w >= 1.0)
      c = Math.sqrt((-2 * Math.log(w)) / w)
      const normal = mean + (u * c) * std
      return normal
    },
    normalRandomSize (mean, std, size) {
      const normal = []
      for (let i = 0; i < size; i++) {
        normal[i] = this.normalRandom(mean, std)
      }
      return normal
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
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: auto;
    height: 1000px;

    .com-chart {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
