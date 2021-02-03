<template>
  <div ref="wraper" v-resize="onResize" class="svg-wraper">
    <svg
      id="Layer_1"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      :view-box.camel="viewbox"
      xml:space="preserve"
      preserveAspectRatio="xMidYMid meet"
    >
      <g>
        <polygon
          fill="#0658a5"
          stroke="#0658a5"
          stroke-width="1"
          :points="playedPoints"
        />
        <polygon
          fill="#0074d9"
          stroke="#0074d9"
          stroke-width="1"
          :points="notplayedPoints"
        />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'AvSVG2',
  props: {
    audioSrc: {
      type: String,
      default: null,
      required: true,
    },
    audioRef: {
      type: String,
      default: null,
    },
    samples: {
      type: Number,
      default: 100, // Number of samples we want to have in our final data set
    },
    play: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      animId: null,
      width: 100,
      height: 50,
      mult: 1, // multiplier
      audio: null,
      duration: null,
      peaks: [],
      isPlaying: false,
      currentTime: null,
      waveformPoints: null,
      playedPoints: '',
      notplayedPoints: '',
    }
  },
  computed: {
    viewbox() {
      return `0 0 ${this.width} ${this.height}`
    },
    multiplier() {
      return this.width / this.samples
    },
  },
  watch: {
    play(val) {
      this.isPlaying = val
      if (val) {
        if (this.audio) {
          this.audio.oncanplay = (event) => {
            console.log('Audio can start, but not sure it will play through.')
            this.audio.play()
          }
        }
      } else if (this.audio) {
        this.audio.pause()
        cancelAnimationFrame(this.animId)
      }
    },
    currentTime(val) {
      const self = this
      this.$emit('ontimeline', {
        duration: self.timeFormat(self.duration),
        currentTime: self.timeFormat(val),
      })
    },
    audioSrc(file) {
      this.waveformPoints = null
      this.loadAudio(file)
    },
  },
  mounted() {
    this.width = this.$refs.wraper.clientWidth // this.$el.clientWidth not working
    this.height = this.$refs.wraper.clientHeight
    this.mult = this.width / this.samples

    let audio = null
    if (this.audioRef) {
      audio = this.$parent.$refs[this.audioRef]
    }
    if (!audio) {
      audio = document.createElement('audio')
      audio.setAttribute('ref', 'audio')
      audio.setAttribute('auto', true)
      this.$el.appendChild(audio)
    }
    audio.setAttribute('src', this.audioSrc) // src: url
    this.audio = audio

    const self = this
    audio.onplay = () => {
      self.animId = requestAnimationFrame(self.waveformAnim)
    }
    audio.onpause = () => {
      cancelAnimationFrame(self.animId)
      self.animId = null
    }
    this.$set(this.$data, 'currentTime', audio.currentTime)

    this.loadAudio(this.audioSrc)
  },
  beforeDestroy() {
    if (this.audio) this.audio.pause()
    cancelAnimationFrame(this.animId)
  },
  methods: {
    onResize() {
      console.log('onResize')
      this.width = this.$refs.wraper.clientWidth // .offsetWidth;
      this.height = this.$refs.wraper.clientHeight // .offsetHeight;
      this.mult = this.width / this.samples
      this.waveformAnim()
    },
    waveformAnim() {
      if (this.audio) {
        this.currentTime = this.audio.currentTime

        const time = this.audio.currentTime

        const points = this.waveformPoints ? this.waveformPoints : this.points()

        let playX = this.playX(time) * 2 // since x and y coords in 1d array
        if (playX === 0) playX = 2

        const playedPoints = points.slice(0, playX)
        const notplayedPoints = points.slice(playX)

        const height = this.height
        const lastX = playedPoints[playedPoints.length - 2]
        const lastY = playedPoints[playedPoints.length - 1]

        this.playedPoints = [...playedPoints, [lastX, height]].join(' ')
        this.notplayedPoints = [
          ...[lastX, height, lastX, lastY],
          notplayedPoints,
        ].join(' ')
      }
      if (this.play) {
        this.animId = requestAnimationFrame(this.waveformAnim)
      } else {
        cancelAnimationFrame(this.animId)
      }
    },
    loadAudio(url) {
      if (this.audio) {
        this.audio.setAttribute('src', url)
        this.audio.setAttribute('auto', true)
      }
      window.AudioContext = window.AudioContext || window.webkitAudioContext // Chrome / Safari support
      const audioContext = new AudioContext()
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => this.normalizeData(this.filterData(audioBuffer)))
    },
    filterData(audioBuffer) {
      this.duration = audioBuffer.duration
      const self = this
      if (this.duration) {
        this.$emit('ontimeline', {
          duration: self.timeFormat(self.duration),
          currentTime: self.timeFormat(0),
        })
      }
      const numSamples = this.samples
      const numChannels = audioBuffer.numberOfChannels
      const blockSize = Math.floor(audioBuffer.length / numSamples)

      const mixed = new Float32Array(numSamples)

      for (let i = 0; i < numChannels; i++) {
        const rawData = audioBuffer.getChannelData(i)
        // mixed[i] += rawData
        // const filteredData = []
        for (let i = 0; i < numSamples; i++) {
          const blockStart = blockSize * i // the location of the first sample in the block
          let sum = 0
          for (let j = 0; j < blockSize; j++) {
            sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
          }
          // filteredData.push(sum / blockSize) // divide the sum by the block size to get the average
          mixed[i] = (mixed[i] + sum / blockSize) / 2 // avarage
        }
      }
      return mixed
    },
    normalizeData(filteredData) {
      const multiplier = Math.pow(Math.max(...filteredData), -1)
      const values = filteredData.map((n) => n * multiplier)
      this.peaks = values

      const points = this.points()
      this.waveformPoints = points
      this.playedPoints = points.slice(0, 0)
      this.notplayedPoints = points.slice(0)
      return values
    },
    playX(time) {
      return ~~((time / this.duration) * this.samples)
    },
    points() {
      const height = this.height
      const mult = this.width / this.samples
      const peaks = this.peaks
      const coords = []
      coords.push(0) // x0
      coords.push(height) // y0

      peaks.forEach((v, i) => {
        const x = i * mult
        let y = height - v * height
        if (y < 0) y = 0
        if (y > height) y = height
        coords.push(x)
        coords.push(y)
      })
      coords.push(peaks.length * mult) // xEnd
      coords.push(height) // yEnd
      return coords
    },
    timeFormat(timeSec) {
      let frmStr = ''
      const time = parseFloat(timeSec)
      if (isNaN(time)) {
        return frmStr
      }

      const min = ~~(time / 60)
      const sec = ~~(time % 60)
      const ms = ~~((time % 1) * 1000)

      frmStr = min < 10 ? `0${min}:` : `${min}:`
      frmStr += `0${sec}`.substr(-2)
      if (this.playtimeWithMs) {
        frmStr += '.' + `00${ms}`.substr(-3)
      }

      return frmStr
    },
  },
}
</script>

<style scoped>
.svg-wraper {
  display: inline-block;
  width: 100%;
  min-width: 100%;
  height: 70px;
  margin-bottom: 20px;
}
</style>
