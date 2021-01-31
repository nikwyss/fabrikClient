<template>

  <div class="q-pa-md full-width">
    <!-- <q-badge color="secondary">

    </q-badge> -->
      Wie wichtig ist Ihnen dieses Thema? Bitte schieben Sie den Regeler zu einem Wert zwischen 0 und 100?

    <q-list dense>


      <q-separator inset spaced />

      <q-item>
        <q-item-section side>
          <!-- <q-icon name="volume_down" /> -->
        </q-item-section>
        <q-item-section>
         
    <q-slider
      v-model="value"
      :min="min"
      :max="max"
      :step="5"
      snap
      label
      label-always
      color="purple"
    />

        </q-item-section>
        <q-item-section side>
          <!-- <q-icon name="mdi-volume_up" /> -->
        </q-item-section>
      </q-item>

      <q-separator inset spaced />

    </q-list>

  </div>
</template>



<script>
// import { Fragment } from 'vue-fragment'
// import ContentRating from "src/pages/ContentTree/components/ContentRating"
// import ContentEditor from "src/pages/ContentTree/components/ContentEditor"
// import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar"
// import ComponentContentTree from "src/pages/ContentTree/components/ContentTree"



export default {
  name: 'RatingSlider',
  // props: ['item', 'standalone', 'heading_number', 'comments','questions'],
  // questions added for debigging : is it still usefukk?
  // components: { ContentRating, ContentEditor, ContentToolbar, ComponentContentTree},
  data: function() {
    return({
        min: 0,
        max:100,
        value: 50
    })
  },
  // computed: {
  //   header_class: function() {
  //     switch (this.item.content.type) {
  //       case 'SECTION':
  //         return('text-h5')
  //       case 'SUBSECTION':
  //         return('text-h6')
  //       case 'PARAGRAPH':
  //         return('text-h7')
  //     }
  //   },

  //   startingContentNode: function() {
  //    // TODO: add nof_descendants to this node object
  //    // TODO extract this in method...
  //     var node = {
  //       children: this.comments, 
  //       id: this.item.content.id}
  //     return(node)
  //   }
  // }
}
</script>
