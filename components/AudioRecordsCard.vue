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
                      {{ index + 1 }}. {{ record.title }}
                    </h2>
                    <p class="text-sm-left body-1">{{ record.description }}</p>
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
                      {{ index + 1 }}. {{ record.title }}
                    </h2>
                  </div>
                  <vue-wave-surfer
                    v-show="showPlayer && selectedPlayer == index + 1"
                    :ref="`surf${index}`"
                    :src="record.url"
                    :options="vwsOptions"
                    class="vue-wave-surfer col"
                  ></vue-wave-surfer>
                  <!--
                  <div v-show="showPlayer && selectedPlayer == index + 1">
                    <av-waveform
                      :audio-src="record.url"
                      playtime-line-color="#aedeff"
                      playtime-slider-color="#aedeff"
                      playtime-clickable
                      class="av-waveform"
                    ></av-waveform>
                  </div>
                  -->
                </v-layout>
              </v-container>
              <!--
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="secondary"> Cancel </v-btn>
                <v-btn text color="primary"> Save </v-btn>
              </v-card-actions>
              -->
            </li>
          </ul>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
export default {
  name: 'AudioRecordsCard',
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
      playlistExpandedMode: false,
      showPlayer: false,
      selectedPlayer: -1,
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
      if (this.selectedPlayer !== -1) {
        const ref = `surf${this.selectedPlayer - 1}`
        console.log('ref:', ref)
        console.log('this.$refs:', this.$refs)
        const waveSurfer = this.$refs[ref][0].waveSurfer
        console.log('waveSurfer:', waveSurfer)
        return waveSurfer
      }
      return undefined
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
    if (this.player) {
      this.player.on('ready', () => {
        console.log('ready')
      })
    }
  },
  methods: {
    play(record, index) {
      this.showPlayer = !this.showPlayer
      this.selectedPlayer = this.showPlayer ? index + 1 : -1

      this.$nextTick(() => {
        this.$forceUpdate()
      })
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
</style>
