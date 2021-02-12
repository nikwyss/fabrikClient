/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import { Router } from 'src/router'
import api from 'src/utils/api'
import constants from 'src/utils/constants'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { runtimeStore } from "src/store/runtime.store";
import { date } from 'quasar'

var state = {
  monitors: {},
  assemblydata: {},
  randomSeed: null,
  stages: {}
  // current_stages: {}
}

const getters = {

  assembly: (state, getters) => {

    if (!runtimeStore.assemblyIdentifier) {
      return null
    }

    return (state.assemblydata[runtimeStore.assemblyIdentifier]?.assembly)
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

    if (!runtimeStore.assemblyIdentifier) {
      return null
    }
    const translateAclMethod = rootGetters["publicprofilestore/translateOauthAcls"]
    return translateAclMethod(runtimeStore.assemblyIdentifier)
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
  },

  assembly_userid: (state, getters) => {
    console.log(">> NOTE: cache userid")

    if (!runtimeStore.assemblyIdentifier) {
      return null
    }
    return state.assemblydata[runtimeStore.assemblyIdentifier]?.access_sub
  },

  assembly_stages: (state, getters) => {
    console.log(">> NOTE: assembly_stages")

    if (!runtimeStore.assemblyIdentifier) {
      console.log('...identifier not ready')
      return null
    }

    console.log(runtimeStore.assemblyIdentifier)
    const stage_keys = state.assemblydata[runtimeStore.assemblyIdentifier]?.stages
    if (!stage_keys) {
      console.log('...assembly not ready')
      return null
    }

    // filter only the stages of the specific assembly
    const stages = Object.keys(state.stages)
      .filter(key => stage_keys.includes(key))
      .reduce((obj, key) => {
        obj[key] = state.stages[key];
        return obj;
      }, {})


    console.log("this are assembly stages", stages)
    return stages
  },


  stage: (state, getters, rootState, rootGetters, test1, test2) => {
    const stages = getters.assembly_stages
    return (stages[runtimeStore.stageID])
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


  /** Which stage is  the next scheduled stage (if empty, no stages available or no scheduled stage available) */
  next_scheduled_stage: (state, getters) => {
    console.log(">> next_scheduled_stage")
    // console.log(getters.assembly_sorted_stages)
    const stages = getters.assembly_sorted_stages
    if (!stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }
    // console.log("sorted stages,", stages)
    // console.log(getters.is_stage_scheduled(stages[1]))
    const last_accessible_stage = stages.find(stage => true &&
      getters.is_stage_scheduled(stage) &&
      !getters.is_stage_disabled(stage) &&
      !getters.is_stage_completed(stage))

    return last_accessible_stage
  },

  /** Which stage is  the last one that is freely open / accessible */
  last_accessible_stage: (state, getters) => {

    const nextScheduledStage = getters.next_scheduled_stage
    const stages = getters.assembly_sorted_stages

    if (!stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }

    if (!nextScheduledStage) {
      // it seems that all stages are open! => take the last one...
      return (stages[stages.length - 1])
    }

    return nextScheduledStage
  },

  /* Return all stages, that are still to absolve */
  assembly_scheduled_stages: (state, getters) => {
    const sorted_stages = getters.assembly_sorted_stages
    if (!sorted_stages) {
      console.log('assemmbly is not yet loaded')
      return null
    }
    return sorted_stages.filter(stage => getters.is_stage_scheduled(stage))
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
    console.assert(stage)
    const sorted_stages = getters.assembly_sorted_stages
    console.assert(sorted_stages)
    const sorted_stage_ids = sorted_stages.map(stage => stage.stage.id)
    // console.log(sorted_stage_ids)
    const stage_number = sorted_stage_ids.indexOf(stage.stage.id)
    // console.log(stage_number, "stage_number of stage: ", stage)
    // console.log("sorted_stage: ", sorted_stages)
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
    if (getters.is_stage_completed(stage)) {
      return (false)
    }
    return getters.is_stage_alert(stage) || getters.is_stage_new(stage)
  },

  /** Which stage is new => no progression entry is available */
  is_stage_new: (state) => (stage) => {
    console.assert(stage)
    // when progression entry not yet exists...
    return !stage.progression
  },

  /**
   * Not scheduled, not new, not completeed => just idle
   */
  is_stage_alert: (state) => (stage) => {
    // when progression entry not yet exists...
    return !stage.progression
  },

  is_stage_idle: (state, getters) => (stage) => {
    console.assert(stage)
    return !getters.is_stage_scheduled(stage) &&
      !getters.is_stage_completed(stage) &&
      !getters.is_stage_disabled(stage)
  },

  is_stage_skipped: (state) => (stage) => {
    console.assert(stage)
    return stage.progression?.skipped
  },

  is_stage_disabled: (state) => (stage) => {
    console.assert(stage)
    // only admins see deleted attribute.
    return (stage.progression?.locked)
    // TODO: not anymore available, right? return (stage.stage.disabled || stage.stage.deleted)
  },

  /** All stages that are not alerted, and are not new are skippable, right? */
  // is_stage_skippable: (state, getters) => (stage) => {
  //   console.assert(stage)
  //   return (!getters.is_stage_alert(stage) && !getters.is_stage_new(stage))
  // },

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
  },

  is_first_day: (state, getters) => (stage) => {
    console.log(stage.progression.date_created)
    console.log(date.isSameDate(stage.progression.date_created, Date.now(), 'day'))
  }
}

