<template>

      <!-- Background Popup -->
      <q-btn flat round dense icon="mdi-calculator-variant-outline" 
        size="sm"
      >
        <q-tooltip>{{$t('contenttree.toolbar.show_background')}}</q-tooltip>
        <q-popup-edit v-model="obj" ref="contentpopup">
            <q-icon 
              name="mdi-close" 
              class="cursor-pointer"
              size="sm"
              style="float:right; padding:0.3em;" 
              @click="$refs.contentpopup.cancel()"/>

          <div class="q-pa-md doc-contenttree" width="400px">
              <q-badge color="blue">Authors</q-badge>
              <div class="row items-start">
                <div class="col-7">Created</div>
                <div class="col-5">@APS202 at Monday, 2020</div>
              </div>
              <div class="row items-start">
                <div class="col-7">Revisions</div>
                <div class="col-5">
                  @APS202 20.02.2020<br>
                  @EPU111 20.02.2020</div>
              </div>
          </div>
          <div class="q-pa-md doc-contenttree" width="400px">
              <q-badge color="blue">Peer Review</q-badge>
              <div class="row items-start">
                <div class="col-7">Acceptance:</div>
                <div class="col-5">70%</div>
              </div>
              <div class="row items-start">
                <div class="col-7">Reviewers:</div>
                <div class="col-5">3</div>
              </div>
            </div>
          <div class="q-pa-md doc-contenttree" width="400px">
              <q-badge color="blue">Overall Interactions</q-badge>
              <div class="row items-start">
                <div class="col-7">Viewed:</div>
                <div class="col-5">1000x times</div>
              </div>
              <div class="row items-start">
                <div class="col-7">Open Rating:</div>
                <div class="col-5">60 times</div>
              </div>
              <div class="row items-start">
                <div class="col-7">Rate average:</div>
                <div class="col-5">2.3 (1-3)</div>
              </div>
            </div>
        </q-popup-edit>
      </q-btn>
</template>

<script>

// import {mapActions} from 'vuex'
// import ApiService from "src/utils/xhr";
// import Configuration from 'src/utils/configuration'

export default{
  name: "ContentRating",
  props: ["obj"],
  methods: {

  },

  mounted: function () {

  }
}

</script>
