/* ContentTree are stored in LocalStorage. */

import Vue from 'vue'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import api from 'src/utils/api'
// import { date } from 'quasar'


var state = {
  contenttree: {},
  expanded_branches: {}
}

const getters = {

  get_contenttree: (state) => ({ contenttreeID }) => {
    // return state.things.find(thing => thing.identifier === id)
    // console.log(contenttreeID)
    console.assert(contenttreeID)
    if (!(contenttreeID in state.contenttree)) {
      return (null)
    }

    return (state.contenttree[contenttreeID])
  },

  get_default_expanded_branches_from_store: (state) => ({ contenttreeID, rootNodeID }) => {
    let key = contenttreeID + '-' + rootNodeID
    if (!(key in state.expanded_branches)) {
      return (null)
    }

    return (state.expanded_branches[key])
  },

  get_allowed_node_types: (state) => ({ contenttreeID, parentType }) => {

    if (parentType === undefined) {
      // console.log(state.contenttree[contenttreeID].configuration)
      return (state.contenttree[contenttreeID].configuration.CONTENTTYPES)
    }
    // console.log(parentType)
    return (state.contenttree[contenttreeID].configuration.ONTOLOGY[parentType])
  }
}

const actions = {

  /* Retrieve new version of the contenttree <assemblyIdentifier>.<contenttreeID>
  If timelag is set to true, the method will wait a few seconds to give priority the other 
  API-Requests. (e.g. RetrieveAssembly)
  TODO: is there a better way to queue API Requests. 
  (Consider also the problem of oAuth2 Token refreshs, that are then issued twice..)
  */
  retrieveContenttree({ commit }, { assemblyIdentifier, contenttreeID, timelag }) {

    const timeout = timelag ? 5 : 0
    setTimeout(() => {

      // console.log('Retrieve contenttree from resource server' + contenttreeID)
      console.assert(contenttreeID)
      api.retrieveContenttree(assemblyIdentifier, contenttreeID)
        .then(
          response => {
            // update
            // console.log("contenttree retrieved from api.")
            console.assert(response.data)

            LayoutEventBus.$emit('hideLoading')
            // console.log('save full contenttree to cache.')
            console.assert('OK' in response.data)
            console.assert('contenttree' in response.data)
            let configuration = 'configuration' in response.data ? response.data.configuration : null

            commit('add_or_update_contenttree', {
              contenttreeID: contenttreeID,
              contenttree: response.data.contenttree,
              configuration: configuration
            });
          }
        )
        .catch((error) => {
          console.warn("Request Error", error)
        });
    })
  },

  add_or_update_contenttree({ commit }, { contenttreeID, contenttree, configuration }) {
    commit('add_or_update_contenttree', { contenttreeID, contenttree, configuration });
  },

  update_contents({ commit }, { modifiedContents }) {
    commit('update_contents', { modifiedContents });
  },

  update_rating({ commit }, { contenttreeID, contentID, rating }) {
    commit('update_rating', { contenttreeID, contentID, rating })
  },
  update_salience({ commit }, { contenttreeID, contentID, salience }) {
    commit('update_salience', { contenttreeID, contentID, salience })
  },

  update_expanded_branches({ commit }, { contenttreeID, rootNodeID, expanded }) {
    // console.log(expanded)
    commit('update_expanded_branches', { contenttreeID, rootNodeID, expanded });
  },

  deleteContentStore({ commit }) {
    commit('deleteContentStore');
  },

  syncContenttree: ({ state, dispatch, localgetters, rootState, rootGetters }, { assemblyIdentifier, contenttreeID, oauthUserID }) => {
    // console.log(` sync contenttree ${contenttreeID}`)
    // console.trace()

    // wrong user? and renew cache all x- minutes!
    const wrongUser = oauthUserID != state.contenttree[contenttreeID]?.access_sub
    if (wrongUser) {
      Vue.set(state, 'contenttree', {})
    }

    const emptyContenttree = !(state.contenttree[contenttreeID])
    const expired = !emptyContenttree && api.expiredCacheDate(state.contenttree[contenttreeID]?.access_date)
    if (!expired && !emptyContenttree && !wrongUser) {
      // CACHE IS UP TO DATE!
      // console.log('Contenttree Cache IS UP TO DATE')
      return (true)
    }

    // too old or missing cache: load the data from resource server...
    console.log('Cache invalid: reload contenttree', expired, wrongUser, emptyContenttree)
    dispatch('retrieveContenttree', {
      assemblyIdentifier: assemblyIdentifier,
      contenttreeID: contenttreeID,
      timelag: true
    })
  }
}


const mutations = {

  add_or_update_contenttree(state, { contenttreeID, contenttree, configuration }) {

    // keep list of opened contents (if previously available)
    // console.log('update contenttree')
    let configuration_old = null;
    let expanded_old = null;
    if (contenttreeID in state.contenttree) {
      expanded_old = state.contenttree[contenttreeID].expanded_by_default
      configuration_old = state.contenttree[contenttreeID].configuration
    }
    // console.log(configuration)

    contenttree.configuration = configuration ? configuration : configuration_old
    if (expanded_old) {
      contenttree.expanded = expanded_old
    }
    // console.log(contenttree)
    // console.log('new copy saved...')
    Vue.set(state.contenttree, contenttreeID, contenttree)
  },

  update_contents(state, { modifiedContents }) {
    // in case content or progression changes (without changing hirarchy...)
    console.assert(modifiedContents !== undefined)
    console.assert(modifiedContents !== null)
    for (let contentID in modifiedContents) {
      // console.log('modified contents: ' + contentID)

      let modifiedContent = modifiedContents[contentID]
      // console.log(modifiedContent)
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
    // console.log("updated contenttree content", modifiedContents)
  },

  update_expanded_branches(state, { contenttreeID, rootNodeID, expanded }) {
    // in case content or progression changes (without changing hierarchy...)
    let key = contenttreeID + '-' + rootNodeID
    // console.log(expanded)
    Vue.set(state.expanded_branches, key, expanded)
  },

  delete_contenttree(state, { contenttreeID }) {
    // in case content or progression changes (without changing hierarchy...)
    // console.log(expanded)
    Vue.set(state.contenttree, key, null)
  },


  update_rating(state, { contenttreeID, contentID, rating }) {
    // in case content or progression changes (without changing hierarchy...)
    if (rating === null || rating === undefined) {
      // invalid rating value
      // console.log("empty rating")
      return (null)
    }

    // let key = contenttreeID + '-' + rootNodeID
    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      // console.log("add temp progression entry")
      progression = {
        read: true,
        view: false
      }
    }

    // store value
    progression.rating = rating
    progression.rated = true
    Vue.set(state.contenttree[contenttreeID].entries[contentID], 'progression', progression)
  },

  update_salience(state, { contenttreeID, contentID, salience }) {
    // in case content or progression changes (without changing hierarchy...)
    if (salience === null || salience === undefined) {
      // invalid salience value
      // console.log("empty salience")
      return (null)
    }

    // let key = contenttreeID + '-' + rootNodeID
    let progression = state.contenttree[contenttreeID]?.entries[contentID]?.progression
    if (!progression) {
      // console.log("add temp progression entry")
      progression = {
        read: true,
        view: false
      }
    }

    // store value
    progression.salience = salience
    progression.salienced = true
    Vue.set(state.contenttree[contenttreeID].entries[contentID], 'progression', progression)
    // console.log("new salience stored: ", rating)
  },

  deleteContentStore(state) {
    Vue.set(state, 'contenttree', {})
    Vue.set(state, 'expanded_branches', {})
  }
}

export const contentstore = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
