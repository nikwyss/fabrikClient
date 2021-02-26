<template>
  <q-page class="doc_content">

          <div
        align="center"
        style="min-height:20px; margin-top:1em"
      >
        <transition name="transitionlogo">
          <q-img
            :ratio="1"
            style="max-width: 241px; max-height:120px;"
            src="layout/logoweb.png"
          />
        </transition>
      </div>

    <div align="center">
      <ArtificialModeratorIndexPage />
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import ArtificialModeratorIndexPage from "./artificialmoderation/IndexPage"
import PublicMixin from "src/mixins/publicIndex"

export default Vue.extend({
  name: 'PageIndex',
  mixins: [PublicMixin],
  components: { ArtificialModeratorIndexPage }
})
</script>
