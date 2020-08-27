/**
 * Provides methods for oAuth2-related XHR calls.
 */

import ApiService from '../../utils/xhr'
import popupLibrary from './popup'

interface oAuthServiceInstance {
  redirectToProvider: (provider: string, randomState: string) => void,
  authorizeByAuthenticationCode: (provider: string, authorizationCode: string) => Promise<unknown>,
  tokenRegistration: (provider: string, accessToken: string) => Promise<string>,
  tokenRefresh: (provider: string, refreshToken: string) => Promise<unknown>,
  tokenRevoke: (provider: string, refreshToken: string) => Promise<boolean>,
  tokenDecode: (jwt: string) => unknown
}

const oAuthService: oAuthServiceInstance = {
  /**
   * Redirect to oauth provider' authorization routine..
   * @param provider's name
   * redirects to authorize page...
   */

  redirectToProvider: (provider: string, randomState: string): void => {

    // TODO: retrieve settings by providername
    console.assert(provider)
    let configuration = process.env['VUE_APP_OAUTH_PROFILES'][provider]
    const clientId = configuration['VUE_APP_OAUTH_CLIENT_ID']
    const baseUrl = configuration['VUE_APP_OAUTH_BASE_URL']
    console.assert(clientId)
    console.assert(baseUrl)
    // http://localhost:8000/o/authorize/?client_id=3wtT6b469YwVKPSfenC3M6KNSw2WL70sCNEWAAWq&response_type=code&state=random_state_string
    const url = baseUrl + '/o/authorize/?client_id=' + clientId + '&response_type=code&state=' + randomState
    console.assert(clientId)
    console.assert(baseUrl)
    if(clientId && baseUrl){
      // window.open(url)
      popupLibrary.openpopup(url)
      // window.location.href = url
    }
  },


  /**
   * Authorize at oAuth Server (DemokratieFabrik/fabrikAuth)
   * @param provider
   * @param authorizationCode
   * @returns {Promise<void>}
   */
  authorizeByAuthenticationCode: async (provider: string, authorizationCode: string): Promise<unknown> => {
    console.assert(authorizationCode)
    // console.log("START authorize method")

    // TODO: load vars conditional on provider...
    let configuration = process.env['VUE_APP_OAUTH_PROFILES'][provider]
    const clientId = configuration['VUE_APP_OAUTH_CLIENT_ID']
    const baseUrl = configuration['VUE_APP_OAUTH_BASE_URL']
    console.assert(clientId)
    console.assert(baseUrl)
    const redirectUri = `${process.env.VUE_APP_DOMAIN}${process.env.VUE_APP_OAUTH_LOCAL_REDIRECTION_URI}`
    const url: string = baseUrl + '/o/token/'
    console.assert(clientId)
    console.assert(baseUrl)
    console.assert(redirectUri)
    
    interface dataInterface {
      'grant_type': string,
      code: string,
      'client_id': string,
      'redirect_uri': string
    }
    const data: dataInterface = {
      grant_type: 'authorization_code',
      code: authorizationCode,
      client_id: clientId,
      redirect_uri: redirectUri
    }
    const formData = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
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
  tokenRegistration: async (provider: string, accessToken: string): Promise<string> => {
    // console.log("api registration")
    console.assert(provider)
    console.assert(accessToken)
    console.assert(accessToken['access_token'])

    let expiration: string | undefined = null
    if ('exp' in accessToken) {
      expiration = accessToken['exp']
    } else if ('expiration' in accessToken) {
      expiration = accessToken['expiration']
    }

    interface dataInterface {
      'access_token': string,
      provider: string,
      expiration: string
    }
    const data: dataInterface = {
      access_token: accessToken['access_token'],
      provider: provider,
      expiration: expiration
    }

    const api_base_url: string = process.env.VUE_APP_APISERVER_URL
    const url: string = api_base_url + '/oauth'
    const formData: unknown = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
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
  tokenRefresh: async (provider, refreshToken): Promise<unknown> => {
    console.assert(refreshToken)
    console.assert(provider)
    // console.log("START refresh token")

    // TODO: load vars conditional on provider...
    let configuration = process.env['VUE_APP_OAUTH_PROFILES'][provider]
    const clientId = configuration['VUE_APP_OAUTH_CLIENT_ID']
    const baseUrl = configuration['VUE_APP_OAUTH_BASE_URL']
    console.assert(clientId)
    console.assert(baseUrl)

    let url: string = baseUrl + '/o/token/'

    interface dataInterface {
      'grant_type': string,
      'refresh_token': string,
      'client_id': string
    }
    const data: dataInterface = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId
    }
    const formData = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
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
  tokenRevoke: async (provider: string, refreshToken: string): Promise<unknown> => {
    // console.log("start revoke call")
    console.assert(provider)
    console.assert(refreshToken)

    // TODO: load vars conditional on provider...
    let configuration = process.env['VUE_APP_OAUTH_PROFILES'][provider]
    const clientId = configuration['VUE_APP_OAUTH_CLIENT_ID']
    const baseUrl = configuration['VUE_APP_OAUTH_BASE_URL']
    console.assert(clientId)
    console.assert(baseUrl)
    let url = baseUrl + '/o/revoke_token/'

    interface dataInterface {
      token: string,
      'token_type_hint': string,
      'client_id': string
    }

    const data:dataInterface = {
      token: refreshToken,
      client_id: clientId,
      token_type_hint: 'refresh_token'
    }
    const formData = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
    const requestData = {
      method: 'POST',
      url: url,
      data: formData
    };

    const response = await ApiService.customRequest(requestData, { ReloginOnStatus403: false, WithoutAuthHeader: true })
    // console.log("REVOKE Successful? " + (response.status==200))
    return (response.status == 200)
  },

  tokenDecode: (jwt: string): unknown => {
    const token = {};
    // token.header = JSON.parse(window.atob(t.split('.')[0]));
    token.payload = JSON.parse(window.atob(jwt.split('.')[1]));

    return (token.payload)
  }
}

export { oAuthService }