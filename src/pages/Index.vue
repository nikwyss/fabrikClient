<template>
  <q-page class="doc_content">
    <div align="center">
      <ArtificialModeratorIndexPage />
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import ArtificialModeratorIndexPage from "src/artificialmoderation/IndexPage"
import PublicIndex from "src/mixins/publicIndex"

export default Vue.extend({
  name: 'PageIndex',
  mixins: [PublicIndex],
  components: { ArtificialModeratorIndexPage }
})
</script>
