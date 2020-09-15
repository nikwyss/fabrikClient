/**
 * https://medium.com/locale-ai/architecting-http-clients-in-vue-js-applications-for-efficient-network-communication-991cf1df1cb2
 * 
 * Provides methods for XHR-calls using Axios.
 */
import axios from 'axios'
import Configuration from 'src/utils/configuration'

/* 
One more thing to keep in mind, Axios by default has the timeout set to 0, which means no timeout. But in most cases, we need to set request timeouts in our application along with a retry period. We will discuss how to retry a failed request in the below sections but you can change the default timeout of our httpClient while creating it.
TODO: set timeout above 0 for axios!!!!!!!
const httpClient = axios.create({
    baseUrl: process.env.VUE_APP_BASE_URL,
    timeout: 1000, // indicates, 1000ms ie. 1 second
    headers: {
        "Content-Type": "application/json",
    }
});


*/
const HTTP_HEADER = 'Authorization'
const RequestOrigin = 'ApiService'


const ReloginOnStatus403 = (config = {}) => {
  return Object.prototype.hasOwnProperty.call(config, "ReloginOnStatus403") && !config.ReloginOnStatus403 ?
    false : true
}
const Allow400Status = (config = {}) => {
  return Object.prototype.hasOwnProperty.call(config, "Allow400Status") && config.Allow400Status ?
    true : false
}
const WithoutAuthHeader = (config = {}) => {
  return Object.prototype.hasOwnProperty.call(config, "WithoutAuthHeader") && config.WithoutAuthHeader ?
    true : false
}

const ApiService = {

  init () {
    const baseURL = `${Configuration.value('ENV_APISERVER_URL')}`;
    axios.defaults.timeout = 2000
    axios.defaults.baseURL = baseURL}
  ,

  /**
   * Sets the transmitted JWT token as current default authentication header
   */
  setHeader(token) {

    console.log("Set XHR Request header")
    if (typeof (token) !== 'string' && token !== null) {
      return (null)
    }

    // console.error(typeof (token))
    if (token) {
      axios.defaults.headers.common[HTTP_HEADER] = "JWT " + token
    } else {
      delete axios.defaults.headers.common[HTTP_HEADER]
    }
  },

  /**
   * Removes the JWT token as default authentication header
   */
  removeHeader() {
    axios.defaults.headers.common = {}
    // console.log("Remove axios header")
  },

  /**
   * Returns currently set default authentication header (without prefix)
   */
  getHeader () {
    // Not sure if this is still needed. (saved in cookie)
    if (HTTP_HEADER in axios.defaults.headers.common) {
      let header = axios.defaults.headers.common[HTTP_HEADER]
      if (header) {
        // console.log(header)
        let parts = header.split(' ');
        return (parts[1]);
      }
    }
    return (null)
  },

  is_api_service_used_as_axios_wrapper: function (resource) {
    if (!('origin' in resource) || (resource['origin'] != RequestOrigin)) {
      console.assert('ERROR: Please use ApiService as Axios Wrapper...')
    }
  },

  async get(resource) {
    // return await axios.get(resource, {'origin': RequestOrigin})
    let data = {
      method: 'GET',
      url: resource,
    }
    let response = await this.customRequest(data)
    return (response)
  },

  async post(resource, data) {
    let fulldata = {
      method: 'POST',
      url: resource,
      data: data
    }

    return (await this.customRequest(fulldata))
  },

  async put(resource, data) {
    let fulldata = {
      method: 'PUT',
      url: resource,
      data: data
    }

    return (await this.customRequest(fulldata))
  },

  async delete(resource, data) {
    let fulldata = {
      method: 'DELETE',
      url: resource,
      data: data
    }

    return (await this.customRequest(fulldata))
  },

  /**
   * Perform a custom Axios request.
   **/
  async customRequest(data) {
    console.log("launch XHR custom request")

    // Assert that header is set, when somebody is authenticated.
    var temp_oauth_jwt = null

    data['origin'] = RequestOrigin

    if (WithoutAuthHeader(data)) {
      // cache the current header and remove it
      console.log("remove XHR header")
      temp_oauth_jwt = this.getHeader()
      this.removeHeader()
    }

    var response = null
    response = await axios(data)
    // TODO: do we have to catch the unknown exception?
    // this.$http.get("https://recetapp-b43f2.firebaseio.com/posts.json")
    // .then(response => { console.log(response.data); })
    // .catch(e => { console.log(e); })
    
    // Note: 403 error handling takes place within the interceptor
    // TODO: is this correct? add 403 condition in the night.
    if (response.status == 403){
      if (ReloginOnStatus403(data)) {
        console.log("PERMISSION ERROR: Try again")
        if (response.retry && response.retoken) {
          // Re-issue tokens (in ApiService)
          console.log("refresh token status set")
          await response.retoken()
          // Re-axios (same as before...)
          response = await axios(data)

          console.log("second try")
          console.log(response)
        }
      }
    }

    if (temp_oauth_jwt && WithoutAuthHeader(data)) {
      // re-set the header
      this.setHeader(temp_oauth_jwt)
    }

    return (response)
  },



  /**
   * Refresh Token: if Api request returns 401
   * This is done by axios intercept method, which everytime checks response.status of each API call.
   */
  mountAxiosInterceptor(onRejected) {
    // if (!onFullfilled) {
    // let onFullfilled = function(response) {
    //   return (response);
    // }

    let onFullfilled = (response) => {
      return response;
    }
    // }
    // this._401interceptor = 
    axios.interceptors.response.use(
      onFullfilled,
      error => onRejected(error)
    )
  }
}

// ApiService.create()
// defaults.timeout = 5000;

export { ApiService, ReloginOnStatus403, WithoutAuthHeader, Allow400Status };
export default ApiService