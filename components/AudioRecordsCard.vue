<template>
  <v-card>
    <v-card-title class="play-top-title headline blue-color" color="#AEDEFF">
      <!-- <span>Playlist Manager</span> -->
      <v-btn
        color="secondary"
        fab
        text
        small
        dark
        @click="
          playlistExpandedMode = !playlistExpandedMode
          showMode = 'list'
        "
      >
        <v-icon v-if="playlistExpandedMode">mdi-card-text</v-icon>
        <v-icon v-else>mdi-card-text-outline</v-icon>
      </v-btn>
      <v-btn color="secondary" fab text small dark @click="showMode = 'cards'">
        <v-icon>mdi-apps-box</v-icon>
      </v-btn>

      <v-spacer></v-spacer>
      <Dropdown v-if="lists" :items="listNames" @selected="onListSelection" />
      <Dropdown
        v-if="selectedListIndex !== null"
        :items="songNames"
        @selected="onSongSelection"
      />
      <div class="btn-wrapper ml-5">
        <v-btn text @click="clickPrevious">
          <v-icon>mdi-step-backward</v-icon>
        </v-btn>
        <v-btn text @click="isPlaying = !isPlaying">
          <v-icon v-if="isPlaying">mdi-pause-circle</v-icon>
          <v-icon v-else>mdi-play-circle</v-icon>
        </v-btn>
        <v-btn text @click="clickNext">
          <v-icon>mdi-step-forward</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <!-- Player -->
    <div v-if="selectedAudioRecord">
      <div class="info-container mt-5">
        <v-img
          max-width="120"
          class="ma-2"
          :src="selectedAudioRecord.image.url"
          :lazy-src="selectedAudioRecord.image.url"
          contain
        ></v-img>
        <div class="mx-3">
          <h2 class="text-left title blue-color">
            <router-link
              :to="`/album/${selectedAudioRecord.listId}/audio/${selectedAudioRecord.id}`"
              class="ma-0 pa-0"
            >
              {{ selectedAudioRecord.title }}
            </router-link>
            ( {{ duration }} / {{ currentTime }} )
          </h2>
          <p class="text-left body-1">
            {{ selectedAudioRecord.description }}
          </p>
        </div>
        <div class="text-sm-left text-caption mx-3">
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
      <v-layout row wrap class="pa-3">
        <v-col ref="avwrap">
          <AvSVG2
            :audio-src="`/${selectedAudioRecord.url}`"
            :play="isPlaying"
            audio-ref="audio"
            @ontimeline="onUpdate"
          />
          <audio ref="audio" hidden></audio>
        </v-col>
      </v-layout>
    </div>

    <!-- Expansion Panel -->
    <v-expansion-panels
      v-if="showMode == 'list'"
      v-model="expandedPanels"
      multiple
    >
      <v-expansion-panel
        v-for="(list, listIndex) in lists"
        :key="`ex${listIndex}`"
      >
        <v-expansion-panel-header class="subheading">
          <div class="text-xs-center text-sm-left">
            <v-badge left color="primary" style="margin-right: 15px">
              <template v-slot:badge>
                <span>{{ list.records.length }}</span>
              </template>
            </v-badge>
            <span>{{ list.title }}</span>
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
                      @click="play(record, listIndex)"
                    >
                      <v-icon v-if="isPlaying" dark> mdi-pause </v-icon>
                      <v-icon v-else dark> mdi-play </v-icon>
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
                      @click="play(record, listIndex)"
                    >
                      <v-icon
                        v-if="
                          selectedAudioRecord.id === record.id &&
                          isPlaying === true
                        "
                        dark
                      >
                        mdi-pause
                      </v-icon>
                      <v-icon
                        v-if="
                          selectedAudioRecord.id !== record.id ||
                          isPlaying === false
                        "
                        dark
                      >
                        mdi-play
                      </v-icon>
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

    <!-- ShowMode=='cards' -->
    <v-container v-if="showMode == 'cards'" fill-height fluid class="mx-0 px-0">
      <v-layout
        v-for="(list, listIndex) in lists"
        :key="`row${listIndex}`"
        fill-height
        row
      >
        <v-col
          v-for="(record, index) in list.records"
          :key="`vc-${index}`"
          cols="6"
          sm="4"
          lg="3"
        >
          <v-card>
            <v-img
              class="ma-2 record-image"
              :src="record.image.url"
              :lazy-src="record.image.url"
              @click="play(record, listIndex)"
            ></v-img>
            <v-card-title primary-title>
              <div>
                <h2 class="text-sm-left title blue-color">
                  <router-link
                    :to="`/album/${record.listId}/audio/${record.id}`"
                    class="record-link ma-0 pa-0"
                  >
                    {{ index + 1 }}. {{ record.title }}
                  </router-link>
                </h2>
              </div>
            </v-card-title>
          </v-card>
        </v-col>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import AvSVG2 from '@/components/AvSVG2.vue'
