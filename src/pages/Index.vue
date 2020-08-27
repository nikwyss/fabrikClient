<template>
  <q-page class="doc_content">
    <div align="center">
      <ArtificialModeratorIndexPage />
    </div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import ArtificialModeratorIndexPage from 'src/artificialmoderation/IndexPage'
import PublicIndex from "./Assembly/mixins/public_index"

export default Vue.extend({
  name: 'PageIndex',
  mixins: [PublicIndex],
  components: { ArtificialModeratorIndexPage },
  mounted: function () {

    // reload public index...

    // TEST REMOVE
    console.log(process.env.VUE_APP_OAUTH_PROFILES)
    console.log(Object.entries(process.env))

  }
})
</script>
