<template>
  <div class="text-center ml-3">
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text dark v-bind="attrs" style="width: 230px" v-on="on">
          {{ selected }}
          <v-icon right>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="onClick(item, index)"
        >
          <v-list-item-title>{{ item }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'Dropdown',
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
    selectedIndex: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    selected: '',
  }),
  watch: {
    selectedIndex(val) {
      if (this.items && this.items.length) {
        this.selected = this.trim(this.items[val])
      }
    },
    items(values) {
      if (values && values.length) {
        this.selected = this.trim(this.items[this.selectedIndex])
      }
    },
  },
  mounted() {
    if (this.items && this.items.length) {
      this.selected = this.trim(this.items[this.selectedIndex])
    }
  },
  methods: {
    onClick(item, index) {
      this.selected = this.trim(item)
      this.$emit('selected', index)
    },
    trim(text) {
      return text.length < 16 ? text : text.substring(0, 16) + '..'
    },
  },
}
</script>
