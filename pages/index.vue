<template>
  <section class="container">
    <v-row align="start" justify="center">
      <v-col cols="12">
        <AudioRecordsCard />
      </v-col>
    </v-row>

    <!--
    <v-row justify="center" align="center">
      <v-col cols="12">
        <div>
          <h1 class="title">nuxt-express</h1>
          <div>
            {{ records }}
            <div class="links">
              <a href="/users" class="button--green"> Users List </a>
            </div>
          </div>
          <div class="links">
            <a
              href="https://nuxtjs.org/"
              target="_blank"
              rel="noopener noreferrer"
              class="button--green"
            >
              Documentation
            </a>
            <a
              href="https://github.com/nuxt/nuxt.js"
              target="_blank"
              rel="noopener noreferrer"
              class="button--grey"
            >
              GitHub
            </a>
          </div>
        </div>
      </v-col>
    </v-row>
    -->
  </section>
</template>

<script>
import AudioRecordsCard from '~/components/AudioRecordsCard.vue'

export default {
  components: {
    AudioRecordsCard,
  },
  /* asyncData() available only on pages */
  async asyncData({ $http }) {
    const test = await $http.$get('/api/test')
    return {
      test,
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
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