import Dropdown from '@/components/Dropdown.vue'

export default {
  name: 'AudioRecordsCard',
  components: {
    AvSVG2,
    Dropdown,
  },
  /* asyncData() not available on Components
   * https://nuxtjs.org/docs/2.x/features/data-fetching/
   */
  /* call fetch only on client-side
   * fetchOnServer: false
   */
  async fetch() {
    /* fetch() is a special Nuxt.js function which used on both sides: serverside and userside */
    const data = await this.$http.$get('/api/records')
    this.lists = JSON.parse(data).lists
    this.selectedAudioRecord = this.lists[0].records[0]
    /*
    this.lists = await fetch('https://api.nuxtjs.dev/posts').then((res) =>
      res.json()
    )
    */
  },
  data() {
    return {
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
      currentTime: '',
      duration: '',
      selectedListIndex: 0,
      selectedSongIndex: 0,
      audioRef: null,
      showMode: 'list',
    }
  },
  computed: {
    listNames() {
      return this.lists.map((list) => list.title)
    },
    songNames() {
      if (this.selectedListIndex !== null) {
        console.log('songNames() listIndex: ', this.selectedListIndex)
        if (this.lists && this.lists.length) {
          return this.lists[this.selectedListIndex].records.map(
            (record) => record.title
          )
        }
      }
      return []
    },
  },
  mounted() {
    if (this.$refs.audio) this.audioRef = this.$refs.audio
  },
  methods: {
    play(record, listIndex) {
      this.selectedListIndex = listIndex
      if (this.selectedAudioRecord.id !== record.id) {
        this.selectedAudioRecord = record
        setTimeout(function () {
          this.isPlaying = true
        }, 250)
      } else {
        this.isPlaying = !this.isPlaying
      }
    },
    clickPrevious() {
      console.log('clickPrevious')
      if (this.lists && this.lists.length) {
        const listIndex = this.selectedListIndex
        const list = this.lists[listIndex]
        const length = list.records.length

        if (this.selectedSongIndex - 1 > -1) {
          this.selectedSongIndex--
        } else {
          this.selectedSongIndex = length - 1
        }
        const songIndex = this.selectedSongIndex
        this.selectedAudioRecord = list.records[songIndex]
        this.isPlaying = false
        setTimeout(function () {
          this.isPlaying = true
        }, 250)
      }
    },
    clickNext() {
      console.log('clickNext')
      if (this.lists && this.lists.length) {
        const listIndex = this.selectedListIndex
        const list = this.lists[listIndex]
        console.log(listIndex)
        const length = list.records.length

        if (this.selectedSongIndex + 1 < length) {
          this.selectedSongIndex++
        } else {
          this.selectedSongIndex = 0
        }
        const songIndex = this.selectedSongIndex
        this.selectedAudioRecord = list.records[songIndex]
        this.isPlaying = false
        setTimeout(function () {
          this.isPlaying = true
        }, 250)
      }
    },
    onUpdate(payload) {
      console.log('onUpdate', payload)
      this.duration = payload.duration
      this.currentTime = payload.currentTime
    },
    onListSelection(payload) {
      this.selectedListIndex = payload
      const songIndex = 0
      this.selectedAudioRecord = this.lists[payload].records[songIndex]
    },
    onSongSelection(payload) {
      this.selectedSongIndex = payload
      const listIndex = this.selectedListIndex
      this.selectedAudioRecord = this.lists[listIndex].records[payload]
    },
  },
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
.btn-wrapper {
  border: solid 1px white;
  border-radius: 4px;
  padding: 0;
}
.record-image {
  opacity: 1;
  transition: opacity 0.5s ease-out;
  -moz-transition: opacity 0.5s ease-out;
  -webkit-transition: opacity 0.5s ease-out;
  -o-transition: opacity 0.5s ease-out;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  cursor: pointer;
}
.record-image:hover {
  opacity: 0.5;
}
</style>
