import Vue from "vue";

export const runtimeStore = Vue.observable({
  stageID: null,
  assemblyIdentifier: null
})

export const runtimeMutations = {
  setStageID(stageID) {
    runtimeStore.stageID = parseInt(stageID);
  },
  setAssemblyIdentifier(assemblyIdentifier) {
    runtimeStore.assemblyIdentifier = assemblyIdentifier;
  }
}