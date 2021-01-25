<template>
  <v-card>
    <v-card-title class="play-top-title headline blue-color" color="#AEDEFF">
      <span>Playlist Manager</span>
      <v-spacer></v-spacer>
      <v-btn
        color="secondary"
        fab
        text
        x-small
        dark
        @click="playlistExpandedMode = !playlistExpandedMode"
      >
        <v-icon v-if="playlistExpandedMode">mdi-card-text</v-icon>
        <v-icon v-else>mdi-card-text-outline</v-icon>
      </v-btn>
    </v-card-title>

    <div v-if="selectedAudioRecord">
      <div class="info-container">
        <v-img
          max-width="120"
          class="ma-2"
          :src="selectedAudioRecord.image.url"
          :lazy-src="selectedAudioRecord.image.url"
          contain
        ></v-img>
        <div class="ml-2">
          <h2 class="text-left title blue-color">
            <router-link
              :to="`/album/${selectedAudioRecord.listId}/audio/${selectedAudioRecord.id}`"
              class="ma-0 pa-0"
            >
              {{ selectedAudioRecord.title }}
            </router-link>
          </h2>
          <p class="text-left body-1">
            {{ selectedAudioRecord.description }}
          </p>
        </div>
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
      </div>
      <v-layout row wrap>
        <v-col ref="avwrap" v-resize="onResize">
          <!-- <AudioCanvas :max-height="100" /> -->
          <AvPlayer
            :audio-src="selectedAudioRecord.url"
            :play="isPlaying"
            wave-color="#AEDEFF"
            :segment-quantity="80"
            played-line-color="#AEDEFF"
            noplayed-line-color="#1A67C0"
          />
        </v-col>
      </v-layout>
    </div>

    <!-- Expansion Panel -->
    <v-expansion-panels v-model="expandedPanels" multiple>
      <v-expansion-panel v-for="(list, i) in lists" :key="i">
        <v-expansion-panel-header class="subheading">
          <div class="text-xs-center text-sm-left">
            <span>{{ list.title }}</span>
            <v-badge left color="primary" style="margin-left: 35px">
              <template v-slot:badge>
                <span>{{ list.records.length }}</span>
              </template>
            </v-badge>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <ul class="audio-record-list">
            <li
              v-for="(record, index) in list.records"
              :key="`r-${index}`"
              class="audio-record"
            >
              <v-container
                v-if="playlistExpandedMode"
                fill-height
                fluid
                class="mx-0 px-0"
              >
                <v-layout align-content-center justify-start fill-height>
                  <div class="d-flex align-center">
                    <v-btn
                      class="mx-2"
                      outlined
                      fab
                      dark
                      x-small
                      color="primary"
                    >
                      <v-icon dark> mdi-play </v-icon>
                    </v-btn>
                  </div>
                  <v-img
                    max-width="80"
                    class="ma-2"
                    :src="record.image.url"
                    :lazy-src="record.image.url"
                    contain
                  ></v-img>
                  <div class="ml-2">
                    <h2 class="text-sm-left title blue-color">
                      <router-link
                        :to="`/album/${record.listId}/audio/${record.id}`"
                        class="record-link ma-0 pa-0"
                      >
                        {{ index + 1 }}. {{ record.title }}
                      </router-link>
                    </h2>
                    <p class="text-sm-left body-1">{{ record.description }}</p>
                  </div>
                </v-layout>
              </v-container>

              <v-container v-else fill-height fluid class="mx-0 px-0">
                <v-layout align-content-center justify-start fill-height>
                  <div class="d-flex align-center">
                    <v-btn
                      class="mx-2"
                      outlined
                      fab
                      dark
                      x-small
                      color="primary"
                      @click="play(record, index)"
                    >
                      <v-icon dark> mdi-play </v-icon>
                    </v-btn>
                  </div>
                  <div class="ml-2">
                    <h2
                      class="text-sm-left title blue-color col"
                      style="width: auto"
                    >
                      <router-link
                        :to="`/album/${record.listId}/audio/${record.id}`"
                        class="record-link ma-0 pa-0"
                      >
                        {{ index + 1 }}. {{ record.title }}
                      </router-link>
                    </h2>
                  </div>
                </v-layout>
              </v-container>
            </li>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
// import AudioCanvas from '@/components/AudioCanvas.vue'
import AvPlayer from '@/components/AvPlayer.vue'
export default {
  name: 'AudioRecordsCard',
  components: {
    // AudioCanvas,
    AvPlayer,
  },
  /* asyncData() not available on Components
   * https://nuxtjs.org/docs/2.x/features/data-fetching/
   */
  async fetch() {
    /* fetch() is a special Nuxt.js function which used on both sides: serverside and userside */
    const data = await this.$http.$get('/api/records')
    this.lists = JSON.parse(data).lists
    /*
    this.lists = await fetch('https://api.nuxtjs.dev/posts').then((res) =>
      res.json()
    )
    */
  },
  data() {
    return {
      playerW: undefined,
      playerH: undefined,
      playlistExpandedMode: false,
      isPlaying: false,
      selectedAudioRecord: null,
      // https://wavesurfer-js.org/docs/options.html
      vwsOptions: {
        normalize: true,
        partialRender: true,
        responsive: true,
        fillParent: true,
        mediaType: 'audio',
        removeMediaElementOnDestroy: false,
      },
      expandedPanels: [],
      lists: [],
    }
  },
  computed: {
    player() {
      return this.$refs.surf ? this.$refs.surf.waveSurfer : undefined
    },
  },
  watch: {
    player(waveSurfer, previous) {
      // https://wavesurfer-js.org/docs/methods.html
      if (waveSurfer) {
        waveSurfer.on('ready', () => {
          waveSurfer.play()
          console.log('waveSurfer.play')
        })
      } else if (previous) {
        previous.stop()
      }
    },
  },
  mounted() {
    if (this.$refs.avwrap) {
      this.onResize()
    }
  },
  methods: {
    onResize(event) {
      const avWraper = this.$refs.avwrap
      this.playerW = Math.floor(avWraper.clientWidth)
      this.playerH = Math.floor(this.playerW / 10) // ratio
      console.log('resized() W:', this.playerW, 'H:', this.playerH)
    },
    play(record, index) {
      // check if it's playing already
      if (this.isPlaying) {
        // check if it's the same audio
        if (
          !!this.selectedAudioRecord &&
          this.selectedAudioRecord.id === record.id
        ) {
          this.isPlaying = false
          this.selectedAudioRecord = null
        } else {
          // continue playing but another audio
          this.selectedAudioRecord = record
        }
      } else {
        // start playing audio
        this.isPlaying = true
        this.selectedAudioRecord = record
      }

      /*
      if (this.selectedPlayer !== -1) {
        // check if it's the same button
        if(this.selectedPlayer == index + 1) {
          this.showPlayer = !this.showPlayer
        }
      }
      this.selectedPlayer = this.showPlayer ? index + 1 : -1

      this.$nextTick(() => {
        this.$forceUpdate()
      })
      */
    },
  },
  /* call fetch only on client-side
   * fetchOnServer: false
   */
}
</script>

<style scoped>
ul {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.audio-record:not(:last-child) {
  border-bottom: solid 1px #333;
}
.blue-color {
  color: #aedeff;
}
.av-waveform > audio {
  visibility: hidden;
}
.play-top-title {
  background: #333;
}
.info-container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
}
.record-link {
  text-decoration: none !important;
  color: #aedeff;
}
</style>
