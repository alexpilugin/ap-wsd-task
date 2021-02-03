<template>
  <section class="container">
    <v-card>
      <v-card-title primary-title>
        <AvSVG2
          :audio-src="`/${record.url}`"
          :play="play"
          @ontimeline="onUpdate"
        />
        <div>
          <!-- <AvWave :audio-src="`/${record.url}`" /> -->
          <br />
        </div>
        <div class="d-flex text-left">
          <v-img
            max-width="180"
            class="ma-2"
            :src="imgUrl"
            :lazy-src="imgUrl"
            contain
          ></v-img>
          <div class="ml-3">
            <h3
              class="click-play headline blue-color mb-0"
              @click="clickAndPlay"
            >
              <span> {{ title }} ({{ duration }}/{{ currentTime }})</span>
            </h3>
            <h4 class="subtitle-1 blue-color mb-0">
              <span> {{ albumName }}</span>
            </h4>
            <div class="text-left">{{ description }}</div>
          </div>
        </div>
        <v-spacer></v-spacer>

        <!-- TAGS --->
        <div class="text-sm-left">
          <v-chip
            v-for="(tag, n) in record.tags"
            :key="`tag-${n}`"
            tags
            outlined
            small
            color="primary"
            class="ma-1"
            >{{ tag }}</v-chip
          >
        </div>
        <v-spacer></v-spacer>
        <div class="text-sm-left text-caption mt-5">
          <h4>FREE License with Attribution</h4>
          <h4>
            Free Audio file from
            <a href="https://www.bensound.com">www.bensound.com</a>
          </h4>
          <p>
            You are free to use this music in your multimedia project (online
            videos(YouTube,...), websites, animations, etc.) as long as you
            credit Bensound.com, For example: "Music: www.bensound.com" or
            "Royalty Free Music from Bensound"
          </p>
        </div>
      </v-card-title>

      <v-card-actions class="pa-3">
        Rate this record
        <v-spacer></v-spacer>
        <v-icon>mdi-star-outline</v-icon>
        <v-icon>mdi-star-outline</v-icon>
        <v-icon>mdi-star-outline</v-icon>
        <v-icon>mdi-star-outline</v-icon>
        <v-icon>mdi-star-outline</v-icon>
      </v-card-actions>
    </v-card>
    <!--
    <div>
      <nuxt-link class="button" to="/"> Records </nuxt-link>
    </div>
    -->
  </section>
</template>

<script>
import AvSVG2 from '@/components/AvSVG2.vue'

export default {
  name: 'RecordPage',
  components: {
    AvSVG2,
  },
  async asyncData({ params, error, $http }) {
    const data = await $http.$get(
      `/api/records/${params.album}/${params.record}`
    )
    const record = JSON.parse(data)
    return {
      record,
    }
  },
  data() {
    return {
      play: false,
      duration: '',
      currentTime: '',
    }
  },
  computed: {
    title: {
      cache: false,
      get() {
        return this.record ? this.record.title : ''
      },
    },
    description() {
      return this.record ? this.record.description : ''
    },
    albumName() {
      return this.record ? this.record.listTitle : ''
    },
    imgUrl() {
      return this.record ? `/${this.record.image.url}` : ''
    },
  },
  methods: {
    clickAndPlay() {
      console.log('clickAndPlay')
      this.play = !this.play
    },
    onUpdate(payload) {
      this.duration = payload.duration
      this.currentTime = payload.currentTime
    },
  },
  head() {
    return {
      title: this.title,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: `hid-${this.$route.params.album}-${this.$route.params.record}`,
          name: `audio ${this.title}`,
          content: `${this.description}`,
        },
      ],
    }
  },
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
}
.title {
  margin-top: 30px;
}
.info {
  font-weight: 300;
  color: #9aabb1;
  margin: 0;
  margin-top: 10px;
}
.button {
  margin-top: 30px;
}
.blue-color {
  color: #aedeff;
}
.play-top-title {
  background: #333;
}
.click-play {
  cursor: pointer;
  font-weight: bold;
}
</style>
