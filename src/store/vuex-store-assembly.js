/* eslint-disable indent */
/* Stores assembly in the vuex store: it is easy likely that the assembly object is required on many pages._200
 * TODO: ALternative: create a runtime variable...
*/
import Vue from 'vue'
import { store } from 'quasar/wrappers'

var state = {
    randomSeed: null,
    public_index: null,
    public_index_ongoing_assemblies: null,
    public_index_published_assemblies: null,
    assemblies: {},
    current_container_id: {},
    current_assembly_identifier: null
}

/*
Vuex allows us to define "getters" in the store. You can think of them as computed properties
for stores. Like computed properties, a getter's result is cached based on its dependencies,
and will only re-evaluate when some of its dependencies have changed.
(Hence, getter are run only when Vue-boot or content-change)
*/
const getters = {

    randomLocalStorageSeed: (state) => {
        return (state.randomSeed)
    },

    get_assembly: (state) => (assembly_identifier) => {
        // return state.things.find(thing => thing.identifier === id)
        if (!(assembly_identifier in state.assemblies)) {
            return (null)
        }
        if (!('assembly' in state.assemblies[assembly_identifier])) {
            return (null)
        }
        return (state.assemblies[assembly_identifier].assembly)
    },

    /* Public Index: the publically accessible list of all potential accessible assemblies:
        - assemblies that are currently ongoing (require invitation)
        - assemblies that have been published (accessible by the public)
    */
    get_public_index: (state) => {
        return (state.public_index)
    },

    get_public_index_ongoing_assemblies: (state) => {
        return (state.public_index_ongoing_assemblies)
    },
    
    get_public_index_published_assemblies: (state) => {
        return (state.public_index_published_assemblies)
    },

    get_assembly_containers: (state) => (assembly_identifier) => {
        // return state.things.find(thing => thing.identifier === id)
        console.log(assembly_identifier)
        if (!(assembly_identifier in state.assemblies)) {
            return (null)
        }
        console.assert('containers' in state.assemblies[assembly_identifier])
        console.assert(state.assemblies[assembly_identifier].containers !== null)

        return (state.assemblies[assembly_identifier].containers)
    },

    get_assembly_configuration: (state) => (assembly_identifier) => {
        // return state.things.find(thing => thing.identifier === id)

        // return state.things.find(thing => thing.identifier === id)
        if (!(assembly_identifier in state.assemblies)) {
            return (null)
        }

        if (!('configuration' in state.assemblies[assembly_identifier])) {
            return (null)
        }

        return (state.assemblies[assembly_identifier].configuration)
    },

    get_assembly_progression: (state) => (assembly_identifier) => {
        // return state.things.find(thing => thing.identifier === id)

        // return state.things.find(thing => thing.identifier === id)
        if(!(assembly_identifier in state.assemblies)) {
            return (null)
        }
        if(!('progression' in state.assemblies[assembly_identifier])) {
            return(null)
        }

        return (state.assemblies[assembly_identifier].progression)
    },

    get_assembly_container: (state) => ({assembly_identifier, container_id}) => {
        // return state.things.find(thing => thing.identifier === id)

        // return state.things.find(thing => thing.identifier === id)
        if (!(assembly_identifier in state.assemblies)) {
            return (null)
        }

        if (!('containers' in state.assemblies[assembly_identifier])) {
            return (null)
        }

        const containers = state.assemblies[assembly_identifier].containers
        console.assert(container_id in containers)

        return (containers[container_id])
    },

    get_current_assembly_identifier: (state) => {
        // return state.things.find(thing => thing.identifier === id)
        return (state.current_assembly_identifier)
    },

    get_current_container_id:  (state) => (assembly_identifier) => {
        // return state.things.find(thing => thing.identifier === id)
        if(!(assembly_identifier in state.current_container_id)) {
            return(null)
        }
        return(state.current_container_id[assembly_identifier])
    },

    /* SHORTCUTS */
    // public_index_ongoing_assemblies: {},
    // public_index_published_assemblies: {},
    IsThereAnAssemblyInPublicState: (state) => {
        if (state.public_index_published_assemblies == null) {
            return (null)
        }
        return (state.public_index_published_assemblies.length > 0)
    },

    IsThereAnAssemblyOngoing: (state) => {
        if (state.public_index_ongoing_assemblies == null) {
            return (null)
        }
        return (state.public_index_ongoing_assemblies.length > 0)
    },

    IsThereNothingGoingOn: (state) => {
        if (state.public_index == null) {
            return (null)
        }
        return (state.public_index.length === 0)
    },

    
    IsUserDelegateOfOngoingAssembly: function (state) {

        // data not yet loaded
        if (state.public_index == null) {
            return (null)
        }
 
        // Check if there is at least one ongoing assembly.
        if (state.public_index_ongoing_assemblies.length === 0) {
            return (false)
        }

        // Check permissions:
        let accessible_assemblies = state.public_index.assemblies.filter(x => x.am_is_accessible_by_current_user)
        return (accessible_assemblies.length > 0)
    }
}

