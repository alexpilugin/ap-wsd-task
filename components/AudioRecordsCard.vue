<template>
  <v-card>
    <v-card-title class="headline blue-color" color="#AEDEFF">
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
                    >
                      <v-icon dark> mdi-play </v-icon>
                    </v-btn>
                  </div>
                  <div class="ml-2">
                    <h2 class="text-sm-left title blue-color">
                      {{ index + 1 }}. {{ record.title }}
                    </h2>
                  </div>
                  <div class="ml-2">
                    <av-waveform
                      :audio-src="record.url"
                      playtime-line-color="#aedeff"
                      playtime-slider-color="#aedeff"
                      playtime-clickable
                      class="av-waveform"
                    ></av-waveform>
                  </div>
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
      expandedPanels: [],
      lists: [],
    }
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
</style>
