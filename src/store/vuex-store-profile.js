/* Public Index: the publically accessible list of all potential accessible assemblies:
- assemblies that are currently ongoing (require invitation)
- assemblies that have been published (accessible by the public)
*/
import Vue from 'vue'
import api from 'src/utils/api'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { Router } from 'src/router'

var state = {
  publicProfile: {},
  oauthAcls: []
}

const getters = {

  get_public_profile: function (state) {
    // console.log('get public profile (VUEX)')
    // console.log(state.publicProfile)
    if (!state.publicProfile) {
      return (null)
    }

    return (state.publicProfile.user)
  },

  oauthAcls: function (state) {
    console.log('get acls transmitted via JWT token')
    return (state.oauthAcls)
  },

  translateOauthAcls: (state, getters) => (assemblyIdentifier) => {

    const roles = getters.oauthAcls
    if (!roles) {
      return []
    }

    var assembly_roles = roles.filter(function (el) {
      return el.endsWith(`@${assemblyIdentifier}`);
    })

    var assembly_roles = assembly_roles.map(function (el) {
      return el.split('@')[0]
    })

    const assemblyAcls = []
    if (assembly_roles.includes('administrator')) {
      assemblyAcls.push('administrate', 'manage', 'observe')
    }
    if (assembly_roles.includes('manager')) {
      assemblyAcls.push('manage', 'observe')
    }

    if (assembly_roles.includes('delegate')) {
      assemblyAcls.push('delegate', 'contribute', 'observe')
    }

    if (assembly_roles.includes('contributor')) {
      assemblyAcls.push('contribute', 'observe')
    }

    if (assembly_roles.includes('expert')) {
      assemblyAcls.push('expert', 'observe')
    }

    // TODO: Are visitors welcome within this assembly???
    if (Vue.prototype.pkce.isAuthorized()) {
      assemblyAcls.push('observe')
    }

    return (assemblyAcls)
  }
}

const actions = {

  syncProfile: ({ state, dispatch, localgetters, rootState, rootGetters }, { oauthUserID, oauthUserEmail }) => {
    // console.log(` sync public profile`, oauthUserEmail)

    if (!oauthUserID) {
      // Not logged in. DELETE ALL
      dispatch('deletePublicProfile')
      return (null)
    }

    if (!state.publicProfile) {
      dispatch('retrievePublicProfile', { oauthUserID, oauthUserEmail })
      return (null)
    }

    // wrong user? and renew cache all x- minutes!
    const wrongUser = oauthUserID != state.publicProfile.access_sub
    if (wrongUser) {
      dispatch('deletePublicProfile')
    }

    const expired = api.expiredCacheDate(state.publicProfile?.access_date)
    if (expired || wrongUser) {
      console.log(' Public Profile not in sync  or wrong user...')
      dispatch('retrievePublicProfile', { oauthUserID, oauthUserEmail })
      return (null)
    }

    dispatch('checkProfileRequirements', { oauthUserID, oauthUserEmail })
    return (null)
  },

  checkProfileRequirements: ({ state, dispatch, localgetters, rootState, rootGetters }, { oauthUserID, oauthUserEmail }) => {
    // console.log(` check public profile requirements`, oauthUserEmail)

    // CHECK Profile requierments
    // console.log("CHECK STATE PROFILE")
    if (!oauthUserEmail) {
      // console.log(state.publicProfile)
      dispatch('gotoProfile')
    }

    return (null)
  },

  gotoProfile: ({ state, dispatch, localgetters, rootState, rootGetters }) => {
    // console.log(` goto public profile`)

    // CHECK Profile requierments
    const destination_route = Router.currentRouteObject();
    console.log(destination_route)

    if (destination_route.name == "profile") {
      LayoutEventBus.$emit("reload");
    } else {
      Router.push({
        name: "profile",
        params: { destination_route: destination_route },
      });
    }
  },

  deletePublicProfile({ commit }) {
    commit('storePublicProfile', {})
  },

  retrievePublicProfile({ commit, dispatch }, { oauthUserID, oauthUserEmail }) {

    // console.log('Retrieve public profile from resource server', oauthUserEmail)
    api.publicProfile()
      .then(
        response => {

          // console.log('save retrieved profile to cache.')
          const data = response.data
          commit('storePublicProfile', { data })

          dispatch('checkProfileRequirements', { oauthUserID, oauthUserEmail })

          // end loading
          LayoutEventBus.$emit('hideLoading')
          return (null)

        }
      )
      .catch((error) => {
        console.warn(error)
        // Error Handling is done in Axios Interceptor
        console.warn('Request Error')
      })
  },

  storeOauthAcls: ({ commit }, { oauthAcls }) => {
    commit('storeOauthAcls', oauthAcls)
  },

}

const mutations = {

  storePublicProfile(state, { data }) {
    Vue.set(state, 'publicProfile', data)
  },

  storeOauthAcls(state, oauthAcls) {
    Vue.set(state, 'oauthAcls', oauthAcls)
  },

}

export const publicprofilestore = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
