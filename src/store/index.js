import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'
import api from 'src/utils/api'
import { date } from 'quasar'
const { getDateDiff } = date
import { contentstore } from './vuex-store-contenttree'
import { assemblystore } from './vuex-store-assembly'
import { publicprofilestore } from './vuex-store-profile'
import { publicindexstore } from './vuex-store-publicindex'
import { pluginstore } from './vuex-plugin_store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    publicprofilestore: publicprofilestore,
    assemblystore: assemblystore,
    publicindexstore: publicindexstore,
    contentstore: contentstore,
    pluginstore: pluginstore
  },
  plugins: [createPersistedState()],
  strict: false, // disable for production
  state: {
    monitor_buffer: [],
    monitor_date: Date.now(),
    ongoingTokenRefresh: false // dont send any api requests while this boolean is set to true
  },

  getters: {
    isTokenRefreshOngoing: (state) => {
      return (state.ongoingTokenRefresh)
    }
  },

  actions: {

    tokenRefreshStarts: ({ state, dispatch, commit }) => {
      /* resets the counter to zero */
      commit('tokenRefreshStarts')
      console.log("[start token refresh]")
    },

    tokenRefreshEnds: ({ state, dispatch, commit }) => {
      /* resets the counter to zero */
      commit('tokenRefreshEnds')
      console.log("[end token refresh]")
    },

    monitorSetup: ({ state, dispatch, commit }) => {
      /* resets the counter to zero */
      commit('monitor_setup')
      console.log("/setup ")
    },


    /** Fire events - in any cases */
    monitorFire: ({ state, dispatch, commit }, { eventString, data }) => {
      console.log("/fire ", eventString)

      // add newest event to the event buffer
      if (eventString) {
        // empty event is possible => only send buffered events to api (if time is ready)
        commit('monitor_add', { eventString, data })
      }

      console.log("/" + state.monitor_buffer?.length)

      if (!state.monitor_buffer || state.monitor_buffer.length == 0) {
        return (null)
      }

      // Send API Monitor
      console.log("/q")
      api.monitorActivities(state.monitor_buffer).then(data => {
        if (!data.ok) { return (null) }
        console.log("ACTION MONITORED: OK!")


        // Write newest data to the store!
        dispatch('updateStore', { data: data.response })

        // Dealing with Data response)
        // Most monitors do not give a response. However, when progression entry has just been
        // created or significantly modified, then progression entry is returned.
        console.log('API Monitored. => Buffer cleared')
        commit('reset_monitors')


      })
    },

    /* monitor request in any case.. */
    monitorLog: ({ state, dispatch, commit }, { eventString, data }) => {
      // console.log(".", eventString)

      // add newest event to the event buffer
      if (eventString) {
        // empty event is possible => only send buffered events to api (if time is ready)
        commit('monitor_add', { eventString, data })
      }
      // console.log("/buffer")
      if (!state.monitor_buffer || state.monitor_buffer.length == 0) {
        return (null)
      }

      // Fire events
      // Push Buffered Monitors (if time is ready)
      // Check if intervall is passed => so buffer events are fiired!
      const now = Date.now()
      if (getDateDiff(now, state.monitor_date, 'seconds') < (parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS) * 2)) {
        return (null)
      }

      // Intervall does not work anymore.
      // manually fiire the monitor log
      data = {}
      eventString = null
      dispatch('monitorFire', { eventString, data })
    },


    /* monitor request in any case.. */
    updateStore: ({ state, dispatch, commit }, { data }) => {
      // console.log(".", data)

      if ('assemblies' in data) {
        Object.keys(data.assemblies).map(assemblyIdentifier => {
          const container = data.assemblies[assemblyIdentifier]
          if ('assembly' in container) {
            const assembly = container.assembly
            commit('assemblystore/storeAssemblyObject', { assemblyIdentifier, assembly })
          }
          if ('progression' in container) {
            const progression = container.progression
            commit('assemblystore/storeAssemblyProgression', { assemblyIdentifier, progression })
          }
        })

        if ('stages' in data) {
          Object.keys(data.stages).map(stageID => {
            const container = data.stages[stageID]
            if ('stage' in container) {
              const stage = container.stage
              commit('assemblystore/storeStageObject', { stageID, stage })
            }
            if ('progression' in container) {
              const progression = container.progression
              commit('assemblystore/storeStageProgression', { stageID, progression })
            }
          })
        }
      }
    }
  },

  mutations: {

    tokenRefreshEnds(state) {
      Vue.set(state, 'ongoingTokenRefresh', false)
    },

    tokenRefreshStarts(state) {
      Vue.set(state, 'ongoingTokenRefresh', true)
    },

    monitor_setup(state) {
      const now = new Date()
      Vue.set(state, 'monitor_date', now)
    },

    monitor_add(state, { eventString, data }) {
      const buffer = state.monitor_buffer
      const now = new Date()
      buffer.push({ eventString, data, date: now })
      Vue.set(state, 'monitor_buffer', buffer)
    },

    reset_monitors(state) {
      const now = new Date()
      // Clear buffer
      Vue.set(state, 'monitor_buffer', [])
      // Update last timestamp date...
      Vue.set(state, 'monitor_date', now)
    }
  }
})