/**
 * Provides methods for oAuth2-related XHR calls.
 */

import ApiService from '../xhr'
import popupLibrary from './lib/popup'
import Configuration from 'src/utils/configuration'

// interface oAuthServiceInstance {
//   redirectToProvider: (provider, randomState) => void,
//   authorizeByAuthenticationCode: (provider, authorizationCode) => Promise<unknown>,
//   tokenRegistration: (provider, accessToken) => Promise<string>,
//   tokenRefresh: (provider, refreshToken) => Promise<unknown>,
//   tokenRevoke: (provider, refreshToken) => Promise<boolean>,
//   tokenDecode: (jwt) => unknown
// }

const oAuthService = {
  /**
   * Redirect to oauth provider' authorization routine..
   * @param provider's name
   * redirects to authorize page...
   */

  redirectToProvider (provider, randomState) {

    // Provider funcitonality is not implemented yet. 
    console.assert(provider)
    
    var clientId = Configuration.value('ENV_OAUTH_CLIENT_ID')
    var baseUrl = Configuration.value('ENV_OAUTH_BASE_URL')
    console.assert(clientId)
    console.assert(baseUrl)
    // http://localhost:8000/o/authorize/?client_id=3wtT6b469YwVKPSfenC3M6KNSw2WL70sCNEWAAWq&response_type=code&state=random_state_string
    const url = `${baseUrl}/o/authorize/?client_id=${clientId}&response_type=code&state=${randomState}`
    console.assert(clientId)
    console.assert(baseUrl)
    if(clientId && baseUrl) {
      // window.open(url)
      popupLibrary.openpopup(url)
      // window.location.href = url
    }
  },


  /**
   * Authorize at oAuth Server (demokratiefabrik/fabrikAuth)
   * @param provider
   * @param authorizationCode
   * @returns {Promise<void>}
   */
  async authorizeByAuthenticationCode (provider, authorizationCode) {
    console.assert(authorizationCode)
    // console.log("START authorize method")

    // TODO: load vars conditional on provider...
    var clientId = Configuration.value('ENV_OAUTH_CLIENT_ID')
    var baseUrl = Configuration.value('ENV_OAUTH_BASE_URL')
    var app_domain = Configuration.value('ENV_DOMAIN')
    var oauthUrl = Configuration.value('ENV_OAUTH_LOCAL_REDIRECTION_URI')
    console.assert(clientId)
    console.assert(baseUrl)
    const redirectUri = `${app_domain}${oauthUrl}`
    const url = baseUrl + '/o/token/'
    console.assert(clientId)
    console.assert(baseUrl)
    console.assert(redirectUri)

    const data = {
      grant_type: 'authorization_code',
      code: authorizationCode,
      client_id: clientId,
      redirect_uri: redirectUri
    }
    const formData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    const requestData = {
      method: 'POST',
      url: url,
      data: formData
    }

    let response = await ApiService.customRequest(requestData, { ReloginOnStatus403: false })
    return (response.data)
  },

  /**
   * Registration at resource server (fabrikApi)
   * Convert access token to JWT:
   * It returns a JWT token. (access token becomes obsolete)
   * @param provider
   * @param accessToken
   * @returns {Promise<void>}
   */
  async tokenRegistration (provider, accessToken) {
    // console.log("api registration")
    console.assert(provider)
    console.assert(accessToken)
    console.assert(accessToken['access_token'])

    let expiration = null
    if ('exp' in accessToken) {
      expiration = accessToken['exp']
    } else if ('expiration' in accessToken) {
      expiration = accessToken['expiration']
    }

    const data = {
      access_token: accessToken['access_token'],
      provider: provider,
      expiration: expiration
    }

    const api_base_url = Configuration.value('ENV_APISERVER_URL')
    const url = api_base_url + '/oauth'
    const formData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    const requestData = {
      method: 'POST',
      url: url,
      data: formData
    }
    const response = await ApiService.customRequest(requestData, { ReloginOnStatus403: false })
    console.assert(response.data)
    console.assert("jwt" in response.data)
    console.assert(response.data['jwt'])
    // console.log("finished api registration..")
    return (response.data['jwt'])
  },


  /**
   * Refresh token routine:
   * try to re-issue an access_token by refresh token.
   * return True, if new accessToken is retrieved.
   * return False, if refresh token is invalid. => 400 Status code
   * @param provider
   * @param refreshToken
   * @returns {Promise<void>: accessToken}
   */
  async tokenRefresh (provider, refreshToken) {
    console.assert(refreshToken)
    console.assert(provider)
    // console.log("START refresh token")

    // TODO: load vars conditional on provider...
    const clientId = Configuration.value('ENV_OAUTH_CLIENT_ID')
    const baseUrl = Configuration.value('ENV_OAUTH_BASE_URL')
    console.assert(clientId)
    console.assert(baseUrl)

    let url = baseUrl + '/o/token/'

    // interface dataInterface {
    //   'grant_type',
    //   'refresh_token',
    //   'client_id'
    // }
    const data = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId
    }
    const formData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    const requestData = {
      method: 'POST',
      url: url,
      data: formData,
      WithoutAuthHeader: true,
      Allow400Status: true
    }
    const response = await ApiService.customRequest(requestData)
    if (response.status == 200) {
      return (response.data)
    } else {
      return (null)
    }
  },

  /**
   * Revoke: disable refresh token...(i.e. logout action)
   * @param provider
   * @param refreshToken
   * @returns {Promise<void>: accessToken}
   */
  async tokenRevoke (provider, refreshToken) {
    // console.log("start revoke call")
    console.assert(provider)
    console.assert(refreshToken)

    // TODO: load vars conditional on provider...
    const clientId = Configuration.value('ENV_OAUTH_CLIENT_ID')
    const baseUrl = Configuration.value('ENV_OAUTH_BASE_URL')
    console.assert(clientId)
    console.assert(baseUrl)
    let url = baseUrl + '/o/revoke_token/'

    const data = {
      token: refreshToken,
      client_id: clientId,
      token_type_hint: 'refresh_token'
    }
    const formData = Object.keys(data).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`).join('&');
    const requestData = {
      method: 'POST',
      url: url,
      data: formData
    };

    const response = await ApiService.customRequest(requestData, { ReloginOnStatus403: false, WithoutAuthHeader: true })
    // console.log("REVOKE Successful? " + (response.status==200))
    return (response.status == 200)
  },

  tokenDecode(jwt)  {
    const token = {};
    token.payload = JSON.parse(window.atob(jwt.split('.')[1]));
    return (token.payload)
  }
}

export { oAuthService }