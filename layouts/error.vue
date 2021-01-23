<template>
  <section class="container">
    <div>
      <nuxt-link to="/">
        <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      </nuxt-link>
      <h1 v-if="error.statusCode === 404" class="title">
        {{ error.statusCode }} {{ pageNotFound }}
      </h1>
      <h1 v-else>{{ error.statusCode }} {{ otherError }}</h1>
      <h2 class="info">
        {{ error.message }}
      </h2>
      <nuxt-link class="button" to="/">Homepage</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped lang="scss">
@import '~/assets/sass/variables.scss';

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: $color-progress-bar-green;
  letter-spacing: 1px;
}
.info {
  font-weight: 300;
  color: $color-white;
  margin: 0;
  padding: 10px 20px;
  border-radius: 20px;
}
.button {
  margin-top: 50px;
}
</style>
