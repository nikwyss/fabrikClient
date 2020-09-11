import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

import { contentstore } from './vuex-store-contenttree'
import { assemblystore } from './vuex-store-assembly'
import { pluginstore } from 'src/plugins/vuex-store'
import ApiService from "src/utils/xhr"
import Configuration from 'src/utils/configuration'

Vue.use(Vuex)

// Modules
var stores = {
  assemblystore,
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

  actions: {

    monitorApi: ({state, dispatch, commit}, { event, data}) => {

      // add some lag for this monitor method: all other ajax call have priority.
      setTimeout(function(){

        // Check if monitor intervall is passed
        const MonitorFrequency = 1 // TODO: put this in environment variable.
        const now = Vue.moment(new Date())
        const timeThreshold = now.clone()
        timeThreshold.subtract(MonitorFrequency, 'minutes')
        console.log("NOTIFY ABOUT STAGE VISIT: " + event)
        if (state.monitors[event] && timeThreshold.isBefore(state.monitors[event]) ){
          return ('No Notification needed')
        }

        // Send API Notifcation
        commit('update_monitor_date', {event, now})

        console.log("Start Notify API")
        let url = `${Configuration.value('ENV_APISERVER_URL')}/notify/${event}`
        ApiService.post(url, {content: data}).then (
          response => {

            // Empty Responses
            if (!response.data){
              return (null)
            }

            // Dealing with Data response)
            console.log("API Notified." + event)
            console.log(response.data)
            if (response.data && 'stage_progression' in response.data){
              console.log("add_or_update_stage_progression (1)")
              dispatch('assemblystore/add_or_update_stage_progression', {
                  assembly_identifier: response.data.assembly_identifier,
                  stage_id: response.data.stage_id,
                  progression: response.data.stage_progression
              })
            }
          }
        )
      }, 3000)
    }
  },

  mutations: {
    update_monitor_date (state, {event, now}) {
      Vue.set(state.monitors, event, now)
    }
  }
})