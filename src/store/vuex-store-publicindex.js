/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import api from 'src/utils/api'
import { LayoutEventBus } from 'src/utils/eventbus.js'

var state = {
  publicIndex: null
}

const getters = {

  ongoing_assemblies: (state) => {
    const publicIndex = state.publicIndex
    if (publicIndex === null) {
      return (null)
    }

    const filtered_assemblies = Object.filter(state.publicIndex.assemblies, x => x.is_active)
    return (Object.values(filtered_assemblies))
  },

  published_assemblies: (state) => {
    if (state.publicIndex === null || state.publicIndex === undefined) {
      return (null)
    }

    const filtered_assemblies = Object.filter(state.publicIndex.assemblies, x => x.is_public)
    return (Object.values(filtered_assemblies))
  },


  UsersDelegateAssemblies: (state, getters, rootState, rootGetters) => {

    // data not yet loaded
    if (getters.ongoing_assemblies === null) {
      return (null)
    }

    // Check if there is at least one ongoing assembly.
    if (getters.ongoing_assemblies.length === 0) {
      return (false)
    }

    // Check permissions:
    const compare_func = rootGetters['publicprofilestore/translateOauthAcls']
    let accessibleAssemblies = Object.filter(getters.ongoing_assemblies, x => compare_func(x.identifier))
    return (Object.values(accessibleAssemblies))
  },

  IsUserDelegateOfOngoingAssembly: (state, getters) => {
    console.log("IsUserDelegateOfOngoingAssembly", getters.UsersDelegateAssemblies)
    const assemblies = getters.UsersDelegateAssemblies
    return (assemblies && Object.values(assemblies).length > 0)
  },


  /* SHORTCUTS: mainly for artificial moderators */
  IsThereAnAssemblyInPublicState: (state, getters) => {
    if (state.published_assemblies == null) {
      return (null)
    }
    return (state.published_assemblies.length > 0)
  },

  IsThereAnAssemblyOngoing: (state, getters) => {
    if (getters.ongoing_assemblies === null) {
      return (null)
    }
    return (getters.ongoing_assemblies.length > 0)
  },

  IsThereNothingGoingOn: (state, getters) => {
    if (getters.IsThereAnAssemblyInPublicState === null || getters.IsThereAnAssemblyInPublicState === null) {
      return (null)
    }

    return (!getters.IsThereAnAssemblyOngoing && !getters.IsThereAnAssemblyInPublicState)
  }



  // currentPublicAssembly() {

  //   // const assemblies = this.UsersDelegateAssemblies
  //   const assemblyIdentifier = this.currentAssemblyIdentifier
  //   if (assemblyIdentifier) {
  //     return this.getAssembly(assemblyIdentifier)
  //   }
  // },


  // assemblyIdentifier() {

  //   const assemblies = this.UsersDelegateAssemblies
  //   return (this.$route?.params?.assemblyIdentifier)
  // },


  // assemblyName() {

  //   const assembly = this.currentPublicAssembly
  //   if (assembly) {
  //     return (assembly.title)
  //   }
  // },



  // getAssembly: (state) => (assemblyIdentifier) => {
  //   // return state.things.find(thing => thing.identifier === id)
  //   console.assert(assemblyIdentifier)
  //   return (state.publicIndex?.assemblies[assemblyIdentifier])
  //   // if (state.publicIndex?.assemblies[assemblyIdentifier]) {
  //   // }
  // },
}

const actions = {

  syncPublicIndex: ({ state, dispatch, localgetters, rootState, rootGetters }) => {
    console.log("...is public index in sync?")
    if (state.publicIndex === null || state.publicIndex === undefined) {
      // no cached version exists: load the data from resource server...
      console.log("...cache is empty")
      dispatch('retrievePublicIndex')
      return (null)
    }

    // renew cache all x- minutes
    const expired = api.expiredCacheDate(state.publicIndex.access_date)
    if (expired) {
      // too old cache: load the data from resource server...
      console.log("...cache is outdated")
      dispatch('retrievePublicIndex')
    }

    return (null)
  },


  retrievePublicIndex({ commit }) {
    console.log('Retrieve publicIndex from resource server')
    api.retrievePublicIndex()
      .then(
        response => {

          // save data
          console.assert(response.data !== null && response.data !== undefined)
          console.log('save full contenttree to cache.')
          commit('storePublicIndex', response.data)

          // end loading
          LayoutEventBus.$emit('hideLoading')

        }
      )
      .catch((error) => {
        console.log(error)
        console.warn('Request Error')

      })
  }
}

const mutations = {

  storePublicIndex(state, publicIndex) {
    // Vue.set  makes the change reactive!!
    Vue.set(state, 'publicIndex', publicIndex)
  }
}

export const publicindexstore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
