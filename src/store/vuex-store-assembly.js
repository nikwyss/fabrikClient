/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import { Router } from 'src/router'
import api from 'src/utils/api'
import constants from 'src/utils/constants'
import { LayoutEventBus } from 'src/utils/eventbus.js'
// import { date } from 'quasar'

var state = {
  monitors: {},
  assemblydata: {},
  randomSeed: null,
  current_stages: {}
}

const getters = {

  assemblyIdentifier: (state, getters) => {

    // NEEDED, encforces responsivity of the router params!
    state.monitors.routed_assembly_identifier = Date.now()
    const last_update = state.monitors.routed_assembly_identifier
    void last_update

    return Router.currentRoute.params?.assemblyIdentifier
  },

  assembly: (state, getters) => {

    if (!getters.assemblyIdentifier) {
      return null
    }

    return (state.assemblydata[getters.assemblyIdentifier]?.assembly)
  },

  assemblyName: (state, getters) => {

    if (getters.assembly) {
      return (getters.assembly.title)
    }
  },

  /**
   * oAuth Server delivers user roles in the format "<role>@<assemblyIdentifier>".
   * THis method translates thes roles in a list of acls for the given Assembly.
   * => such as  ['delegate', 'contribute', 'observe']
   */
  assemblyAcls: (state, getters, rootState, rootGetters) => {

    if (!getters.assemblyIdentifier) {
      return null
    }
    const translateAclMethod = rootGetters["publicprofilestore/translateOauthAcls"]
    return translateAclMethod(getters.assemblyIdentifier)
  },

  IsManager: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('manage')
  },
  IsObserver: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('observe')
  },
  IsContributor: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('contribute')
  },
  IsExpert: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('expert')
  },
  IsDelegate: (state, getters) => {
    if (!getters.assemblyAcls) { return null }
    return getters.assemblyAcls.includes('delegate')
  },

  randomLocalStorageSeed: (state) => {
    return (state.randomSeed)
  },

  assembly_configuration: (state, getters) => {
    const assemblyIdentifier = Router.currentRoute.params.assemblyIdentifier
    console.assert(assemblyIdentifier)
    return (state.assemblydata[assemblyIdentifier]?.configuration)

    // if (!(assemblyIdentifier in state.assemblydata)) {
    //   return (null)
    // }

    // if ('configuration' in state.assemblydata[assemblyIdentifier]) {
    //   return (state.assemblydata[assemblyIdentifier].configuration)
    // }

  },
  assembly_userid: (state, getters) => {
    console.log(">> NOTE: cache userid")

    if (!getters.assemblyIdentifier) {
      return null
    }
    return state.assemblydata[getters.assemblyIdentifier]?.access_sub
  },

  assembly_stages: (state, getters) => {
    console.log(">> NOTE: assembly_stages")

    if (!getters.assemblyIdentifier) {
      return null
    }

    return state.assemblydata[getters.assemblyIdentifier]?.stages
  },

  get_assembly_stage: (state, getters, rootState, rootGetters, test1, test2) => (stageID) => {
    const stages = getters.assembly_stages
    return (stages[stageID])
  },

  assembly_sorted_stages: (state, getters) => {
    console.log(">>..:Sort stages :")
    const stages = getters.assembly_stages
    if (!stages) {
      return null
    }

    if (stages) {
      return Object.values(stages).sort((a, b) => a.stage.order_position < b.stage.order_position ? -1 : a.stage.order_position > b.stage.order_position ? 1 : 0)
    }
  },

  /** Which stage is  the last one that is freely open / accessible */
  last_accessible_stage: (state, getters) => {
    console.log(">> last_accessible_stage")
    // console.log(getters.assembly_sorted_stages)
    const stages = getters.assembly_sorted_stages
    if (!stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }

    const last_accessible_stage = stages.find(stage => true &&
      !getters.is_stage_skippable(stage) &&
      !getters.is_stage_disabled(stage) &&
      !getters.is_stage_completed(stage))

    if (!last_accessible_stage) {
      // it seems that all stages are open! => take the last one...
      return (stages[stages.length - 1])
    }

    return last_accessible_stage
  },

  /* Return all stages, that are still to absolve */
  assembly_scheduled_stages: (state, getters) => {
    const sorted_stages = getters.assembly_sorted_stages
    if (!sorted_stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }
    return sorted_stages.filter(stage => !getters.is_stage_scheduled(stage))
  },

  /** Which stages are freely open / accessible */
  assembly_accessible_stages: (state, getters) => {
    const sorted_stages = getters.assembly_sorted_stages
    if (!sorted_stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }
    // console.assert(sorted_stages)
    const last_accessible_stage = getters.last_accessible_stage
    console.assert(last_accessible_stage)

    // Return all stages until the last_accessible_stage
    return sorted_stages.filter(stage => true &&
      stage.stage.order_position <= last_accessible_stage.stage.order_position &&
      !getters.is_stage_disabled(stage) &&
      !getters.is_stage_completed(stage))
  },


  /** Which stages are freely open / accessible */
  assembly_accessible_stage_ids: (state, getters) => {
    const accessible_stages = getters.assembly_accessible_stages

    if (!accessible_stages) {
      return null
    }

    return accessible_stages.map(stage => stage.stage.id)
  },

  get_stage_number_by_stage: (state, getters) => (stage) => {
    const sorted_stages = getters.assembly_sorted_stages
    console.assert(sorted_stages)
    const stage_number = sorted_stages.indexOf(stage)
    console.assert(stage_number > -1)

    return (stage_number)
  },

  find_next_accessible_stage: (state, getters) => (previous_stage) => {
    // console.log("previous stage: moveon ", previous_stage)
    console.assert(previous_stage)
    const next_stage = getters.assembly_accessible_stages.find(stage => true &&
      stage.stage.order_position > previous_stage.stage.order_position)
    console.log("new stage found", next_stage)
    return next_stage
  },


  is_stage_first: (state, getters) => (stage) => {
    console.assert(stage)
    const sorted_stages = getters.assembly_sorted_stages
    return (sorted_stages[0] == stage)
  },

  is_stage_last: (state, getters) => (stage) => {
    console.assert(stage)
    const sorted_stages = getters.assembly_sorted_stages
    console.assert(sorted_stages[sorted_stages.length - 1])
    return (sorted_stages[sorted_stages.length - 1]?.stage.id == stage.stage.id)
  },

  /* Is there still an activity required on this stage? */
  is_stage_scheduled: (state, getters) => (stage) => {
    console.assert(stage)
    const last_accessible_stage = getters.last_accessible_stage
    console.assert(last_accessible_stage)
    return stage.stage.order_position >= last_accessible_stage.stage.order_position &&
      !getters.is_stage_completed(stage) &&
      !getters.is_stage_disabled(stage)
  },

  /** Which stage is new => no progression entry is available */
  is_stage_new: (state) => (stage) => {
    console.assert(stage)
    // when progression entry not yet exists...
    return !stage.progression
  },

  is_stage_alert: (state) => (stage) => {
    console.assert(stage)
    // whenn status is set TO STATUS_ALERT
    return stage.progression?.status == constants.STATUS_ALERT
  },

  is_stage_skipped: (state) => (stage) => {
    console.assert(stage)
    // whenn status is set TO STATUS_ALERT
    return stage.progression?.status == constants.STATUS_SKIPPED
  },

  is_stage_disabled: (state) => (stage) => {
    console.assert(stage)
    // only admins see deleted attribute.
    return (stage.progression?.status == constants.STATUS_LOCKED)
    // TODO: not anymore available, right? return (stage.stage.disabled || stage.stage.deleted)
  },

  /** All stages that are not alerted, and are not new are skippable, right? */
  is_stage_skippable: (state, getters) => (stage) => {
    console.assert(stage)
    return (!getters.is_stage_alert(stage) && !getters.is_stage_new(stage))
  },

  is_stage_completed: (state) => (stage) => {
    console.assert(stage)
    return (stage.progression?.completed === true)
  },

  is_stage_accessible: (state, getters) => (stage) => {
    console.assert(stage)
    const accessible_stage_ids = getters.assembly_accessible_stage_ids
    return accessible_stage_ids.includes(stage.stage.id)
  },

  is_stage_done: (state, getters) => (stage) => {
    console.assert(stage)
    return getters.is_stage_accessible(stage) ||
      getters.is_stage_completed(stage)
  }
}