const actions = {

  touchRandomSeed({ commit }) {
    commit('set_random_seed')
  },

  syncAssembly: ({ state, dispatch, getters, rootState, rootGetters }, { oauthUserID }) => {
    // console.log(` sync assembly ${assemblyIdentifier}`)
    const assemblyIdentifier = runtimeStore.assemblyIdentifier
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

    console.log("AssemblyLoaded: Assembly retrieved from localStorage")
    LayoutEventBus.$emit('AssemblyLoaded')
    return (null)
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
          console.log("EVENT: AssemblyLoaded: Assembly retrieved from Resource Server")
          LayoutEventBus.$emit('AssemblyLoaded')
          LayoutEventBus.$emit('hideLoading')

        }
      )
      .catch((error) => {
        console.warn(error)
        // Error Handling is done in Axios Interceptor
        console.warn('Request Error')
      })

  }
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

    // data.stages.forEach(stage)
    const stages = state.stages
    Vue.set(state, 'stages', Object.assign({}, stages, data.stages))

    // Vue.set  makes the change reactive!!
    // console.log(data.stages, "TESTTEST")
    data.stages = Object.keys(data.stages)
    // .map(stage => stage.stage.id)
    // console.log(data.stages, "TESTTEST")
    Vue.set(state.assemblydata, assemblyIdentifier, data)

  },


  storeAssemblyObject(state, { assemblyIdentifier, assembly }) {
    console.log(`Store assembly ${assemblyIdentifier} object`)
    Vue.set(state.assemblydata[assemblyIdentifier], 'assembly', assembly)
  },
  storeAssemblyProgression(state, { assemblyIdentifier, progression }) {
    console.log(`Store assembly ${assemblyIdentifier} progressions`)
    Vue.set(state.assemblydata[assemblyIdentifier], 'progression', progression)
  },
  storeStageObject(state, { stageID, stage }) {
    console.log(`Store stage ${stageID} object`)
    Vue.set(state.stages[stageID], 'stage', stage)
  },
  storeStageProgression(state, { stageID, progression }) {
    console.log(`Store stage ${stageID} progression`, progression)
    Vue.set(state.stages[stageID], 'progression', progression)
  },




  // storeAssemblyProgression(state, { assemblyIdentifier, stageID, progression }) {
  //   console.log(`Store assembly progression ${assemblyIdentifier}`)
  //   // Vue.set  makes the change reactive!!
  //   if (!(stageID in state.assemblydata[assemblyIdentifier].stages)) {
  //     Vue.set(state.assemblydata[assemblyIdentifier], 'stages', stageID)
  //     Vue.set(state.assemblydata[assemblyIdentifier].stages, stageID, { 'progression': null })
  //   }
  //   Vue.set(state.assemblydata[assemblyIdentifier].stages[stageID], 'progression', progression)
  // }


  // monitor_route_changes(state, { to, from }) {
  //   const now = Date.now()

  //   // Track assemblyIdentifier
  //   if (from.params?.assemblyIdentifier !== to.params?.assemblyIdentifier) {
  //     console.log(">> ROUTE: new assemblyIdentifier")
  //     // LayoutEventBus.$emit('AppLoaded')
  //     Vue.set(state.monitors, 'routed_assembly_identifier', now)
  //   }
  // }
}

export const assemblystore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
