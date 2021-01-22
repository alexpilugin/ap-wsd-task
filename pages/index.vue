<template>
  <v-row justify="center" align="center">
    <v-col cols="12" sm="8" md="6">
      <VuetifyCard />
    </v-col>
  </v-row>
</template>

<script>
import VuetifyCard from '~/components/VuetifyCard.vue'

export default {
  components: {
    VuetifyCard,
  },
}
</script>
