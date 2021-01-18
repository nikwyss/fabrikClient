/**
 * https://stackoverflow.com/questions/49639605/how-to-separate-axios-requests-from-a-vuex-store
 * Do not catch errors in here...
 */

import ApiService from 'src/utils/xhr'
import Vue from 'vue'

export default {
  
  // oAuth Server
  // *********************************
  /**
   * Get or Update Userprofile data..
   */
  async authProfile(profile) {

    // Renew token (if required)
    await Vue.prototype.oauth.refresh_token_if_required()

    /* Update Auth Profile => Emailadress/ Username etc... */
    profile.client_id = process.env.ENV_OAUTH_CLIENT_ID
    let url = `${process.env.ENV_OAUTH_BASE_URL}/accounts/emailupdate`
    const data = {
      method: 'post',
      url: url,
      data: profile,
      headers: {
        'content-type': 'application/json'
      }
    }
    return (ApiService.customRequest(data))
  },

  // API
  // ******************************
  async monitorActivities({event, data}) {

    // Renew token (if required)
    await Vue.prototype.oauth.refresh_token_if_required()

    /* Notify Resource Server about certain user activities in the client app. */
    let url = `${process.env.ENV_APISERVER_URL}/monitor/${event}`
    console.log('monitor activies in API')
    return await ApiService.post(url, {content: data})
  },

  async retrievePublicIndex() {

    // Renew token (if required)
    await Vue.prototype.oauth.refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assemblies`
    return await ApiService.get(url)
  },

  async retrieveAssembly(assemblyIdentifier) {

    // Renew token (if required)
    await Vue.prototype.oauth.refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}`
    return await ApiService.get(url)
  },

  async retrieveContenttree(assemblyIdentifier, contenttreeID) {

    // Renew token (if required)
    await Vue.prototype.oauth.refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/contenttree`
    return await ApiService.get(url)
  }
}
