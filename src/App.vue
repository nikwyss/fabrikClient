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

<script lang="ts">
import { mapActions } from 'vuex'

export default {
  name: 'App',
  mounted: function () {
    this.touch_random_seed()
  },
  methods: {
    ...mapActions({
      touch_random_seed: 'assemblystore/touch_random_seed'
    })
  }
}
</script>
