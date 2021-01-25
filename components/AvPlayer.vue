<template>
  <div ref="avplayer" class="avplayer">
    <canvas ref="canvas" class="responsive-canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: 'AvPlayer',
  props: {
    audioSrc: {
      type: String,
      default: null,
    },
    audioRef: {
      type: String,
      default: null,
    },
    audioControls: {
      type: Boolean,
      default: false,
    },
    audioClass: {
      type: String,
      default: null,
    },
    canvWidth: {
      type: Number,
      default: 500,
    },
    canvHeight: {
      type: Number,
      default: 80,
    },
    play: {
      type: Boolean,
      default: false,
    },
    /**
     * prop: 'noplayed-line-color'
     * Waveform line color for not yet played segment of audio
     * Default: lime
     */
    noplayedLineColor: {
      type: String,
      default: 'lime',
    },
    /**
     * prop: 'played-line-color'
     * Waveform line color for played segment of audio
     * Default: navy
     */
    playedLineColor: {
      type: String,
      default: 'navy',
    },
    segmentQuantity: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      audio: null,
      animId: null,
      ctxWrapper: null,
      ctx: null,
      duration: null,
      peaks: [],
      responsive: true,
      width: this.canvWidth,
      height: this.canvHeight,
      isPlaying: false,
    }
  },
  watch: {
    audioSrc(val) {
      this.load(this.audio)
      this.$forceUpdate()
    },
    canvWidth(val) {
      this.$forceUpdate()
    },
    canvHeight(val) {
      this.$forceUpdate()
    },
    play(val) {
      this.isPlaying = val
      if (val) {
        console.log('play audio', this.audio)
        if (this.audio) this.audio.play()
      } else if (this.audio) this.audio.pause()
    },
  },
  mounted() {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight
    this.createHTMLElements().then((audio) => {
      this.load(audio).then((isReady) => {
        audio.play()
      })
    })
  },
  methods: {
    /**
     * Create audio and canvas elements and insert in the HTML template.
     * Using document.createElement to avoid Vue virtual DOM re-rendering
     * which can lead to infinit loops.
     */
    createHTMLElements() {
      const self = this
      return new Promise(function (resolve) {
        const canv = self.$refs.canvas

        /*
        if (self.responsive) {
          canv.setAttribute('width', canv.clientWidth)
          canv.setAttribute('height', canv.clientHeight)
        }
        */

        let audioDiv = null
        let audio = null

        if (self.audioRef) {
          audio = self.$parent.$refs[self.refLink]
        } else {
          audio = document.createElement('audio')
          audioDiv = document.createElement('div')
          audio.setAttribute('src', self.audioSrc) // src: url
          audio.setAttribute('ref', 'audio')
          audio.setAttribute('auto', true)

          if (self.audioControls) audio.setAttribute('controls', true)
          if (self.audioClass) audio.setAttribute('class', self.audioClass)

          audioDiv.appendChild(audio)
          self.$el.appendChild(audioDiv)
        }
        if (self.canvClass) canv.setAttribute('class', self.canvClass)
        if (self.canvWidth) {
          canv.setAttribute('width', self.canvWidth)
        } else {
          canv.setAttribute('width', this.$el.clientWidth)
        }
        if (self.canvHeight) {
          canv.setAttribute('height', self.canvHeight)
        } else {
          canv.setAttribute('height', this.$el.clientHeight)
        }

        self.ctxWrapper = canv
        self.ctx = canv.getContext('2d')

        self.audio = audio
        self.audio.load()
        resolve(audio)
      })
    },
    /**
     * Load audio data
     */
    load(audioPlayer) {
      const self = this
      return new Promise(function (resolve) {
        const config = {
          responseType: 'arraybuffer',
          onDownloadProgress: self.downloadProgress,
        }
        self.$axios
          .get(audioPlayer.src, config)
          .then((response) => self.decode(response.data))
          .catch((err) => {
            console.error(`Failed to get file '${audioPlayer.src}'`)
            console.log(err)
          })

        audioPlayer.onplay = () => {
          self.animId = requestAnimationFrame(self.waveformAnim)
        }
        audioPlayer.onpause = () => {
          cancelAnimationFrame(self.animId)
          self.animId = null
        }
        resolve(true)
      })
    },
    /**
     * Audio source download progress
     */
    downloadProgress(ev) {
      const progressX = Math.round((ev.loaded / ev.total) * this.canvWidth)
      this.ctx.clearRect(0, 0, this.canvWidth, this.canvHeight)
      this.ctx.beginPath()
      this.ctx.strokeStyle = this.noplayedLineColor
      this.ctx.moveTo(0, this.canvHeight / 2)
      this.ctx.lineTo(progressX, this.canvHeight / 2)
      this.ctx.stroke()
    },
    /**
     * Waveform animation proxy
     */
    waveformAnim() {
      this.waveform()
      this.animId = requestAnimationFrame(this.waveformAnim)
    },
    /**
     * Decode audio source response array buffer
     */
    decode(response) {
      const self = this
      const audioContext = new AudioContext()
      audioContext
        .decodeAudioData(response)
        .then(function (audioBuffer) {
          self.setPeaks(audioBuffer)
        })
        .catch((err) => {
          console.error('Failed to decode audio data.')
          console.log(err)
        })
    },
    /**
     * Set peaks array for waveform.
     * For now use only one channel
     */
    setPeaks(buffer) {
      const peaks = []
      let min = 0
      let max = 0
      let top = 0
      let bottom = 0
      console.log(
        'buffer.length ',
        buffer.length,
        'this.canvWidth',
        this.canvWidth
      )
      const segSize = Math.ceil(buffer.length / this.canvWidth)
      const width = this.canvWidth
      const height = this.canvHeight
      this.duration = buffer.duration // while we have buffer why we don't use it ?

      for (let c = 0; c < buffer.numberOfChannels; c++) {
        const data = buffer.getChannelData(c)
        for (let s = 0; s < width; s++) {
          const start = ~~(s * segSize)
          const end = ~~(start + segSize)
          min = 0
          max = 0
          for (let i = start; i < end; i++) {
            min = data[i] < min ? data[i] : min
            max = data[i] > max ? data[i] : max
          }
          // merge multi channel data
          if (peaks[s]) {
            peaks[s][0] = peaks[s][0] < max ? max : peaks[s][0]
            peaks[s][1] = peaks[s][1] > min ? min : peaks[s][1]
          }
          peaks[s] = [max, min]
        }
      }
      // set peaks relativelly to canvas dimensions
      for (let i = 0; i < peaks.length; i++) {
        max = peaks[i][0]
        min = peaks[i][1]
        top = height / 2 - (max * height) / 2
        bottom = height / 2 - (min * height) / 2
        peaks[i] = [top, bottom === top ? top + 1 : bottom]
      }
      this.peaks = peaks

      console.log('peaks', peaks.length)

      if (this.playtimeClickable) {
        this.ctxWrapper.addEventListener('click', (e) => this.updateTime(e))
      }
      this.waveform()
    },
    /**
     * Draw wave form.
     */
    waveform() {
      // this.ctx.fillStyle = this.waveColor
      const peaks = this.peaks
      const time = this.audio.currentTime
      const playX = this.playX(time)
      let x = 0
      this.ctx.clearRect(0, 0, this.canvWidth, this.canvHeight)
      x = this.draw(
        peaks.slice(0, playX),
        this.playedLineWidth,
        this.playedLineColor,
        x
      )
      this.draw(
        peaks.slice(playX),
        this.noplayedLineWidth,
        this.noplayedLineColor,
        x
      )
      this.drawSlider(time)
      if (this.playtime) this.drawTime(time)
    },
    /**
     * Draw segment.
     */
    draw(data, lineWidth, color, x) {
      this.ctx.fillStyle = '#f00'
      this.ctx.lineWidth = lineWidth
      this.ctx.strokeStyle = color
      this.ctx.beginPath()
      data.forEach((v) => {
        this.ctx.moveTo(x, v[0])
        this.ctx.lineTo(x, v[1])
        x++
      })
      this.ctx.stroke()
      return x
    },
    /**
     * Formatted string of current play time.
     * @param {Number} Current play time
     * @return {String}
     */
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
    /**
     * Draw play time next to slider.
     * @param {Number} Played time sec.millisec.
     * @return {Void}
     */
    drawTime(time) {
      const timeStr = this.timeFormat(time)
      const offset = 3
      const textWidth = ~~this.ctx.measureText(timeStr).width
      const playX = this.playX(time)
      const textX =
        playX > this.canvWidth - textWidth - offset
          ? playX - textWidth - offset
          : playX + offset
      const textY = this.playtimeTextBottom
        ? this.canvHeight - this.playtimeFontSize + offset
        : this.playtimeFontSize + offset
      this.ctx.fillStyle = this.playtimeFontColor
      this.ctx.font = `${this.playtimeFontSize}px ${this.playtimeFontFamily}`
      this.ctx.fillText(timeStr, textX, textY)
    },
    /**
     * Draw played slider.
     * @param {Number} Played time sec.millisec.
     * @return {Void}
     */
    drawSlider(time) {
      const playX = this.playX(time)
      this.ctx.lineWidth = this.playtimeSliderWidth
      this.ctx.strokeStyle = this.playtimeSliderColor
      this.ctx.beginPath()
      this.ctx.moveTo(playX, 0)
      this.ctx.lineTo(playX, this.canvHeight)
      this.ctx.stroke()
    },
    /**
     * Get x coodrinate for play time.
     * @param {Number}
     * @return {Number}
     */
    playX(time) {
      return ~~((time / this.duration) * this.canvWidth)
    },
    /**
     * Audio playback update time callback.
     * @param event
     */
    updateTime(e) {
      this.audio.currentTime = (e.offsetX / this.canvWidth) * this.duration
      if (!this.animId) {
        // re-draw if animation is not running
        this.waveform()
      }
    },
  },
}
</script>

<style scoped>
.responsive-canvas {
  margin: 10px;
  box-sizing: border-box;
}
</style>
