<template>
  <div id="q-app">
<!-- <template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'App'
})
</script> -->
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
  }
}
</script>
