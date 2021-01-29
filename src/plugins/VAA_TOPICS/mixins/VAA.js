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


    // GLOBAL CACHE
    // stage_last_visited() {
    //   if (!this.stage_nr_last_visited) {
    //     // cache is empty
    //     return null
    //   }
    //   const stage = this.routed_stage(this.stage_nr_last_visited)
    //   return (stage)
    // },

    // stage_last_visited_type() {
    //   const stage = this.stage_last_visited
    //   return (stage?.stage?.type)
    // },

    sectionsEnabled: function () {
      return ['VAA_TOPICS', 'VAA_QUESTIONS']
    },

    currentSection: function () {
      console.log("ROUTED STAGE", this.routed_stage)
      if (!this.routed_stage) {
        return 'INTRO'
      }

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

    // openSections: function () {
    //   const last_accessible_stage = this.last_accessible_stage
    //   if (!last_accessible_stage) {
    //     // No last accessible stage is found  => probably, all sections are finished
    //     // => Enable all sections
    //     return (this.sections)
    //   }

    //   // Return all sections until the last accesible one.
    //   const last_accessible_stage_section = last_accessible_stage.stage.type
    //   console.log(last_accessible_stage_section)
    //   const sectionIndex = this.sections.indexOf(last_accessible_stage_section)
    //   if (sectionIndex == undefined || sectionIndex == null) {
    //     return ([])
    //   }

    //   console.log("index: " + sectionIndex)
    //   return this.sections.slice(0, sectionIndex + 1)
    // },



    ...mapGetters(
      'assemblystore',
      ['assembly_sorted_stages', 'assemblyIdentifier', 'routed_stage',
        'assembly_sorted_stages', 'is_stage_accessible']
    )
  },

  methods: {
    getFirstStageBySection: function (section) {
      // console.log(section, "ll")
      // console.log(this.assembly_sorted_stages[2].stage.type)
      // const stage = this.assembly_sorted_stages[2]
      // console.log(this.stageTypes[stage.stage.type] == section)
      // console.log(this.stageTypes[stage.stage.type])
      // console.log(section)
      // console.log("START WIHT SECTION: ", section)
      return this.assembly_sorted_stages.find(stage => {
        let type = stage.stage.type
        // console.log(type)
        // console.log(section)
        // console.log(this.stageTypes[type])
        // console.log(this.stageTypes[type] == section)
        return (this.stageTypes[type] == section)
      })
    }
    // isSectionEnabled(section) {
    //   return this.sectionsEnabled.includes(section)
    // },
    // isSectionDisabled(section) {
    //   return !this.sectionsEnabled.includes(section)
    // }
  }
}
