/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import api from 'src/utils/api'
import { LayoutEventBus } from 'src/utils/eventbus.js'

var state = {
  assemblydata: {},
  randomSeed: null,
  current_stages: {}
}

const getters = {

  get_assembly: (state) => (assemblyIdentifier) => {
    // return state.things.find(thing => thing.identifier === id)
    console.assert(assemblyIdentifier)
    if (!(assemblyIdentifier in state.assemblydata)) {
      return (null)
    }
    console.assert('stages' in state.assemblydata[assemblyIdentifier])

    return (state.assemblydata[assemblyIdentifier].assembly)
  },

  randomLocalStorageSeed: (state) => {
    return (state.randomSeed)
  },

  get_assembly_configuration: (state) => (assemblyIdentifier) => {
    // return state.things.find(thing => thing.identifier === id)

    // return state.things.find(thing => thing.identifier === id)
    if (!(assemblyIdentifier in state.assemblydata)) {
      return (null)
    }
    
    if (!('configuration' in state.assemblydata[assemblyIdentifier])) {
      return (null)
    }
    
    return (state.assemblydata[assemblyIdentifier].configuration)
  },
  
  get_assembly_progression: (state) => (assemblyIdentifier) => {
    // return state.things.find(thing => thing.identifier === id)

    // return state.things.find(thing => thing.identifier === id)
    if(!(assemblyIdentifier in state.assemblydata)) {
      return (null)
    }
    if(!('progression' in state.assemblydata[assemblyIdentifier])) {
      return(null)
    }
    
    return (state.assemblydata[assemblyIdentifier].progression)
  },
  
  
  get_assembly_stages: (state) => (assemblyIdentifier) => {
    // return state.things.find(thing => thing.identifier === id)

    console.assert(assemblyIdentifier)
    if (!(assemblyIdentifier in state.assemblydata)) {
      return (null)
    }

    if (!state.assemblydata[assemblyIdentifier]) {
      return (false)
    }

    console.assert('stages' in state.assemblydata[assemblyIdentifier])
    console.assert(state.assemblydata[assemblyIdentifier].stages !== null)

    return (state.assemblydata[assemblyIdentifier].stages)
  },


  get_assembly_stage: (state) => ({assemblyIdentifier, stageID}) => {
    
    const stages = getters.get_assembly_stages(state)(assemblyIdentifier)
    if (stages===null) {
      return (null)
    }
    
    console.log(stages)
    console.assert(stageID in stages)

    return (stages[stageID])
  },
  
  get_current_stageID:  (state) => (assemblyIdentifier) => {

    // return state.things.find(thing => thing.identifier === id)
    if(!(assemblyIdentifier in state.current_stages)) {
      return(null)
    }
    return(state.current_stages[assemblyIdentifier])
  },
  
  /* Refresh cashed data all X minutes, and ensure that data is downloaded by the
  currently logged in user */
  checkAssemblyStatus({state, getters, rootState, rootGetters}, {assemblyIdentifier}) {
    console.log('check assembly status')
    console.log(assemblyIdentifier)
    // TODEBUG: how to transmit assemblyIdentifier here?
    
    // not access_date available
    const timeDownloaded = Vue.moment(state.assemblydata[assemblyIdentifier].access_date)
    if (!timeDownloaded) { return (false)}
    
    // Cache expired
    const CacheDurabilityMinutes = 5 // TODO: put this in environment variable.
    const timeThreshold = Vue.moment(new Date())
    timeThreshold.subtract(CacheDurabilityMinutes, 'minutes')
    if (timeDownloaded < timeThreshold) {
      return (false)
    }
    
    // Wrong user?
    const compare_func = rootGetters['oauthstore/is_current_oauth_userid']
    const cached_userid = state.assemblydata[assemblyIdentifier].access_sub
    return (compare_func(cached_userid))
  }
}

