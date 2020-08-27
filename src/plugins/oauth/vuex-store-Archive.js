// /* Stores assembly in the vuex store: it is easy likely that the assembly object is required on many pages._200
//  * TODO: ALternative: create a runtime variable...
// */

// var state = {
//     authenticated: false
// }

// const getters = {
//     is_authenticated: (state) => (assembly_identifier) => {
//         // return state.things.find(thing => thing.identifier === id)
//         if(!(assembly_identifier in state.assemblies)){
//             return(null)
//         }
//         return(state.assemblies[assembly_identifier])
//     }
// }

// const actions = {
    
//     add_or_update_assembly({commit}, assembly) {
//         commit('add_or_update_assembly', assembly);
//     }
// }

// const mutations = {

//     add_or_update_assembly(state, assembly) {
        
//         // keep list of opened contents (if previously available)
//         console.log("update assembly")
//         // THIS makes the change reactive!!
//         window.Vue.set(state.assemblies, assembly.identifier, assembly)
//     },

//     // saveContainerToCacheMixin(data){
//     //     // if a new container is created for this assembly. then 
//     //     // update the local container data.
//     //     console.log(data)
//     //     if("container_meta" in data){
//     //         if (data.container_meta.order_position){
//     //             if(data.container_meta.order_position <= this.assembly.containers.length){
//     //                 this.assembly.containers.splice(2, 0, "Lene");
//     //             }
//     //         }else{
//     //             this.assembly.containers.push(data.container_meta)
//     //         }
//     //     }else{
//     //         this.assembly.containers.push(data.container_meta)
//     //     }
//     //     this.saveContainerToCache(data)
//     // },
// }

// export const assemblystore = {
//     namespaced: true,
//     state,
//     getters,
//     actions,
//     mutations
// }