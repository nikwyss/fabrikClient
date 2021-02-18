import Vue from "vue";

export const runtimeStore = Vue.observable({
  stageID: null,
  assemblyIdentifier: null,
  appExitState: false
})

export const runtimeMutations = {
  exitApp() {
    runtimeStore.appExitState = true
  },
  setStageID(stageID) {
    runtimeStore.stageID = parseInt(stageID)
  },
  // setStageNr(stageID) {
  //   runtimeStore.stageID = parseInt(stageID)
  // },
  setAssemblyIdentifier(assemblyIdentifier) {
    runtimeStore.assemblyIdentifier = assemblyIdentifier
  }
}