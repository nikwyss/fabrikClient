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
  },

  actions: {

    clearUserData: ({ state, dispatch, commit }) => {
      /* resets the counter to zero */
      dispatch('monitorExit')
      dispatch('publicprofilestore/deletePublicProfile', { commit })
      dispatch('contentstore/deleteContentStore', { commit })
      dispatch('assemblystore/deleteAssemblyStore', { commit })
    },

    monitorSetup: ({ state, dispatch, commit }) => {
      /* resets the counter to zero */
      commit('monitor_setup')
      console.log("/setup ")
    },

    monitorExit: ({ state, dispatch, commit }) => {
      /* resets the counter to zero */
      commit('monitor_reset', {})
      const now = null
      commit('monitor_update_date', { now })
    },

    monitorReset: ({ state, dispatch, commit }) => {
      /* resets the counter to zero */
      console.log('API Monitored. => Clear Buffer')
      commit('monitor_reset', {})
    },


    /** Fire events - in any cases */
    monitorFire: ({ state, dispatch, commit }, { eventString, data }) => {
      // console.log("/fire ", eventString)

      // add newest event to the event buffer
      if (eventString) {
        // empty event is possible => only send buffered events to api (if time is ready)
        commit('monitor_add', { eventString, data })
      }

      // console.log("/" + state.monitor_buffer?.length)

      if (!state.monitor_buffer || state.monitor_buffer.length == 0) {
        return (null)
      }

      // Send API Monitor
      // console.log("/f")

      // update last-update date;-)
      const now = new Date()
      commit('monitor_update_date', { now })

      api.monitorActivities(state.monitor_buffer).then(data => {
        if (!data.ok) { return (null) }
        console.log("ACTION MONITORED: OK!")

        // Write newest data to the store!
        dispatch('updateStore', { data: data.response })

        // Dealing with Data response)
        // Most monitors do not give a response. However, when progression entry has just been
        // created or significantly modified, then progression entry is returned.
        // console.log('API Monitored. => Buffer cleared')
        commit('monitor_reset', { now })
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
      if (!state.monitor_buffer || state.monitor_buffer.length == 0) {
        return (null)
      }

      // Check if intervall is passed => so buffer events are fiired!
      // console.log("/t")
      const now = Date.now()
      if (getDateDiff(now, state.monitor_date, 'seconds') < (parseInt(process.env.ENV_APISERVER_MONITOR_INTERVAL_SECONDS) * 2)) {
        return (null)
      }

      // manually fiire the monitor log
      // console.log("/f")
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

    monitor_update_date(state, { now }) {
      Vue.set(state, 'monitor_date', now)
    },

    /** Delete all  buffered events [ before the date transmitted...] */
    monitor_reset(state, { now }) {
      if (!now) {
        now = new Date()
      }

      if (!state.monitor_buffer) {
        return null
      }

      // FILTER ONLY THE ONES AFTER THE GIVEN DATE
      // console.log("reset buffer")
      const newbuffer = state.monitor_buffer.filter(event => {
        return getDateDiff(event.date, now, 'seconds') > 0
      })
      Vue.set(state, 'monitor_date', now)
      Vue.set(state, 'monitor_buffer', newbuffer)
    }
  }
})