const actions = {

    touch_random_seed ({commit}) {
        commit('set_random_seed')
    },
    set_current_container_id({commit}, {assembly, container_id}) {
        commit('set_current_container_id', {assembly, container_id})
    },
    set_current_assembly_identifier({commit}, assembly) {
        commit('set_current_assembly_identifier', assembly)
    },
    add_or_update_assembly({commit}, {assembly, containers, configuration, progression}) {
        commit('add_or_update_assembly', {assembly, containers, configuration, progression})
    },
    add_or_update_public_index({commit}, public_index) {
        commit('add_or_update_public_index', public_index)
    }
}

const mutations = {

    set_random_seed (state) {
        console.log("SET RANDOM SEED IF NOT YET DONE")
        if (!state.randomSeed){
            console.log("setter")
            let randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1
            state.randomSeed = randomSeed
        }
    },

    set_current_assembly_identifier(state, assembly) {

        // keep list of opened contents (if previously available)
        console.log("update current assembly identifier")
        // TODO: Vue.set would make the change reactive!! necessary?
        state.current_assembly_identifier = assembly ? assembly.identifier: null
    },

    set_current_container_id(state, {assembly, container_id}) {
        
        // keep list of opened contents (if previously available)
        console.log("update current  container id for the given assembly")
        
        // preprare folder
        if (!(assembly.identifier in state.current_container_id)) {
            Vue.set(state.current_container_id, assembly.identifier, null)
        }
        // Vue.set  makes the change reactive!!
        Vue.set(state.current_container_id, assembly.identifier, container_id)
    },

    add_or_update_assembly(state, {assembly, containers, configuration, progression}) {

        // keep list of opened contents (if previously available)
        console.log("update assembly containers")

        // preprare folder
        if (!(assembly.identifier in state.assemblies)) {
            Vue.set(state.assemblies, assembly.identifier, {containers : null, assembly: null, configuration: null, progression: null})
        }
        console.log("...containers....")
        console.log(containers)

        // Vue.set  makes the change reactive!!
        Vue.set(state.assemblies[assembly.identifier], 'assembly', assembly)
        console.log("assemblies have been updated..")

        Vue.set(state.assemblies[assembly.identifier], 'containers', containers)
        console.log("containers have been updated..")

        // convert to named array (names == ids)
        Vue.set(state.assemblies[assembly.identifier], 'configuration', configuration)
        console.log("assemblies configuration have been updated too..")

        // convert to named array (names == ids)
        Vue.set(state.assemblies[assembly.identifier], 'progression', progression)
        console.log("assemblies progression have been updated too..")
    },

    add_or_update_public_index (state, public_index) {

        // Vue.set  makes the change reactive!!
        Vue.set(state, 'public_index', public_index.public_index)
        console.log('public_index of assemblies has been updated.')
        console.log(public_index)
        const publicAssemblies = public_index.public_index.assemblies.filter(x => x.is_public)
        const ongoingAssemblies = public_index.public_index.assemblies.filter(x => x.is_active)

        Vue.set(state, 'public_index_published_assemblies', publicAssemblies)
        Vue.set(state, 'public_index_ongoing_assemblies', ongoingAssemblies)
    }
}

export const assemblystore = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}