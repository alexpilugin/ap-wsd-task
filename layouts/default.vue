<template>
  <v-app dark>
    <TopNavbar />
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; A.Pilugin {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import TopNavbar from '@/components/TopNavbar.vue'
export default {
  name: 'DefaultLayout',
  components: {
    TopNavbar,
  },
}
</script>
