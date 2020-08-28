/* Should trees be stored in runtime variables?
 * This would be better: for instance: <F5> will do a full refresh...
 * However: Loading Content Trees is resource intensive. Think it is worth to store them
 * in local storage.
*/

import Vue from 'vue'

var state = {
    contenttree: {},
    expanded_branches: {}
}

const getters = {

    get_contenttree: (state) => (containerID) => {
        // return state.things.find(thing => thing.id === id)
        // if(!("contenttree" in state)) {
        //     state.contenttree = {}
        // }

        if(!(containerID in state.contenttree)) {
            return(null)
        }
        return(state.contenttree[containerID])
    },

    get_default_expanded_branches_from_store: (state) => ({containerID, startingContentID}) => {
        // return state.things.find(thing => thing.id === id)
        // if(!("expanded_branches" in state)) {
        //     state.expanded_branches = {}
        // }

        let key = containerID + "-" + startingContentID
        if(!(key in state.expanded_branches)) {
            return(null)
        }

        return(state.expanded_branches[key])
    }
}

const actions = {
    add_or_update_contenttree({commit}, {containerID, contenttree}) {
        commit('add_or_update_content', {containerID, contenttree});
    },

    update_contents({commit}, {modifiedContents}) {
        commit('update_contents', {modifiedContents});
    },

    update_expanded_branches({commit}, {containerID, startingContentID, expanded}) {
        // console.log(expanded)    
        commit('update_expanded_branches', {containerID, startingContentID, expanded});
    }
}

const mutations = {

    add_or_update_content(state, {containerID, contenttree}) {
        
        // keep list of opened contents (if previously available)
        console.log("update contenttree")
        if(containerID in state.contenttree) {
            let expanded = state.contenttree[containerID].expanded_by_default
            if(expanded) {
                console.log("restore list of expanded entries")
                content.expanded_by_default = expanded
            }
        }

        // THIS makes the change reactive!!
        console.log("new copy saved...")
        Vue.set(state.contenttree, containerID, contenttree)
    },

    update_contents(state, {modifiedContents}) {
        // in case content or progression changes (without changing hierarchy...)
        // THIS would make the change reactive!!)
        // TODO: not sure if used..
        for(let contentID in modifiedContents) {
            let modifiedContent = modifiedContents[contentID]
            let containerID = modifiedContent.content.containerID
            state.contenttree[containerID].entries[modifiedContent.content.id] = modifiedContent;
        }
    },

    update_expanded_branches(state, {containerID, startingContentID, expanded}) {
        // in case content or progression changes (without changing hierarchy...)
        let key = containerID + "-" + startingContentID
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