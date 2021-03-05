// import StageMixin from 'src/mixins/stage'
import { mapGetters } from 'vuex'
import { runtimeStore } from "src/store/runtime.store"


export default {
  data() {
    return {
    }
  },

  computed: {

    routed_stage: function () {
      console.assert(runtimeStore.stageID)

      if (this.assembly_stages) {
        return null
      }

      console.log("STAGE IS LOADED", runtimeStore.stageID, this.assembly_stages)
      return (this.assembly_stages[runtimeStore.stageID])
    },

    groups() {
      return Object.keys(this.stages_by_groups)
    },

    stages_by_groups() {
      const stages_by_groups = {}
      if (!this.assembly_stages) {
        // console.log("empty this.assembly_stages")
        return null
      }

      Object.values(this.assembly_stages).forEach(stage => {
        if (!stages_by_groups[stage.stage.group]) {
          stages_by_groups[stage.stage.group] = []
        }
        stages_by_groups[stage.stage.group].push(stage)
      })

      // console.log("stages_by_groups", stages_by_groups)
      return stages_by_groups
    },

    groupsAccessible: function () {
      const groups = this.assembly_accessible_stages.map(stage => stage.stage.group)
      return groups;
    },

    groupsScheduled: function () {
      const groups = this.assembly_scheduled_stages.map(stage => stage.stage.group)
      return groups;
    },

    currentGroup: function () {
      if (!runtimeStore.stageID || !this.routed_stage) {
        return 'preparation'
      }
      return this.routed_stage.stage.group
    },

    ...mapGetters(
      'assemblystore',
      ['assembly_sorted_stages', 'assembly_stages', 'assembly_accessible_stages',
        'assembly_scheduled_stages',
        'assembly_sorted_stages', 'is_stage_accessible', 'next_scheduled_stage']
    )
  },

  methods: {

    is_stage_first_shown(stage) {
      console.assert(stage)
      return stage === this.stages[length(this.stages) - 1]
    },

    is_stage_last_shown(stage) {
      console.assert(stage)
      return stage === this.stages[0]
    },

    getFirstStageIDByGroup: function (group) {
      console.assert(this.stages_by_groups)
      console.assert(this.stages_by_groups[group])
      console.assert(this.stages_by_groups[group][0])
      return this.stages_by_groups[group][0].stage.id
    }
  }
}