/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import api from 'src/utils/api'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { date } from 'quasar'


var state = {
  publicIndex: null
}

const getters = {

  published_assemblies: function (state) {
    if (state.publicIndex === null || state.publicIndex === undefined) {
      return (null)
    }

    const filtered_assemblies = Object.filter(state.publicIndex.assemblies, x => x.is_public)
    return (Object.values(filtered_assemblies))
  },

  ongoing_assemblies: function (state) {
    const publicIndex = state.publicIndex
    if (publicIndex === null) {
      return (null)
    }

    const filtered_assemblies = Object.filter(publicIndex.assemblies, x => x.is_active)
    return (Object.values(filtered_assemblies))
  },

  /* Refresh cashed data all X minutes, and ensure that data is downloaded by the
  currently logged in user */
  checkPublicIndexStatus(state, getters, rootState, rootGetters) {
    // console.log(rootGetters)

    // not access_date available
    const timeDownloaded = state.publicIndex.access_date
    if (!timeDownloaded) { return (false) }

    // Cache expired
    const CacheDurabilityMinutes = 10 // TODO: put this in environment variable.
    var timeThreshold = Date.now()
    timeThreshold = date.subtractFromDate(timeThreshold, { minutes: CacheDurabilityMinutes })
    return (timeDownloaded < timeThreshold)
  },

  /* SHORTCUTS: mainly for artificial moderators */
  IsThereAnAssemblyInPublicState: (state) => {
    if (state.published_assemblies == null) {
      return (null)
    }
    return (state.published_assemblies.length > 0)
  },

  IsThereAnAssemblyOngoing: (state) => {
    if (getters.ongoing_assemblies(state) === null) {
      return (null)
    }
    return (getters.ongoing_assemblies(state).length > 0)
  },

  IsThereNothingGoingOn: (state) => {
    if (getters.IsThereAnAssemblyInPublicState(state) === null || getters.IsThereAnAssemblyInPublicState(state) === null) {
      return (null)
    }

    return (!getters.IsThereAnAssemblyOngoing(state) && !getters.IsThereAnAssemblyInPublicState(state))
  }
}

const actions = {

  syncPublicIndex: ({ state, dispatch, localgetters, rootState, rootGetters }) => {

    if (state.publicIndex === null || state.publicIndex === undefined) {
      // no cached version exists: load the data from resource server...
      dispatch('retrievePublicIndex')
      return (null)
    }

    // renew cache all x- minutes
    if (!getters.checkPublicIndexStatus(state, getters, rootState, rootGetters)) {
      // too old cache: load the data from resource server...
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
        console.warn(error)
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
