<template>
    <div class="com-container">
        <h1>卡尔曼滤波</h1>
        <div>
          <canvas id="canvas" width="1000" height="280">抱歉,您的浏览器不支持canvas元素</canvas>
        </div>
        <h2>实际参数</h2>
        <div class="com-sim-data">
          <div>
            <p>初始速度</p>
            <input type="number" min="0" max="10" v-model="realInitVel"/>
          </div>
          <div>
            <p>加速度</p>
            <input type="number" min="0" max="10" v-model="realInitAcc"/>
          </div>

        </div>
        <h2>理论参数</h2>
        <div class="com-data-init">
          <div>
            <p>初始位置</p>
            <input type="number" min="0" max="10" v-model="initPos"/>
          </div>
          <div>
            <p>初始速度</p>
            <input type="number" min="0" max="10" v-model="initVel"/>
          </div>
          <div>
            <p>初始状态噪声方差</p>
            <input type="number" min="0" max="10" v-model="pPara">
          </div>
          <div>
            <p>模型噪声方差</p>
            <input type="number" min="0" max="10" v-model="qPara">
          </div>
          <div>
            <p>传感器噪声方差</p>
            <input type="number" min="0" max="10" v-model="rPara"/>
          </div>
        </div>
        <button @click="sim">仿真</button>
        <!-- <div class="com-chart" ref="chart"></div> -->
        <div class="com-figure">
          <h2>小车位置</h2>
          <div class="com-chart" ref="chart1"></div>
          <h2>小车速度</h2>
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
      // 车身矩阵
      leftSpacing: 40,
      topSpacing: 40,
      carLength: 160,
      carHeight: 50,

      // 左侧车轮
      wheelSpacing: 80,
      wheelRadius: 20,

      // 右侧车轮

      // 传感器
      sensorLength: 10,
      sensorHeight: 20,
      sensorDot: false,
      sensorRadius: 2,
      sensorNum: 0,

      // 道路
      roadBegin: 0,
      roadEnd: 1000,
      roadLength: 50,
      roadSpacing: 100,

      // 画布
      canvas: null,
      ctx: null,

      timer: null,
      t: null,
      deltaT: 0.02,

      realInitVel: 5,
      realInitAcc: 0.1,
      initPos: 0,
      initVel: 3,
      pPara: 0.1,
      qPara: 0.0001,
      rPara: 10,

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
    this.initCanvas()
    this.canvasRender()
    this.initChart()
  },
  methods: {
    sim () {
      this.initCanvas()
      this.canvasRun()
      setTimeout(this.chartSim, 6000)
    },
    // Canvas
    initCanvas () {
      this.carCenter = [this.leftSpacing + this.carLength / 2, this.topSpacing + this.carHeight / 2]
      this.t = 0
      this.canvas = document.getElementById('canvas')
      this.ctx = this.canvas.getContext('2d')
    },
    canvasRender () {
      const ctx = this.ctx
      ctx.clearRect(0, 0, 1000, 1000)
      ctx.save() // 保存干净环境
      ctx.restore() // 环境释放

      // 车身矩阵
      ctx.strokeRect(this.carCenter[0] - this.carLength / 2, this.carCenter[1] - this.carHeight / 2, this.carLength, this.carHeight)

      // 左侧车轮
      const wheelY = this.carCenter[1] + this.carHeight / 2 + this.wheelRadius
      ctx.beginPath()
      ctx.arc(this.carCenter[0] - this.wheelSpacing / 2, wheelY, this.wheelRadius, 0, 2 * Math.PI)
      ctx.stroke()
      // 右侧车轮
      ctx.beginPath()
      ctx.arc(this.carCenter[0] + this.wheelSpacing / 2, wheelY, this.wheelRadius, 0, 2 * Math.PI)
      ctx.stroke()

      // 传感器
      ctx.strokeRect(this.carCenter[0] - this.sensorLength / 2, this.carCenter[1] - this.carHeight / 2 - this.sensorHeight, this.sensorLength, this.sensorHeight)
      this.sensorNum += 1
      if (this.sensorNum >= 50) {
        this.sensorDot = true
        this.sensorNum = 0
      }

      if (this.sensorDot) {
        ctx.beginPath()
        ctx.arc(this.carCenter[0], this.carCenter[1] - this.carHeight / 2 - this.sensorHeight / 2, this.sensorRadius, 0, 2 * Math.PI, false)
        ctx.fillStyle = 'red'
        ctx.fill()
        this.sensorDot = false
      }

      // 道路
      const roadY = this.carCenter[1] + this.carHeight / 2 + this.wheelRadius * 2
      ctx.beginPath()
      ctx.moveTo(this.roadBegin, roadY)
      ctx.lineTo(this.roadEnd, roadY)
      ctx.closePath()
      ctx.stroke()
      for (let i = 0; i < 10; i++) {
        ctx.beginPath()
        ctx.moveTo(this.roadBegin + 50 + this.roadSpacing * i, roadY)
        ctx.lineTo(this.roadBegin + 50 + this.roadSpacing * i + this.roadLength * Math.cos(3 * Math.PI / 4), roadY + this.roadLength * Math.sin(3 * Math.PI / 4))
        ctx.closePath()
        ctx.stroke()
      }
    },
    canvasRun () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(this.canvasSim, this.deltaT * 1000)
    },
    canvasSim () {
      const vel = 100
      const acc = 1
      this.carCenter[0] += vel * this.deltaT + 0.5 * acc * this.deltaT * (2 * this.t + 1)
      this.t += this.deltaT
      this.canvasRender()

      if (this.timer && this.t > 6) {
        clearInterval(this.timer)
      }
    },

    // Chart
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
          name: 'actual',
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
          name: 'actual',
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
    chartSim () {
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

    div {
      display: flex;
      justify-content: center;
      align-items: center;

      p, input {
        margin: 0 10px;
      }

      // input {
      //   margin: 0 10px;
      // }
    }
  }

  .com-data-init {
    display: flex;
    justify-content: space-around;
    align-items: center;
    div {
      display: flex;
      justify-content: center;
      align-items: center;

      p, input {
        margin: 0 10px;
      }

      // input {
      //   margin: 0 20px;
      // }
    }

    margin: 20px 0;
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

    h2 {
      margin-top: 100px;
    }
  }

  button {
    font-size: 20px;
    font-weight: 700;
  }
}
</style>
