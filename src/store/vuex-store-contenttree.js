/* ContentTree are stored in LocalStorage. */

import Vue from 'vue'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import api from 'src/utils/api'

var state = {
  contenttree: {},
  expanded_branches: {}
}

const getters = {
  
  get_contenttree: (state) => ({contenttreeID}) => {
    // return state.things.find(thing => thing.identifier === id)
    console.assert(contenttreeID)
    if (!(contenttreeID in state.contenttree)) {
      return (null)
    }
    
    return (state.contenttree[contenttreeID])
  },
  
  get_default_expanded_branches_from_store: (state) => ({contenttreeID, startingContentID}) => {
    let key = contenttreeID + "-" + startingContentID
    if(!(key in state.expanded_branches)) {
      return(null)
    }
    
    return(state.expanded_branches[key])
  },
  
  
  /* Refresh cashed data all X minutes, and ensure that data is downloaded by the
  currently logged in user */
  checkContentTreeStatus({state, getters, rootState, rootGetters}, {contenttreeID}) {
    console.log('check assembly status')
    
    // not access_date available
    const timeDownloaded = Vue.moment(state.contenttree[contenttreeID].access_date)
    if (!timeDownloaded) { return (false)}

    // Cache expired
    const CacheDurabilityMinutes = 10 // TODO: put this in environment variable.
    const timeThreshold = Vue.moment(new Date())
    timeThreshold.subtract(CacheDurabilityMinutes, 'minutes')
    if (timeDownloaded < timeThreshold) {
      return (false)
    }

    // Wrong user?
    const compare_func = rootGetters['oauthstore/is_current_oauth_userid']
    const cached_userid = state.contenttree[contenttreeID].access_sub
    return (compare_func(cached_userid))
  }
}

const actions = {

  /* Retrieve new version of the contenttree <assemblyIdentifier>.<contenttreeID>
  If timelag is set to true, the method will wait a few seconds to give priority the other 
  API-Requests. (e.g. RetrieveAssembly)
  TODO: is there a better way to queue API Requests. 
  (Consider also the problem of oAuth2 Token refreshs, that are then issued twice..)
  */
  retrieveContenttree({commit}, {assemblyIdentifier, contenttreeID, timelag}) {

    const timeout = timelag ? 5 : 0
    setTimeout(() => {

      console.log("Retrieve contenttree from resource server" + contenttreeID)
      console.assert(contenttreeID)
      api.retrieveContenttree(assemblyIdentifier, contenttreeID)
      .then(
        response => {
          // update
          LayoutEventBus.$emit('hideLoading')
          console.log('save full contenttree to cache.')
          console.assert ('OK' in response.data)
          console.assert ('contenttree' in response.data)
          // this.add_or_update_contenttree({contenttreeID: contenttreeID, contenttree: response.data.contenttree})
          commit('add_or_update_contenttree', {contenttreeID: contenttreeID, contenttree: response.data.contenttree});
        }
      )
      .catch(
        console.log("request error")
      )
    })
  },

  add_or_update_contenttree({commit}, {contenttreeID, contenttree}) {
    commit('add_or_update_contenttree', {contenttreeID, contenttree});
  },

  update_contents({commit}, {modifiedContents}) {
    commit('update_contents', {modifiedContents});
  },

  update_expanded_branches({commit}, {contenttreeID, startingContentID, expanded}) {
    // console.log(expanded)
    commit('update_expanded_branches', {contenttreeID, startingContentID, expanded});
  },

  syncContenttree: ({state, dispatch, localgetters, rootState, rootGetters}, {assemblyIdentifier, contenttreeID}) => {
    console.log(` sync contenttree ${contenttreeID}`)
    console.assert(contenttreeID)
    if(!state.contenttree || !(contenttreeID in state.contenttree)) {
      // no cached version exists: load the data from resource server...
      console.log("First time load of contenttree")
      dispatch('retrieveContenttree', {assemblyIdentifier: assemblyIdentifier, contenttreeID: contenttreeID})
      return(null)
    }
    
    // renew cache all x- minutes
    if (!getters.checkContentTreeStatus({state, getters, rootState, rootGetters}, {contenttreeID})) {
      // too old cache: load the data from resource server...
      console.log("Cache expired: reload contenttree")
      dispatch('retrieveContenttree', {
        assemblyIdentifier: assemblyIdentifier,
        contenttreeID: contenttreeID,
        timelag: true
      })
    }

    return(null)
  }
}

const mutations = {

  add_or_update_contenttree(state, {contenttreeID, contenttree}) {

    // keep list of opened contents (if previously available)
    console.log("update contenttree")
    if(contenttreeID in state.contenttree) {
      let expanded = state.contenttree[contenttreeID].expanded_by_default
      if(expanded) {
        console.log("restore list of expanded entries")
        content.expanded_by_default = expanded
      }
    }

    console.log("new copy saved...")
    Vue.set(state.contenttree, contenttreeID, contenttree)
  },
  
  update_contents(state, {modifiedContents}) {
    // in case content or progression changes (without changing hirarchy...)
    for(let contentID in modifiedContents) {
      let modifiedContent = modifiedContents[contentID]
      let contenttreeID = modifiedContent.content.contenttreeID
      Vue.set(state.contenttree[contenttreeID].entries, modifiedContent.content.id, modifiedContent)
    }
  },

  update_expanded_branches(state, {contenttreeID, startingContentID, expanded}) {
    // in case content or progression changes (without changing hierarchy...)
    let key = contenttreeID + "-" + startingContentID
    console.log(expanded)
    Vue.set(state.expanded_branches, key, expanded)
  }
}

export const contentstore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}