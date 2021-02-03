<template>
  <div v-resize="onResize" class="svg-wraper">
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
      <!--
      <line
        v-for="(v, i) in peaks"
        :key="`line-${i}`"
        :x1="i * multiplier"
        :y1="v[0]"
        :x2="(i + 1) * multiplier"
        :y2="v[1]"
        style="stroke: rgb(255, 0, 0); stroke-width: 2"
      />
      -->
      <polyline
        fill="none"
        stroke="#0074d9"
        stroke-width="3"
        :points="points"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'AvSVG',
  props: {
    audioSrc: {
      type: String,
      default: null,
      required: true,
    },
  },
  data() {
    return {
      width: 100,
      height: 100,
      mult: 1,
      duration: null,
      samples: 100, // Number of samples we want to have in our final data set
      peaks: [],
    }
  },
  computed: {
    viewbox() {
      return `0 0 ${this.width} ${this.height}`
    },
    multiplier() {
      return this.width / this.samples
    },
    points() {
      const mult = this.mult / 2
      const coordsY = this.peaks.flat() // 2d in 1d array
      return coordsY.map((v, i) => `${i * mult} ${v}`).join(' ')
    },
  },
  mounted() {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight
    this.mult = this.width / this.samples
    console.log('w:', this.width, 'mult:', this.mult)

    const audio = document.createElement('audio')
    audio.setAttribute('src', this.audioSrc) // src: url
    audio.setAttribute('ref', 'audio')
    // audio.setAttribute('auto', true)
    this.$el.appendChild(audio)
    this.loadAudio(this.audioSrc)
  },
  methods: {
    onResize() {
      this.width = this.$el.clientWidth // .offsetWidth;
      this.height = this.$el.clientHeight // .offsetHeight;
      this.mult = this.width / this.samples
    },
    loadAudio(url) {
      const audioContext = new AudioContext()
      fetch(url)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
        .then((audioBuffer) => this.normalizeData(this.setPeaks(audioBuffer)))
    },
    setPeaks(audioBuffer) {
      this.duration = audioBuffer.duration

      const numSamples = this.samples
      // const length = audioBuffer.length

      const peaks = []
      let min = 0
      let max = 0

      for (let c = 0; c < audioBuffer.numberOfChannels; c++) {
        const rawData = audioBuffer.getChannelData(c)
        const blockSize = Math.floor(rawData.length / numSamples)

        for (let s = 0; s < numSamples; s++) {
          const blockStart = ~~(s * blockSize)
          const blockEnd = ~~(blockStart + blockSize)
          min = 0
          max = 0
          for (let i = blockStart; i < blockEnd; i++) {
            min = rawData[i] < min ? rawData[i] : min
            max = rawData[i] > max ? rawData[i] : max
          }
          // merge multi channel data (find min and max value)
          if (peaks[s]) {
            peaks[s][0] = peaks[s][0] < max ? max : peaks[s][0]
            peaks[s][1] = peaks[s][1] > min ? min : peaks[s][1]
          }
          peaks[s] = [max, min]
        }
      }
      return peaks
    },
    normalizeData(peaks) {
      // set peaks relativelly to dimensions
      let min = 0
      let max = 0
      let top = 0
      let bottom = 0
      const height = this.height

      for (let i = 0; i < peaks.length; i++) {
        max = peaks[i][0]
        min = peaks[i][1]
        top = height / 2 - (max * height) / 2
        bottom = height / 2 - (min * height) / 2
        peaks[i] = [top, bottom === top ? top + 1 : bottom]
      }
      this.peaks = peaks
      return peaks
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
