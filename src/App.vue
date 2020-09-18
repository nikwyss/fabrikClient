<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'App',
  methods: {
    ...mapActions({
      touchRandomSeed: 'assemblystore/touchRandomSeed'
    })
  },
  mounted: function () {
    this.touchRandomSeed()
    console.log("APP mounted...")
  }
}
</script>
