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
import ArtificialModeratorIndexPage from "src/artificialmoderation/IndexPage"
// import {mapGetters} from 'vuex'

export default Vue.extend({
  name: 'PageIndex',
  components: { ArtificialModeratorIndexPage }
})
</script>
