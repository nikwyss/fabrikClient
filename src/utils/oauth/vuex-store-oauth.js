/* 
Using Vuex as global cookie getter. Seems a appropriate way to make sure, 
that cookies become responsive and that getter runs only once in Vue session.

From Vuejs doc: Vuex allows us to define "getters" in the store. You can think of them as computed properties
for stores. Like computed properties, a getter's result is cached based on its dependencies,
and will only re-evaluate when some of its dependencies have changed.
(Hence, getter are run only when Vue-boot or content-change)
*/

import Vue from 'vue'
import {get_cookie_value, set_cookie_value} from 'src/utils/cookie.service'
import {oAuthService} from "src/utils/oauth/requests"
import { ApiService } from 'src/utils/xhr'
import oauth from '.'

const empty_credentials = {
  aud: null,
  authtype: null,
  expiration: null,
  iss: null,
  roles: null,
  sub: null,
  userName: null}

var state = {
    oauth_update_date: null,
    oauth_credentials: empty_credentials
}

const getters = {

  retrieveCredentials: function (state) {
    return (state.oauth_credentials)
  },

  oauth_ongoing: function () {
    const oauth_random_state = get_cookie_value('oauth_random_state')
    return(!!oauth_random_state)
  },

  oauth_username: (state) => {
    // console.log("READ userid...........")
    const credentials = getters.retrieveCredentials(state)
    console.assert (credentials)
    return (credentials['userName'])
  },
  
  oauth_userid: (state) => {
    // console.log("READ userid...........")
    const credentials = getters.retrieveCredentials(state)
    console.assert (credentials)
    return (credentials['sub'])
  },
  
    
  oauth_roles: (state) => {
    // console.log("READ userid...........")
    const credentials = getters.retrieveCredentials(state)
    console.assert (credentials)
    return (credentials['roles'])
  },

  oauth_authenticated: (state) => {
    // console.log("READ userid...........")
    const oauth_userid = getters.oauth_userid(state)
    return (!!oauth_userid)
  },
  
  is_current_oauth_userid: (state) => (cached_userid) => {
    // console.log("READ userid...........")
    const oauth_userid = getters.oauth_userid(state)
    return (oauth_userid == cached_userid)
  },

  /* Returns a list of all roles obtained by the authenticated user 
  for the given assembly */
  assembly_acls: (state) => (assemblyIdentifier) => {
    // console.log("CHECK ACLs for current assembly...........")
    const oauth_roles = getters.oauth_roles(state)
    if (!oauth_roles){
      return []
    }
    var assembly_roles = oauth_roles.filter(function (el) {
      return el.endsWith(`@${assemblyIdentifier}`);
    });

    var assembly_acls = assembly_roles.map(function (el) {
      return el.split('@')[0]
    });

    return (assembly_acls)
  }
}

const actions = {

  /* This is a helper method to force Vuex-Getter to be updated, when Oauth Cookie changes.
  Note: Cookies are not responsive in Vuejs by default. 
  */
  oauthUpdate: ({commit, dispatch}, {newdate, newjwt}) => {
    console.log("UPDATE OAUTH")

    if (newdate) {
      commit('oauth_update_date', {newdate})
    }

    // Store newest credentials in localstorages:
    if (newjwt===undefined){

      // no credentials are transmitted. Just (re-)read them from cookies
      console.log("Read JWT from cookie...")
      newjwt = get_cookie_value('oauth_jwt')

    }

    // JWT is empty: initiate new JWT Request... 
    if (newjwt===null){

      const oauthProvider = get_cookie_value('oauth_provider')
      const refreshToken = get_cookie_value('oauth_refresh_token')

      if (!!refreshToken && !!oauthProvider) {

        dispatch('retrieveNewJWT', {refreshToken, oauthProvider})

      }else if (!!refreshToken !== !!oauthProvider) {
        
        // error: refreshToken or Provider are not valid: Reset everything.
        console.log("Provider or RefreshTOken is missing: Reset everything")
        dispatch('resetEverything', {})

      } else {

        // Not authenticated.
        // all correctly configured.

      }

    }else{

      // credentials have been transmitted as method parameter
      // Everything seems to be alright
      commit('oauth_update_credentials', newjwt)
    }
  },

  resetEverything: ({commit, dispatch}) => {
    console.log("RESET EVERYTHIN: localstorage and cookie")
    set_cookie_value('oauth_jwt', null)
    set_cookie_value('oauth_provider', null)
    set_cookie_value('oauth_random_state', null)
    set_cookie_value('oauth_refresh_token', null)
    commit('oauth_update_credentials', null)
  },

    /* Retrieve a new jwt token: async */ 
  async retrieveNewJWT ({commit}, {oauthProvider, refreshToken}) {
    console.log("Retrieve new OAUTH")

    if (!refreshToken || !oauthProvider) {
      oauthProvider = get_cookie_value('oauth_provider')
      refreshToken = get_cookie_value('oauth_refresh_token')
    }
    
    console.assert(oauthProvider)
    console.assert(refreshToken)
    let token = await oAuthService.tokenRefresh(oauthProvider, refreshToken)
    console.assert('access_token' in token)
    console.assert('refresh_token' in token)
    console.log("after refresh")

    set_cookie_value('oauth_jwt', token['access_token'])
    set_cookie_value('oauth_refresh_token', token['refresh_token'])
    console.assert(token['access_token'])
    console.assert(token['refresh_token'])

    const jwt = token['access_token']
    commit('oauth_update_credentials', jwt)

    return(token['access_token'])

  }
}

const mutations = {

  oauth_update_date (state, {newdate}) {
    Vue.set(state, 'oauth_update_date', newdate)
  },

  oauth_update_credentials (state, jwt) {

    // 1) Header for axios requests
    // Add authorization prefix for all following xhr requests.
    // console.log(" set axios header: " + jwt)
    ApiService.setHeader(jwt)

    // 2) update localstorage
    console.assert(jwt!==undefined)
    if (jwt) {
      console.log("DECODE JWT AND STORE IN LOCALSTORAGE")
      const credentials = oAuthService.tokenDecode(jwt)
      Vue.set(state, 'oauth_credentials', credentials)
    }else {
      console.log("REMOVE JWT DATA FROM LOCALSTORAGE")
      Vue.set(state, 'oauth_credentials', empty_credentials)
    }
  }
}

export const oauthstore = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}