const actions = {

  touchRandomSeed({ commit }) {
    commit('set_random_seed')
  },

  syncAssembly: ({ state, dispatch, getters, rootState, rootGetters }, { oauthUserID }) => {
    // console.log(` sync assembly ${assemblyIdentifier}`)
    const assemblyIdentifier = getters.assemblyIdentifier
    if (!state.assemblydata[assemblyIdentifier]) {
      // no cached version exists: load the data from resource server...
      dispatch('retrieveAssembly', { assemblyIdentifier: assemblyIdentifier })
      // console.log(' not yet fetched...')
      return (null)
    }

    // wrong user? and renew cache all x- minutes!
    const wrongUser = oauthUserID != state.assemblydata[assemblyIdentifier].access_sub
    const expired = !(state.assemblydata[assemblyIdentifier]) || api.expiredCacheDate(state.assemblydata[assemblyIdentifier].access_date)
    // console.log()
    if (expired || wrongUser) {
      console.log(' Assembly not in sync  or wrong user...', expired, state.assemblydata[assemblyIdentifier].access_date)
      dispatch('retrieveAssembly', { assemblyIdentifier: assemblyIdentifier })
      return null
    }

    console.log("Assembly retrieved from localStorage")
    LayoutEventBus.$emit('AssemblyLoaded')
    return (null)
  },


  syncStage: ({ state, dispatch, getters, rootState, rootGetters})  => (stageID) => {
    // const stages = getters.assembly_stages
    // console.assert(stages[stageID])

    // preload contenttree (if attached)
    const contenttree_id = stages[stageID]?.stage.contenttree_id
    if (contenttree_id) {
      console.log(test1, test2)
      console.log("Preload/sync: contenttree")
      // this.$store.dispatch('contentstore/syncContenttree', {
      //   assemblyIdentifier: getters.assemblyIdentifier,
      //   contenttreeID: contenttree_id,
      //   oauthUserID: getters.assembly_userid
      // })
    }
    return (stages[stageID])

  },

  storeAssemblyProgression({ commit }, { assemblyIdentifier, stageID, progression }) {
    console.log('Store stage progression in localstorage')
    commit('storeAssemblyProgression', { assemblyIdentifier, stageID, progression })
  },

  retrieveAssembly({ commit }, { assemblyIdentifier }) {

    console.log('Retrieve assembly from resource server')
    api.retrieveAssembly(assemblyIdentifier)
      .then(
        response => {

          console.log('save retrieved assembly to cache.')
          // console.log(assemblyIdentifier)
          // console.log(response)
          const data = response.data
          commit('storeAssembly', { assemblyIdentifier, data })

          // end loading
          console.log("Assembly retrieved from Resource Server")
          LayoutEventBus.$emit('AssemblyLoaded')
          LayoutEventBus.$emit('hideLoading')

        }
      )
      .catch((error) => {
        console.warn(error)
        // Error Handling is done in Axios Interceptor
        console.warn('Request Error')
      })

  },

  monitor_route_changes({ state, commit }, { to, from }) {
    commit('monitor_route_changes', { to, from })
  },

}

