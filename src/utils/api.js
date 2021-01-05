// api.js
// https://stackoverflow.com/questions/49639605/how-to-separate-axios-requests-from-a-vuex-store
// Do not catch errors in here...

import ApiService from "src/utils/xhr"
import Configuration from 'src/utils/configuration'


export default {

  async monitorActivities({event, data}) {
    /* Notify Resource Server about certain user activities in the client app. */
    let url = `${Configuration.value('ENV_APISERVER_URL')}/monitor/${event}`
    console.log("monitor activies in API")
    return await ApiService.post(url, {content: data})
  },

  async retrievePublicIndex() {
    let url = `${Configuration.value('ENV_APISERVER_URL')}/assemblies`
    return await ApiService.get(url)
  },

  async retrieveAssembly(assemblyIdentifier) {
    let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${assemblyIdentifier}`
    return await ApiService.get(url)
  },

  async retrieveContenttree(assemblyIdentifier, contenttreeID) {
    let url = `${Configuration.value('ENV_APISERVER_URL')}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/contenttree`
    return await ApiService.get(url)
  }
}
