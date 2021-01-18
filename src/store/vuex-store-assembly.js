/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import api from 'src/utils/api'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { date } from 'quasar'

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

    if ('configuration' in state.assemblydata[assemblyIdentifier]) {
      return (state.assemblydata[assemblyIdentifier].configuration)
    }

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

    // console.log(stages)
    console.assert(stageID in stages)

    return (stages[stageID])
  },

  getCachedStageID:  (state) => (assemblyIdentifier) => {

    // return state.things.find(thing => thing.identifier === id)
    if(!(assemblyIdentifier in state.current_stages)) {
      return(null)
    }
    return(state.current_stages[assemblyIdentifier])
  },

  /* Refresh cashed data all X minutes, and ensure that data is downloaded by the
  currently logged in user */
  checkAssemblyStatus({state, getters, rootState, rootGetters}, {assemblyIdentifier, oauthUserID}) {
    console.log('check assembly status')
    console.assert(assemblyIdentifier)

    // not even downloaded:
    if (!(assemblyIdentifier in state.assemblydata)) {
      return (false)
    }

    // not access_date available
    const timeDownloaded = state.assemblydata[assemblyIdentifier].access_date
    if (!timeDownloaded) { return (false)}

    // Cache expired
    const CacheDurabilityMinutes = 10 // TODO: put this in environment variable.
    var timeThreshold = Date.now()
    timeThreshold = date.subtractFromDate(timeThreshold, { minutes: CacheDurabilityMinutes})    
    if (timeDownloaded < timeThreshold) {
      return (false)
    }

    // Wrong user?
    const cached_userid = state.assemblydata[assemblyIdentifier].access_sub
    return (cached_userid == oauthUserID)
  }
}

const actions = {

  touchRandomSeed ({commit}) {
    commit('set_random_seed')
  },

  setCachedStageID({commit}, {assembly, stageID}) {
    commit('setCachedStageID', {assembly, stageID})
  },

  syncAssembly: ({state, dispatch, localgetters, rootState, rootGetters}, {assemblyIdentifier, oauthUserID}) => {
    console.log(` sync assembly ${assemblyIdentifier}`)

    console.assert(assemblyIdentifier)

    if(!state.assemblydata || !(assemblyIdentifier in state.assemblydata)) {
      // no cached version exists: load the data from resource server...
      dispatch('retrieveAssembly', {assemblyIdentifier: assemblyIdentifier})
      console.log(' not yet fetched...')
      return(null)
    }

    // renew cache all x- minutes
    if (!getters.checkAssemblyStatus({state, getters, rootState, rootGetters}, {assemblyIdentifier, oauthUserID})) {
      // too old cache: load the data from resource server...
      console.log(' not in sync...')
      dispatch('retrieveAssembly', {assemblyIdentifier: assemblyIdentifier})
    }

    return(null)
  },
 
  storeAssemblyProgression({commit}, {assemblyIdentifier, stageID, progression}) {
    console.log('Store stage progression in localstorage')
    commit('storeAssemblyProgression', {assemblyIdentifier, stageID, progression})
  },

  retrieveAssembly({commit}, {assemblyIdentifier}) {

    console.log('Retrieve assembly from resource server')
    api.retrieveAssembly(assemblyIdentifier)
      .then(
        response => {

          console.log('save retrieved assembly to cache.')
          // console.log(assemblyIdentifier)
          // console.log(response)
          const data = response.data
          commit('storeAssembly', {assemblyIdentifier, data})

          // end loading
          LayoutEventBus.$emit('hideLoading')

        }
      )
      .catch((error) => {
        console.warn(error)
        // Error Handling is done in Axios Interceptor
        console.warn('Request Error')
      })

      // console.log("just launched in vuex")
    }
  }

  const mutations = {

    set_random_seed (state) {
      console.log('SET RANDOM SEED IF NOT YET DONE')
      if (!state.randomSeed) {
        console.log('setter')
        let randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1
        state.randomSeed = randomSeed
      }
    },

    setCachedStageID(state, {assembly, stageID}) {

      // keep list of opened contents (if previously available)
      console.log('update current  stage id for the given assembly')

      // prepare folder
      if (!(assembly.identifier in state.current_stages)) {
        Vue.set(state.current_stages, assembly.identifier, null)
      }
      // Vue.set  makes the change reactive!!
      Vue.set(state.current_stages, assembly.identifier, stageID)
      console.log('...store: new stage has been set...')
    },

    storeAssembly (state, {assemblyIdentifier, data}) {
      console.log(`Store assembly ${assemblyIdentifier}`)
      // Vue.set  makes the change reactive!!
      Vue.set(state.assemblydata, assemblyIdentifier, data)
    },

    storeAssemblyProgression (state, {assemblyIdentifier, stageID, progression}) {
      console.log(`Store assembly progression ${assemblyIdentifier}`)
      // Vue.set  makes the change reactive!!
      if (!(stageID in state.assemblydata[assemblyIdentifier].stages) ){
        Vue.set(state.assemblydata[assemblyIdentifier], 'stages', stageID)
        Vue.set(state.assemblydata[assemblyIdentifier].stages, stageID, {'progression': null})
      }
      Vue.set(state.assemblydata[assemblyIdentifier].stages[stageID], 'progression', progression)
    }
  }

  export const assemblystore = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
  }
