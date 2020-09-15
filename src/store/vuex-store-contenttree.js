/* Should trees be stored in runtime variables?
 * This would be better: for instance: <F5> will do a full refresh...
 * However: Loading Content Trees is resource intensive. Think it is worth to store them
 * in local storage.
*/

import Vue from 'vue'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import Configuration from 'src/utils/configuration'
import ApiService from "src/utils/xhr"

var state = {
    contenttree: {},
    expanded_branches: {}
}

const getters = {

    get_contenttree: (state, dispatch) => ({contenttreeID, assemblyIdentifier}) => {

        if(!(contenttreeID in state.contenttree)) {

            // no cached version exists: load the full tree...
            dispatch('contenttreestore/retrieve_contenttree', {
                assemblyIdentifier: assemblyIdentifier,
                contenttreeID: contenttreeID
            })

            return(null)
        }

        LayoutEventBus.$emit('hideLoading')

        return(state.contenttree[contenttreeID])
    },

    get_default_expanded_branches_from_store: (state) => ({contenttreeID, startingContentID}) => {
        // return state.things.find(thing => thing.id === id)
        // if(!("expanded_branches" in state)) {
        //     state.expanded_branches = {}
        // }

        let key = contenttreeID + "-" + startingContentID
        if(!(key in state.expanded_branches)) {
            return(null)
        }

        return(state.expanded_branches[key])
    }
}

const actions = {

    retrieve_contenttree({commit}, {contenttreeID, assemblyIdentifier}) {
        console.log("Retrieve contenttree from resource server")
        let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/contenttree`
        ApiService.get(url).then(
          response => {
            // update
            LayoutEventBus.$emit('hideLoading')
            console.log('save full contenttree to cache.')
            console.assert ('OK' in response.data)
            console.assert ('contenttree' in response.data)
            this.add_or_update_contenttree({contenttreeID: contenttreeID, contenttree: response.data.contenttree})
          }
        )
    },

    add_or_update_contenttree({commit}, {contenttreeID, contenttree}) {
        commit('add_or_update_content', {contenttreeID, contenttree});
    },

    update_contents({commit}, {modifiedContents}) {
        commit('update_contents', {modifiedContents});
    },

    update_expanded_branches({commit}, {contenttreeID, startingContentID, expanded}) {
        // console.log(expanded)
        commit('update_expanded_branches', {contenttreeID, startingContentID, expanded});
    }
}

const mutations = {

    add_or_update_content(state, {contenttreeID, contenttree}) {

        // keep list of opened contents (if previously available)
        console.log("update contenttree")
        if(contenttreeID in state.contenttree) {
            let expanded = state.contenttree[contenttreeID].expanded_by_default
            if(expanded) {
                console.log("restore list of expanded entries")
                content.expanded_by_default = expanded
            }
        }

        // THIS makes the change reactive!!
        console.log("new copy saved...")
        Vue.set(state.contenttree, contenttreeID, contenttree)
    },

    update_contents(state, {modifiedContents}) {
        // in case content or progression changes (without changing hierarchy...)
        // THIS would make the change reactive!!)
        // TODO: not sure if used..
        for(let contentID in modifiedContents) {
            let modifiedContent = modifiedContents[contentID]
            let contenttreeID = modifiedContent.content.contenttreeID
            state.contenttree[contenttreeID].entries[modifiedContent.content.id] = modifiedContent;
        }
    },

    update_expanded_branches(state, {contenttreeID, startingContentID, expanded}) {
        // in case content or progression changes (without changing hierarchy...)
        let key = contenttreeID + "-" + startingContentID
        console.log(expanded)
        state.expanded_branches[key] = expanded
    }
}

export const contentstore = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}