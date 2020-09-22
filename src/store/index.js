import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

import api from 'src/utils/api';
import { contentstore } from './vuex-store-contenttree'
import { assemblystore } from './vuex-store-assembly'
import { publicindexstore } from './vuex-store-publicindex'
import { pluginstore } from 'src/plugins/vuex-store'
import { oauthstore } from 'src/utils/oauth/vuex-store-oauth'

Vue.use(Vuex)

// Modules
var stores = {
  oauthstore,
  assemblystore,
  publicindexstore,
  contentstore,
  pluginstore
}

export default new Vuex.Store({
  modules: stores,
  plugins: [createPersistedState()],
  strict: false, // disable for production
  state: {
    monitors: {}
  },

  getters: {

  },

  actions: {

    /* If force= true: send monitor request in any case.. */
    monitorApi: ({state, dispatch, commit}, { event, data, timeout, force}) => {

      // add some timelag for this monitor method: all other ajax call have priority.
      // take 3 seconds as default value
      const default_timeout = 3000
      if (!timeout && timeout !== 0){ timeout = default_timeout}
      setTimeout(function(){

        console.log("initiate Monitor " + event)

        // Check if monitor intervall is passed
        const MonitorFrequency = 5 // TODO: put this in environment variable.
        const now = Vue.moment(new Date())
        const timeThreshold = now.clone()
        timeThreshold.subtract(MonitorFrequency, 'minutes')
        console.log("MONITOR STAGE VISIT: " + event)
        
        if (!force) {
          if (state.monitors[event] && timeThreshold.isBefore(state.monitors[event]) ){
            return ('No Monitor action needed')
          }
        }
        // Send API Monitor
        commit('monitor_date', {event, now})
        api.monitorActivities({event: event, data: data}).then(response => {

          // Dealing with Data response)
          // Most monitors do not give a response. However, when progression entry has just been
          // created or significantly modified, then progression entry is returned.
          if (!response.data){ return (null) }
          console.log("API Monitored." + event)

          // stage monitor
          if (response.data && 'stage_progression' in response.data){
            dispatch('assemblystore/add_or_update_stage_progression', {
                assembly_identifier: response.data.assembly_identifier,
                stage_id: response.data.stage_id,
                progression: response.data.stage_progression
            })
          }
       })
      }, timeout)
    },

    manually_update_monitor_date({state, commit}, {event}) {
      const now = Vue.moment(new Date())
      commit('monitor_date', {event, now})
    }
  },

  mutations: {

    monitor_date (state, {event, now}) {
      Vue.set(state.monitors, event, now)
    },

    // oauth_update_date (state, {newdate}) {
    //   Vue.set(state, 'oauth_update_date', newdate)
    // }
  }
})