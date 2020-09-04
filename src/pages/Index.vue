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
import PublicIndex from "./Assembly/mixins/publicIndex"
import Configuration from 'src/utils/configuration'

export default Vue.extend({
  name: 'PageIndex',
  mixins: [PublicIndex],
  components: { ArtificialModeratorIndexPage },
  mounted: function(){
    //console.log(process.env.VUE_ROUTER_MODE)
  }
})
</script>
