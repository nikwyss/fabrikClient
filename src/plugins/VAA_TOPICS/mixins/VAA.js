// import StageMixin from 'src/mixins/stage'
import { mapGetters, mapState } from 'vuex'


export default {
  data: function () {
    return {
      sections: [
        'INTRO',
        'VAA_QUESTIONNAIRE_TOPICS',
        'VAA_QUESTIONNAIRE_QUESTIONS',
        'VAA_ANALYSES'
      ],
      stageTypes: {
        'VAA_QUESTIONNAIRE_TOPICS': 'VAA_QUESTIONNAIRE_TOPICS',
        'VAA_QUESTIONNAIRE_QUESTIONS': 'VAA_QUESTIONNAIRE_QUESTIONS',
      }
    }
  },


  computed: {

    /** Get Stage from StageID transmitted in the URL  */
    routed_stage_id: function () {
      return (this.$route.params.stageID)
    },

    routed_stage: function () {
      console.assert(this.routed_stage_id)

      if (!this.assembly_stages) {
        console.log('assemmbly is not yet loaded')
        return null
      }

      console.log("STAGE IS LOADED", this.routed_stage_id)
      return (this.assembly_stages[this.routed_stage_id])
    },

    sectionsEnabled: function () {
      return ['VAA_TOPICS', 'VAA_QUESTIONS']
    },

    currentSection: function () {
      if (!this.routed_stage_id) {
        return 'INTRO'
      }
      console.log("ROUTED STAGE", this.routed_stage)
      const type = this.routed_stage.stage.type
      console.assert(type)
      if (type) {
        if (this.stageTypes[type]) {
          return (this.stageTypes[type])
        } else {
          return 'INTRO'
        }
      }
    },

    ...mapGetters(
      'assemblystore',
      ['assembly_sorted_stages', 'assemblyIdentifier', 'assembly_stages',
        'assembly_sorted_stages', 'is_stage_accessible']
    )
  },

  methods: {
    getFirstStageBySection: function (section) {
      if (!this.assembly_sorted_stages) {
        return null
      }

      return this.assembly_sorted_stages.find(stage => {
        let type = stage.stage.type
        return (this.stageTypes[type] == section)
      })
    }
  }
}