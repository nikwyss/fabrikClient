/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import api from 'src/utils/api'
import { LayoutEventBus } from 'src/utils/eventbus.js'
// import { date } from 'quasar'

var state = {
  publicProfile: {}
}

const getters = {

  get_public_profile: function (state) {
    console.log('get public profile')
    console.log(state.publicProfile)
    if (!state.publicProfile) {
      return (null)
    }

    return (state.publicProfile.user)
  }
}

const actions = {

  syncProfile: ({ state, dispatch, localgetters, rootState, rootGetters }, { oauthUserID }) => {
    console.log(` sync public profile`)

    if (!state.publicProfile) {
      // no cached version exists: load the data from resource server...
      dispatch('retrievePublicProfile')
      console.log(' not yet fetched...')
      return (null)
    }

    // wrong user? and renew cache all x- minutes!
    const wrongUser = oauthUserID != state.publicProfile.access_sub
    const expired = api.expiredCacheDate(state.publicProfile.access_date)
    if (expired || wrongUser) {
      console.log(' not in sync  or wrong user...')
      dispatch('retrievePublicProfile')
    }

    return (null)
  },

  retrievePublicProfile({ commit }) {

    console.log('Retrieve public profile from resource server')
    api.publicProfile()
      .then(
        response => {

          console.log('save retrieved profile to cache.')
          const data = response.data
          console.log(data)
          commit('storePublicProfile', { data })

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

  storePublicProfile(state, { data }) {
    // Vue.set  makes the change reactive!!
    Vue.set(state, 'publicProfile', data)
  }
}

export const publicprofilestore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
