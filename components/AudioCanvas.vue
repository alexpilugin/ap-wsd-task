<template>
  <canvas
    ref="canvas"
    v-resize="onResize"
    :style="[hStyle]"
    class="responsive-canvas"
  ></canvas>
</template>

<script>
export default {
  name: 'AudioCanvas',
  props: {
    canvClass: {
      type: String,
      default: null,
    },
    maxHeight: {
      type: Number,
      default: 0,
    },
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
  },
  data() {
    return {
      audio: null,
      w: null,
      h: null,
      hStyle: {
        height: '50px',
      },
    }
  },
  created() {
    if (this.maxHeight > 0) {
      this.hStyle.height = this.maxHeight + 'px'
      this.h = this.maxHeight + 'px'
    } else {
      this.h = 50 + 'px'
      this.hStyle.height = 50 + 'px'
    }
  },
  methods: {
    onResize(event) {
      const canvas = this.$refs.canvas
      this.w = canvas.clientWidth
      this.printDimentions(canvas)
    },

    printDimentions(canvas) {
      if (canvas) {
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = 'black'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'blue'
        ctx.font = 'bold 12px Arial'
        ctx.fillText(`w: ${this.w}, h:${this.h}`, 20, 20)
      }
    },
  },
}
</script>
<style scoped>
.outer {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
}

.responsive-canvas {
  border: solid 2px purple;
  position: relative;
  width: 100%;
  height: auto;
}
</style>