const actions = {
  
  touchRandomSeed ({commit}) {
    commit('set_random_seed')
  },
  
  set_current_stageID({commit}, {assembly, stageID}) {
    commit('set_current_stageID', {assembly, stageID})
  },
  
  syncAssembly: ({state, dispatch, localgetters, rootState, rootGetters}, {assemblyIdentifier}) => {
    console.log(` sync assembly ${assemblyIdentifier}`)
    
    if(!state.assemblydata || !(assemblyIdentifier in state.assemblydata)) {
      // no cached version exists: load the data from resource server...
      dispatch('retrieveAssembly', {assemblyIdentifier: assemblyIdentifier})
      return(null)
    }

    // renew cache all x- minutes
    if (!getters.checkAssemblyStatus({state, getters, rootState, rootGetters}, {assemblyIdentifier})) {
      // too old cache: load the data from resource server...
      dispatch('retrieveAssembly', {assemblyIdentifier: assemblyIdentifier})
    }
    
    return(null)
  },
  
  retrieveAssembly({commit}, {assemblyIdentifier}) {

    console.log("Retrieve assemblies from resource server")
    api.retrieveAssembly(assemblyIdentifier).then(
      response => {
        
        // save data
        // if (!(response.data !== null && response.data !== undefined)){
        //   LayoutEventBus.$emit('showServiceError')
        // }
        
        console.log('save retrieved assembly to cache.')
        const data = response.data
        commit('storeAssembly', {assemblyIdentifier, data})
        
        // end loading
        LayoutEventBus.$emit('hideLoading')
        
      })
    }
  }
  
  const mutations = {
    
    
    set_random_seed (state) {
      console.log("SET RANDOM SEED IF NOT YET DONE")
      if (!state.randomSeed) {
        console.log("setter")
        let randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1
        state.randomSeed = randomSeed
      }
    },

    set_current_stageID(state, {assembly, stageID}) {

      // keep list of opened contents (if previously available)
      console.log("update current  stage id for the given assembly")

      // preprare folder
      if (!(assembly.identifier in state.current_stages)) {
        Vue.set(state.current_stages, assembly.identifier, null)
      }
      // Vue.set  makes the change reactive!!
      Vue.set(state.current_stages, assembly.identifier, stageID)
    },
    storeAssembly (state, {assemblyIdentifier, data}) {
      console.log(`Store assembly ${assemblyIdentifier}`)
      console.log(data)

      // Vue.set  makes the change reactive!!
      Vue.set(state.assemblydata, assemblyIdentifier, data)
    }
  }

  export const assemblystore = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
  

  // /* Stores assembly in the vuex store: it is easy likely that the assembly object is required on many pages._200
  //  * TODO: ALternative: create a runtime variable...
  // */
  // import Vue from 'vue'
  // import { store } from 'quasar/wrappers'
  
  // var state = {
  //     randomSeed: null,
  //     current_stages: {},
  //     assemblies: {},
  //     current_assemblyIdentifier: null
  // }
  
  // /*
  // Vuex allows us to define "getters" in the store. You can think of them as computed properties
  // for stores. Like computed properties, a getter's result is cached based on its dependencies,
  // and will only re-evaluate when some of its dependencies have changed.
  // (Hence, getter are run only when Vue-boot or content-change)
  // */
  // const getters = {
  
  //     randomLocalStorageSeed: (state) => {
  //         return (state.randomSeed)
  //     },
  
  //     get_assembly: (state) => (assemblyIdentifier) => {
  //         // return state.things.find(thing => thing.identifier === id)
  //         if (!(assemblyIdentifier in state.assemblydata)) {
  //             return (null)
  //         }
  //         if (!('assembly' in state.assemblydata[assemblyIdentifier])) {
  //             return (null)
  //         }
  //         return (state.assemblydata[assemblyIdentifier].assembly)
  //     },
  
  //     get_assembly_stages: (state) => (assemblyIdentifier) => {
  //         // return state.things.find(thing => thing.identifier === id)
  //         console.log(assemblyIdentifier)
  //         if (!(assemblyIdentifier in state.assemblydata)) {
  //             return (null)
  //         }
  //         console.assert('stages' in state.assemblydata[assemblyIdentifier])
  //         console.assert(state.assemblydata[assemblyIdentifier].stages !== null)
  
  //         return (state.assemblydata[assemblyIdentifier].stages)
  //     },
  
  //     get_assembly_configuration: (state) => (assemblyIdentifier) => {
  //         // return state.things.find(thing => thing.identifier === id)
  
  //         // return state.things.find(thing => thing.identifier === id)
  //         if (!(assemblyIdentifier in state.assemblydata)) {
  //             return (null)
  //         }
  
  //         if (!('configuration' in state.assemblydata[assemblyIdentifier])) {
  //             return (null)
  //         }
  
  //         return (state.assemblydata[assemblyIdentifier].configuration)
  //     },
  
  //     get_assembly_progression: (state) => (assemblyIdentifier) => {
  //         // return state.things.find(thing => thing.identifier === id)
  
  //         // return state.things.find(thing => thing.identifier === id)
  //         if(!(assemblyIdentifier in state.assemblydata)) {
  //             return (null)
  //         }
  //         if(!('progression' in state.assemblydata[assemblyIdentifier])) {
  //             return(null)
  //         }
  
  //         return (state.assemblydata[assemblyIdentifier].progression)
  //     },
  
  //     get_assembly_stage: (state) => ({assemblyIdentifier, stageID}) => {
  //         // return state.things.find(thing => thing.identifier === id)
  
  //         // return state.things.find(thing => thing.identifier === id)
  //         if (!(assemblyIdentifier in state.assemblydata)) {
  //             return (null)
  //         }
  
  //         if (!('stages' in state.assemblydata[assemblyIdentifier])) {
  //             return (null)
  //         }
  
  //         const stages = state.assemblydata[assemblyIdentifier].stages
  //         console.assert(stageID in stages)
  
  //         return (stages[stageID])
  //     },
  
  //     get_current_assemblyIdentifier: (state) => {
  //         // return state.things.find(thing => thing.identifier === id)
  //         return (state.current_assemblyIdentifier)
  //     },
  
  //     get_current_stageID:  (state) => (assemblyIdentifier) => {
  //         // return state.things.find(thing => thing.identifier === id)
  //         if(!(assemblyIdentifier in state.current_stages)) {
  //             return(null)
  //         }
  //         return(state.current_stages[assemblyIdentifier])
  //     }
  // }
  
  // const actions = {
  
  //     touchRandomSeed ({commit}) {
  //         commit('set_random_seed')
  //     },
  //     set_current_stageID({commit}, {assembly, stageID}) {
  //         commit('set_current_stageID', {assembly, stageID})
  //     },
  //     set_current_assemblyIdentifier({commit}, assembly) {
  //         commit('set_current_assemblyIdentifier', assembly)
  //     },
  //     add_or_update_assembly({commit}, {assembly, stages, configuration, progression}) {
  //         commit('add_or_update_assembly', {assembly, stages, configuration, progression})
  //     },
  
  //     add_or_update_stage_progression({commit}, {assembly_identifier, stage_id, progression}) {
  //         console.log("add_or_update_stage_progression (2)")
  //         console.assert(assembly_identifier)
  //         console.assert(stage_id)
  //         console.assert(progression)
  //         commit('add_or_update_stage_progression', {assembly_identifier, stage_id, progression})
  //     }
  // }
  
  // const mutations = {
  
  //     set_random_seed (state) {
  //         console.log("SET RANDOM SEED IF NOT YET DONE")
  //         if (!state.randomSeed) {
  //             console.log("setter")
  //             let randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1
  //             state.randomSeed = randomSeed
  //         }
  //     },
  
  //     set_current_assemblyIdentifier(state, assembly) {
  
  //         // keep list of opened contents (if previously available)
  //         console.log("update current assembly identifier")
  //         // TODO: Vue.set would make the change reactive!! necessary?
  //         state.current_assemblyIdentifier = assembly ? assembly.identifier: null
  //     },
  
  //     set_current_stageID(state, {assembly, stageID}) {
  
  //         // keep list of opened contents (if previously available)
  //         console.log("update current  stage id for the given assembly")
  
  //         // preprare folder
  //         if (!(assembly.identifier in state.current_stages)) {
  //             Vue.set(state.current_stages, assembly.identifier, null)
  //         }
  //         // Vue.set  makes the change reactive!!
  //         Vue.set(state.current_stages, assembly.identifier, stageID)
  //     },
  
  //     add_or_update_assembly(state, {assembly, stages, configuration, progression}) {
  
  //         // keep list of opened contents (if previously available)
  //         console.log("update assembly stages")
  
  //         // preprare folder
  //         if (!(assembly.identifier in state.assemblydata)) {
  //             Vue.set(state.assemblydata, assembly.identifier, {stages : null, assembly: null, configuration: null, progression: null})
  //         }
  
  //         // Vue.set  makes the change reactive!!
  //         Vue.set(state.assemblydata[assembly.identifier], 'assembly', assembly)
  //         console.log("assemblies have been updated..")
  
  //         Vue.set(state.assemblydata[assembly.identifier], 'stages', stages)
  //         console.log("stages have been updated..")
  
  //         // convert to named array (names == ids)
  //         Vue.set(state.assemblydata[assembly.identifier], 'configuration', configuration)
  //         console.log("assemblies configuration have been updated too..")
  
  //         // convert to named array (names == ids)
  //         Vue.set(state.assemblydata[assembly.identifier], 'progression', progression)
  //         console.log("assemblies progression have been updated too..")
  //     },
  
  //     add_or_update_stage_progression(state, {assembly_identifier, stage_id, progression}) {
  
  //         // keep list of opened contents (if previously available)
  //         console.log("update stage_progression")
  
  //         // preprare folder
  //         console.assert(assembly_identifier in state.assemblydata) 
  //         console.assert('stages' in state.assemblydata[assembly_identifier])
  //         console.assert(stage_id in state.assemblydata[assembly_identifier].stages)
  
  //         // Vue.set  makes the change reactive!!
  //         Vue.set(state.assemblydata[assembly_identifier].stages[stage_id], 'progression', progression)
  //         console.log("stage progression has been updated..")
  //     }
  // }
  
  // export const assemblystore = {
  //     namespaced: true,
  //     state,
  //     getters,
  //     actions,
  //     mutations
  // }