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

    get_contenttree: (state) => (container_id) => {
        // return state.things.find(thing => thing.id === id)
        // if(!("contenttree" in state)){
        //     state.contenttree = {}
        // }

        if(!(container_id in state.contenttree)){
            return(null)
        }
        return(state.contenttree[container_id])
    },

    get_default_expanded_branches_from_store: (state) => ({container_id, starting_content_id}) => {
        // return state.things.find(thing => thing.id === id)
        // if(!("expanded_branches" in state)){
        //     state.expanded_branches = {}
        // }

        let key = container_id + "-" + starting_content_id
        if(!(key in state.expanded_branches)){
            return(null)
        }

        return(state.expanded_branches[key])
    }
}

const actions = {
    add_or_update_contenttree({commit}, {container_id, contenttree}) {
        commit('add_or_update_content', {container_id, contenttree});
    },

    update_contents({commit}, {modified_contents}){
        commit('update_contents', {modified_contents});
    },

    update_expanded_branches({commit}, {container_id, starting_content_id, expanded}){
        // console.log(expanded)    
        commit('update_expanded_branches', {container_id, starting_content_id, expanded});
    }
}

const mutations = {

    add_or_update_content(state, {container_id, contenttree}) {
        
        // keep list of opened contents (if previously available)
        console.log("update contenttree")
        if(container_id in state.contenttree){
            let expanded = state.contenttree[container_id].expanded_by_default
            if(expanded){
                console.log("restore list of expanded entries")
                content.expanded_by_default = expanded
            }
        }

        // THIS makes the change reactive!!
        console.log("new copy saved...")
        Vue.set(state.contenttree, container_id, contenttree)
    },

    update_contents(state, {modified_contents}) {
        // in case content or progression changes (without changing hierarchy...)
        // THIS would make the change reactive!!)
        // TODO: not sure if used..
        for(let content_id in modified_contents){
            let modified_content = modified_contents[content_id]
            let container_id = modified_content.content.container_id
            state.contenttree[container_id].entries[modified_content.content.id] = modified_content;
        }
    },

    update_expanded_branches(state, {container_id, starting_content_id, expanded}) {
        // in case content or progression changes (without changing hierarchy...)
        let key = container_id + "-" + starting_content_id
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