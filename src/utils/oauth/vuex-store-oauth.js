/* 
Using Vuex as global cookie getter. Seems a appropriate way to make sure, 
that cookies become responsive and that getter runs only once in Vue session.

From Vuejs doc: Vuex allows us to define "getters" in the store. You can think of them as computed properties
for stores. Like computed properties, a getter's result is cached based on its dependencies,
and will only re-evaluate when some of its dependencies have changed.
(Hence, getter are run only when Vue-boot or content-change)
*/

import Vue from 'vue'
import {get_cookie_value} from 'src/utils/cookie.service'
import {oAuthService} from "src/utils/oauth/requests"

var state = {
    oauth_update_date: null
}

const getters = {

    retrieve_oauth_data: function (state) {

        if (!!state.oauth_update_date || state.oauth_update_date <= new Date()){
          console.log("READ JWT FROM COOKIE  (should only run once per Vue mounting)")
          const oauth_jwt = get_cookie_value('oauth_jwt')
          if (oauth_jwt) {
            console.log("DECODE JWT")
            return (oAuthService.tokenDecode(oauth_jwt))
          }
        }

        return (null)
    }
}

const actions = {
   
    /* This is a helper method to force Vuex-Getter to be updated, when Oauth Cookie changes.
    Note: Cookies are not responsive in Vuejs by default. 
    */ 
    oauthUpdate: ({commit}, {newdate}) => {
        commit('oauth_update_date', {newdate})
    }
}

const mutations = {

  oauth_update_date (state, {newdate}) {
    Vue.set(state, 'oauth_update_date', newdate)
  }
}

export const oauthstore = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}