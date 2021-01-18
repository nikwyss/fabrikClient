/* ContentTree are stored in LocalStorage. */

import Vue from 'vue'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import api from 'src/utils/api'
import { date } from 'quasar'


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
    let key = contenttreeID + '-' + startingContentID
    if(!(key in state.expanded_branches)) {
      return(null)
    }
    
    return(state.expanded_branches[key])
  },

  get_allowed_node_types: (state) => ({contenttreeID, parentType}) => {
    
    if (parentType===undefined) {
      // console.log(state.contenttree[contenttreeID].configuration)
      return (state.contenttree[contenttreeID].configuration.CONTENTTYPES)
    }
    // console.log(parentType)
    return (state.contenttree[contenttreeID].configuration.ONTOLOGY[parentType])
  },

  /* Refresh cashed data all X minutes, and ensure that data is downloaded by the
  currently logged in user */
  checkContentTreeStatus({state, getters, rootState, rootGetters}, {contenttreeID, oauthUserID}) {
    console.log('check assembly status')
    
    // not access_date available
    const timeDownloaded = state.contenttree[contenttreeID].access_date
    if (!timeDownloaded) { return (false)}

    // Cache expired
    const CacheDurabilityMinutes = 10 // TODO: put this in environment variable.
    var timeThreshold = Date.now()
    timeThreshold = date.subtractFromDate(timeThreshold, { minutes: CacheDurabilityMinutes})    
    if (timeDownloaded < timeThreshold) {
      return (false)
    }

    // Wrong user?
    const cached_userid = state.contenttree[contenttreeID].access_sub
    return (cached_userid == oauthUserID)
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

      console.log('Retrieve contenttree from resource server' + contenttreeID)
      console.assert(contenttreeID)
      api.retrieveContenttree(assemblyIdentifier, contenttreeID)
      .then(
        response => {
          // update
          console.assert(response.data)
          
          LayoutEventBus.$emit('hideLoading')
          console.log('save full contenttree to cache.')
          console.assert ('OK' in response.data)
          console.assert ('contenttree' in response.data)
          let configuration = 'configuration' in response.data ? response.data.configuration : null 

          commit('add_or_update_contenttree', {
            contenttreeID: contenttreeID,
            contenttree: response.data.contenttree,
            configuration: configuration
          });
        }
      )
      .catch(
        console.log('request error')
      )
    })
  },

  add_or_update_contenttree({commit}, {contenttreeID, contenttree, configuration}) {
    commit('add_or_update_contenttree', {contenttreeID, contenttree, configuration});
  },

  update_contents({commit}, {modifiedContents}) {
    commit('update_contents', {modifiedContents});
  },

  update_expanded_branches({commit}, {contenttreeID, startingContentID, expanded}) {
    // console.log(expanded)
    commit('update_expanded_branches', {contenttreeID, startingContentID, expanded});
  },

  syncContenttree: ({state, dispatch, localgetters, rootState, rootGetters}, {assemblyIdentifier, contenttreeID, oauthUserID}) => {
    console.log(` sync contenttree ${contenttreeID}`)
    console.assert(contenttreeID)
    if(!state.contenttree || !(contenttreeID in state.contenttree)) {
      // no cached version exists: load the data from resource server...
      console.log('First time load of contenttree')
      dispatch('retrieveContenttree', {assemblyIdentifier: assemblyIdentifier, contenttreeID: contenttreeID})
      return(null)
    }
    
    // renew cache all x- minutes
    if (!getters.checkContentTreeStatus({state, getters, rootState, rootGetters}, {contenttreeID, oauthUserID})) {
      // too old cache: load the data from resource server...
      console.log('Cache expired: reload contenttree')
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

  add_or_update_contenttree(state, {contenttreeID, contenttree, configuration}) {

    // keep list of opened contents (if previously available)
    console.log('update contenttree')
    let configuration_old = null;
    let expanded_old = null;
    if(contenttreeID in state.contenttree) {
      expanded_old = state.contenttree[contenttreeID].expanded_by_default
      configuration_old = state.contenttree[contenttreeID].configuration
    }
    console.log(configuration)

    contenttree.configuration = configuration ? configuration : configuration_old
    if (expanded_old) {
      contenttree.expanded =  expanded_old
    }
    console.log(contenttree)
    console.log('new copy saved...')
    Vue.set(state.contenttree, contenttreeID, contenttree)
  },

  update_contents(state, {modifiedContents}) {
    // in case content or progression changes (without changing hirarchy...)
    console.assert(modifiedContents !== undefined)
    console.assert(modifiedContents !== null)
    for(let contentID in modifiedContents) {
      console.log('modified contents: ' + contentID)

      let modifiedContent = modifiedContents[contentID]
      console.log(modifiedContent)
      let contenttreeID = modifiedContent.content.contenttree_id
      if (modifiedContent.progression) {
        Vue.set(state.contenttree[contenttreeID].entries[modifiedContent.content.id], 'progression', modifiedContent.progression)
      }
      if (modifiedContent.content) {
        Vue.set(state.contenttree[contenttreeID].entries[modifiedContent.content.id], 'content', modifiedContent.content)
      }
      if (modifiedContent.creator) {
        Vue.set(state.contenttree[contenttreeID].entries[modifiedContent.content.id], 'creator', modifiedContent.creator)
      }
    }
  },

  update_expanded_branches(state, {contenttreeID, startingContentID, expanded}) {
    // in case content or progression changes (without changing hierarchy...)
    let key = contenttreeID + '-' + startingContentID
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