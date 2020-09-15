// api.js
// https://stackoverflow.com/questions/49639605/how-to-separate-axios-requests-from-a-vuex-store
import ApiService from "src/utils/xhr"
import Configuration from 'src/utils/configuration'


export default {

  async monitorActivities({event, data}) {
    /* Notify Resource Server about certain user activities in the client app. */
    let url = `${Configuration.value('ENV_APISERVER_URL')}/monitor/${event}`
    return ApiService.post(url, {content: data})
      .catch(e => {
        // catch errors here if you want
        console.log(e);
    })
  },

  async retrievePublicIndex() {
    let url = `${Configuration.value('ENV_APISERVER_URL')}/assemblies`
    return ApiService.get(url)
    .catch(e => {
      // catch errors here if you want
      console.log(e);
      })
  }
}
