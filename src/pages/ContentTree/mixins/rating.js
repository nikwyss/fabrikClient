import { mapActions } from "vuex"
import api from "src/utils/api"
import { runtimeStore } from "src/store/runtime.store";

export default {
  name: "ContentRatingSlider",
  props: ["content"],
  data: function () {
    return {
      progression_rating: null,
    }
  },

  methods: {
    setRating: function (rating, lagged = false) {


      console.log("set rating...");
      console.assert(rating !== null && rating !== undefined);
      console.assert(this.content.content.id);
      // var assemblyIdentifier = runtimeStore.runtimeStore.assemblyIdentifier;

      // TODO: is thiss necessary? (at least not in case of the slider => model variable)
      this.progression_rating = rating;
      console.log("...=> api")
      api.setContentRating(
        runtimeStore.assemblyIdentifier,
        this.content.content.id,
        rating
      )
        .then((response) => {
          console.log("Rating saved");

          // update content, if necessary!
          if (response.data.modified_contents) {
            this.update_contents({
              modifiedContents: response.data.modified_contents,
            });
          }

          // notify success, if desired...
          if (!lagged) {
            // only give feedback, if action has not been lagged
            const message = this.$i18n.t('contenttree.rating_response')
            this.$q.notify({
              type: response.data.OK ? "nFabrikInfo" : "nFabrikError",
              message: message,
            });
          }
        })

        // Error Handling is done in Axios Interceptor
        .catch((error) => {
          console.warn("Request Error", error);
          this.$q.notify({
            type: "nFabrikError",
            message: 'Oha. Die Bewertung konnte nicht gespeichert werden!',
          })
        })
    },

    ...mapActions('contentstore', ['update_contents', 'update_rating'])
  },

  mounted: function () {
    if (this.content && this.content.progression) {
      this.progression_rating = this.content.progression.rating
    }
  }
}