/**
 * https://stackoverflow.com/questions/49639605/how-to-separate-axios-requests-from-a-vuex-store
 * Do not catch errors in here...
 */

import ApiService from 'src/utils/xhr'
import Vue from 'vue'
import { date } from 'quasar'

export default {

  /* checks if the date transmitted is still a valid cache date. */
  expiredCacheDate(timeDownloaded) {
    if (!timeDownloaded) { return (false) }
    timeDownloaded = new Date(timeDownloaded)
    const expiringDate = date.addToDate(timeDownloaded, { minutes: parseInt(process.env.ENV_APISERVER_CACHE_EXPIRATION_MINUTES) })
    // console.log(expiringDate)
    return (new Date(Date.now()) > expiringDate)
  },


  // oAuth Server
  // *********************************
  /**
   * Get or Update Userprofile data..
   */
  async authProfile(profile) {

    // Renew token (if required)
    // await Vue.prototype.oauth.refresh_token_if_required()

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
  /**
   * Get or Public-Profile Data.. (API)
   */
  async publicProfile() {

    // Renew token (if required)
    // refresh_token method is done earlier, while launching app.
    // // await Vue.prototype.oauth.refresh_token_if_required()

    /* Notify Resource Server about certain user activities in the client app. */
    let url = `${process.env.ENV_APISERVER_URL}/profile`
    console.log('get public profile (API-Server)')
    return await ApiService.get(url)
  },

  async monitorActivities(buffer) {

    // Renew token (if required)
    // await Vue.prototype.oauth.refresh_token_if_required()
    console.log("/api")
    /* Notify Resource Server about certain user activities in the client app. */
    let url = `${process.env.ENV_APISERVER_URL}/monitor`
    console.log('monitor activies in API')
    const response = await ApiService.put(url, { buffer })
    return response.data

  },

  async retrievePublicIndex() {

    // Renew token (if required)
    // await Vue.prototype.oauth.refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assemblies`
    return await ApiService.get(url)
  },

  async retrieveAssembly(assemblyIdentifier) {

    // Renew token (if required)
    // await Vue.prototype.oauth.refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}`
    return await ApiService.get(url)
  },

  async retrieveContenttree(assemblyIdentifier, contenttreeID) {

    // Renew token (if required)
    // await Vue.prototype.oauth.refresh_token_if_required()

    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}/contenttree`
    return await ApiService.get(url)
  },

  async setContentRating(assemblyIdentifier, contentID, rating) {


    // compose url
    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/content/${contentID}/rating/${rating}`;
    // Renew token (if required)
    // console.log(url)
    // await Vue.prototype.oauth.refresh_token_if_required()
    console.log(url)
    const result = await ApiService.put(url)
    if (!result.data.OK) {
      throw ("Rating could not be saved");
    }

    return (result)
  },

  async saveContent(assemblyIdentifier, contenttreeID, data) {

    // compose url
    let url = `${process.env.ENV_APISERVER_URL}/assembly/${assemblyIdentifier}/contenttree/${contenttreeID}`
    if (data.id) {
      // this is an update
      url += `/content/${data.id}`
    } else {
      url += "/addcontent/";
    }

    // Renew token (if required)
    // await Vue.prototype.oauth.refresh_token_if_required()
    return await ApiService.put(url, { content: data })
  }
}