const mutations = {

  set_random_seed(state) {
    // console.log('SET RANDOM SEED IF NOT YET DONE')
    if (!state.randomSeed) {
      // console.log('setter')
      let randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1
      state.randomSeed = randomSeed
    }
  },

  storeAssembly(state, { assemblyIdentifier, data }) {
    console.log(`Store assembly ${assemblyIdentifier}`)
    // Vue.set  makes the change reactive!!
    Vue.set(state.assemblydata, assemblyIdentifier, data)
  },

  storeAssemblyProgression(state, { assemblyIdentifier, stageID, progression }) {
    console.log(`Store assembly progression ${assemblyIdentifier}`)
    // Vue.set  makes the change reactive!!
    if (!(stageID in state.assemblydata[assemblyIdentifier].stages)) {
      Vue.set(state.assemblydata[assemblyIdentifier], 'stages', stageID)
      Vue.set(state.assemblydata[assemblyIdentifier].stages, stageID, { 'progression': null })
    }
    Vue.set(state.assemblydata[assemblyIdentifier].stages[stageID], 'progression', progression)
  },


  monitor_route_changes(state, { to, from }) {
    const now = Date.now()

    // Track assemblyIdentifier
    if (from.params?.assemblyIdentifier !== to.params?.assemblyIdentifier) {
      console.log(">> ROUTE: new assemblyIdentifier")
      // LayoutEventBus.$emit('AppLoaded')
      Vue.set(state.monitors, 'routed_assembly_identifier', now)
    }
  }
}

export const assemblystore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
