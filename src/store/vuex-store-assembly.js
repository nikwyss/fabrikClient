/* Stores assembly in the vuex store: it is easy likely that the assembly object is required on many pages._200
 * TODO: ALternative: create a runtime variable...
*/
import Vue from 'vue'
import { store } from 'quasar/wrappers'

var state = {
    randomSeed: null,
    publicIndex: null,
    publicIndex_ongoing_assemblies: null,
    publicIndex_published_assemblies: null,
    assemblies: {},
    current_containerID: {},
    current_assemblyIdentifier: null
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

    get_assembly: (state) => (assemblyIdentifier) => {
        // return state.things.find(thing => thing.identifier === id)
        if (!(assemblyIdentifier in state.assemblies)) {
            return (null)
        }
        if (!('assembly' in state.assemblies[assemblyIdentifier])) {
            return (null)
        }
        return (state.assemblies[assemblyIdentifier].assembly)
    },

    /* Public Index: the publically accessible list of all potential accessible assemblies:
        - assemblies that are currently ongoing (require invitation)
        - assemblies that have been published (accessible by the public)
    */
    get_publicIndex: (state) => {
        return (state.publicIndex)
    },

    get_publicIndex_ongoing_assemblies: (state) => {
        return (state.publicIndex_ongoing_assemblies)
    },
    
    get_publicIndex_published_assemblies: (state) => {
        return (state.publicIndex_published_assemblies)
    },

    get_assembly_containers: (state) => (assemblyIdentifier) => {
        // return state.things.find(thing => thing.identifier === id)
        console.log(assemblyIdentifier)
        if (!(assemblyIdentifier in state.assemblies)) {
            return (null)
        }
        console.assert('containers' in state.assemblies[assemblyIdentifier])
        console.assert(state.assemblies[assemblyIdentifier].containers !== null)

        return (state.assemblies[assemblyIdentifier].containers)
    },

    get_assembly_configuration: (state) => (assemblyIdentifier) => {
        // return state.things.find(thing => thing.identifier === id)

        // return state.things.find(thing => thing.identifier === id)
        if (!(assemblyIdentifier in state.assemblies)) {
            return (null)
        }

        if (!('configuration' in state.assemblies[assemblyIdentifier])) {
            return (null)
        }

        return (state.assemblies[assemblyIdentifier].configuration)
    },

    get_assembly_progression: (state) => (assemblyIdentifier) => {
        // return state.things.find(thing => thing.identifier === id)

        // return state.things.find(thing => thing.identifier === id)
        if(!(assemblyIdentifier in state.assemblies)) {
            return (null)
        }
        if(!('progression' in state.assemblies[assemblyIdentifier])) {
            return(null)
        }

        return (state.assemblies[assemblyIdentifier].progression)
    },

    get_assembly_container: (state) => ({assemblyIdentifier, containerID}) => {
        // return state.things.find(thing => thing.identifier === id)

        // return state.things.find(thing => thing.identifier === id)
        if (!(assemblyIdentifier in state.assemblies)) {
            return (null)
        }

        if (!('containers' in state.assemblies[assemblyIdentifier])) {
            return (null)
        }

        const containers = state.assemblies[assemblyIdentifier].containers
        console.assert(containerID in containers)
        
        return (containers[containerID])
    },

    get_current_assemblyIdentifier: (state) => {
        // return state.things.find(thing => thing.identifier === id)
        return (state.current_assemblyIdentifier)
    },

    get_current_containerID:  (state) => (assemblyIdentifier) => {
        // return state.things.find(thing => thing.identifier === id)
        if(!(assemblyIdentifier in state.current_containerID)) {
            return(null)
        }
        return(state.current_containerID[assemblyIdentifier])
    },

    /* SHORTCUTS */
    // publicIndex_ongoing_assemblies: {},
    // publicIndex_published_assemblies: {},
    IsThereAnAssemblyInPublicState: (state) => {
        if (state.publicIndex_published_assemblies == null) {
            return (null)
        }
        return (state.publicIndex_published_assemblies.length > 0)
    },

    IsThereAnAssemblyOngoing: (state) => {
        if (state.publicIndex_ongoing_assemblies == null) {
            return (null)
        }
        return (state.publicIndex_ongoing_assemblies.length > 0)
    },

    IsThereNothingGoingOn: (state) => {
        if (state.publicIndex == null) {
            return (null)
        }
        return (state.publicIndex.length === 0)
    },

    
    IsUserDelegateOfOngoingAssembly: function (state) {

        // data not yet loaded
        if (state.publicIndex == null) {
            return (null)
        }
        // Check if there is at least one ongoing assembly.
        if (state.publicIndex_ongoing_assemblies.length === 0) {
            return (false)
        }

        // Check permissions:
        let accessibleAssemblies = state.publicIndex_ongoing_assemblies.filter(x => x.am_is_accessible_by_current_user)
        return (accessibleAssemblies.length > 0)
    }
}

const actions = {

    touchRandomSeed ({commit}) {
        commit('set_random_seed')
    },
    set_current_containerID({commit}, {assembly, containerID}) {
        commit('set_current_containerID', {assembly, containerID})
    },
    set_current_assemblyIdentifier({commit}, assembly) {
        commit('set_current_assemblyIdentifier', assembly)
    },
    add_or_update_assembly({commit}, {assembly, containers, configuration, progression}) {
        commit('add_or_update_assembly', {assembly, containers, configuration, progression})
    },
    add_or_update_publicIndex({commit}, publicIndex) {
        commit('add_or_update_publicIndex', publicIndex)
    }
}

const mutations = {

    set_random_seed (state) {
        console.log("SET RANDOM SEED IF NOT YET DONE")
        if (!state.randomSeed) {
            console.log("setter")
            let randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1
            state.randomSeed = randomSeed
        }
    },

    set_current_assemblyIdentifier(state, assembly) {

        // keep list of opened contents (if previously available)
        console.log("update current assembly identifier")
        // TODO: Vue.set would make the change reactive!! necessary?
        state.current_assemblyIdentifier = assembly ? assembly.identifier: null
    },

    set_current_containerID(state, {assembly, containerID}) {
        
        // keep list of opened contents (if previously available)
        console.log("update current  container id for the given assembly")
        
        // preprare folder
        if (!(assembly.identifier in state.current_containerID)) {
            Vue.set(state.current_containerID, assembly.identifier, null)
        }
        // Vue.set  makes the change reactive!!
        Vue.set(state.current_containerID, assembly.identifier, containerID)
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

    add_or_update_publicIndex (state, publicIndex) {

        // Vue.set  makes the change reactive!!
        Vue.set(state, 'publicIndex', publicIndex.publicIndex)
        console.log('publicIndex of assemblies has been updated.')
        console.log(publicIndex)
        const publicAssemblies = publicIndex.publicIndex.assemblies.filter(x => x.is_public)
        const ongoingAssemblies = publicIndex.publicIndex.assemblies.filter(x => x.is_active)

        Vue.set(state, 'publicIndex_published_assemblies', publicAssemblies)
        Vue.set(state, 'publicIndex_ongoing_assemblies', ongoingAssemblies)
    }
}

export const assemblystore = {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}