import { mapActions } from "vuex";
import ApiService from "src/utils/xhr";
// import Configuration from 'src/utils/configuration'

export default {
  name: "ContentRatingSlider",
  props: ["content"],
  data: function () {
    return {
      progression_rating: null,
    }
  },

  methods: {
    setRating: function (rating) {

      console.log("set rating...");
      console.assert(rating !== null && rating !== undefined);
      console.assert(this.content.content.id);
      var identifier = this.$route.params.assemblyIdentifier;
      console.assert(identifier);
      this.progression_rating = rating;

      let url = `${process.env.ENV_APISERVER_URL}/assembly/${identifier}/content/${this.content.content.id}/rating/${rating}`;
      console.log(url);
      console.log("xhr request");
      const message = this.$i18n.t('contenttree.rating_response')
      ApiService.get(url).then((response) => {
        // store changed contents to vuex
        if (response.data.OK) {
          console.log("rating received");
          console.log(response.data);
          if (response.data.modified_contents) {
            this.update_contents({
              modifiedContents: response.data.modified_contents,
            });
          }
        }

        console.log("rating response? ", response.data.OK)
        this.$q.notify({
          type: response.data.OK ? "nFabrikInfo" : "nFabrikError",
          message: message,
        });
      });
    },

    ...mapActions({
      update_contents: "contentstore/update_contents",
    }),
  },

  mounted: function () {
    if (this.content && this.content.progression) {
      this.progression_rating = this.content.progression.rating
    }
  }
}