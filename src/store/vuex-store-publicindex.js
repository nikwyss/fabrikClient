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

  published_assemblies: function(state) {
    const publicIndex = state.publicIndex

    if (publicIndex===null || publicIndex === undefined){
      return (null)
    }

    // alert(state.published_assemblies)
    return(publicIndex.assemblies.filter(x => x.is_public))
  },

  ongoing_assemblies: function(state) {
    const publicIndex = state.publicIndex
    if (publicIndex===null){
      return (null)
    }
    return(publicIndex.assemblies.filter(x => x.is_active))
  },

  /* Refresh cashed data all X minutes, and ensure that data is downloaded by the
  currently logged in user */
  checkPublicIndexStatus: function (state) {
    
    // not access_date availabl
    const timeDownloaded = Vue.moment(state.publicIndex.access_date)
    if (!timeDownloaded) { return (false)}
    
    // Cache expired
    const MonitorFrequency = 20 // TODO: put this in environment variable.
    const timeThreshold = Vue.moment(new Date())
    timeThreshold.subtract(MonitorFrequency, 'minutes')
    if (timeDownloaded < timeThreshold) {
      return (false)
    }

    // Wrong user
    return (true)
  },

  /* SHORTCUTS: mainly for artificial moderators */
  IsThereAnAssemblyInPublicState: function() {
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
    if (getters.ongoing_assemblies(state) === null) {
      return (null)
    }

    return (!getters.IsThereAnAssemblyOngoing(state) && !getters.IsThereAnAssemblyOngoing(state))
  },

  IsUserDelegateOfOngoingAssembly: function (state) {

    // data not yet loaded
    const ongoing_assemblies = getters.ongoing_assemblies(state);
    if (ongoing_assemblies === null) {
      return (null)
    }
    // Check if there is at least one ongoing assembly.
    if (ongoing_assemblies.length === 0) {
      return (false)
    }

    // Check permissions:
    let accessibleAssemblies = ongoing_assemblies.filter(x => x.am_is_accessible_by_current_user)
    return (accessibleAssemblies.length > 0)
  }
}

const actions = {

  syncPublicIndex: ({state, dispatch}) => {

    if(state.publicIndex===null || state.publicIndex === undefined) {
      // no cached version exists: load the data from resource server...
      dispatch('retrievePublicIndex')
      return(null)
    }

    // renew cache all x- minutes
    if (!getters.checkPublicIndexStatus(state)) {
      // too old cache: load the data from resource server...
      dispatch('retrievePublicIndex')
    }

    return(null)
  },

  retrievePublicIndex({commit}) {
    console.log("Retrieve publicIndex from resource server")
    api.retrievePublicIndex().then(
      response => {

        // save data
        console.assert (response.data !== null && response.data !== undefined)
        console.log('save full contenttree to cache.')
        commit('add_or_update_publicIndex', response.data)

        // end loading
        LayoutEventBus.$emit('hideLoading')

      }
    )
  }
}

const mutations = {
  add_or_update_publicIndex (state, publicIndex) {
    // Vue.set  makes the change reactive!!
    Vue.set(state, 'publicIndex', publicIndex)
  }
}

export const publicindexstore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
