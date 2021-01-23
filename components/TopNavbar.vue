<template>
  <div>
    <v-app-bar app class="app-bar elevation-0" height="58px">
      <v-container class="top-bar-content d-flex align-center ma-0 pa-0">
        <router-link to="/" class="nw-brand-logo ma-0 pa-0">
          <VuetifyLogo />
        </router-link>
        <v-toolbar-title v-text="title" />
      </v-container>
      <v-spacer></v-spacer>
    </v-app-bar>
  </div>
</template>

<script>
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  name: 'NavBar',
  components: {
    VuetifyLogo,
  },
  data() {
    return {
      title: 'AP WSD Task',
      isDropped: false,
      ssW: '9.5vw',
    }
  },
}
</script>

<style scoped lang="scss">
@import '~/assets/sass/variables.scss';

.app-bar {
  height: 88px;
  display: flex;
  align-items: center;
  padding-top: -10px;

  .v-toolbar__content {
    height: 64px;
    margin-left: auto;
    margin-right: auto;
    padding-right: 0.75rem;
    padding-left: 0.75rem;
    max-width: 1140px;

    .top-bar-content {
      color: $color-white;
    }
  }

  .top-btn {
    text-transform: capitalize;
    color: black;
    font-size: 1.1rem !important;
  }
}
</style>
