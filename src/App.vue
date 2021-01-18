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
    // console.log(this.$nLength([1,2]))
    console.log("APP mounted...")
  }
}
</script>
