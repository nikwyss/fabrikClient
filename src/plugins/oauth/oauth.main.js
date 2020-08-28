/* eslint-disable */
import { oAuthService } from './oauth.api';
import { ApiService } from '../../utils/xhr'
import {get_cookie_value, set_cookie_value} from '../../utils/cookie.service'

// DEFINE SESSION Object
class oauthSession {

    // username
    static username = null

    // sub (subject id)
    static sub = null
    static protected_url = null

    // JWT Token
    static  _jwt = null;
        
    static get jwt() {
      if (this. _jwt === null) {
        this. _jwt = get_cookie_value('oauth _jwt')
      }
      return (this. _jwt)
    }
  
    set jwt (value) {
      console.log("update jwt cookie" + value)

      // TODO: not sure, whether jwt should be saved in cookies or only in runtime variable.
      set_cookie_value('oauth _jwt', value)
  
      // Add authorization prefix for all following xhr requests.
      // header for axios requests
      ApiService.setHeader(value)
      
      // TODO: both of the following two assignments are needed, although should be same referred variable, right? 
      // It seems to be a bug in the vue mixin functionality? (don t get this)
      // this.jwt_runtime = oauth _jwt
      // this.$root.jwt_runtime = oauth _jwt
  
      this. _jwt = value
    }

    // Refresh Token
    get refresh_token () {
      console.log("oauth_refresh_token token")
      let response = get_cookie_value ('oauth_refresh_token')
      return (response)
    }


    set refresh_token (value) {
      // TODO: Set cookie with refresh token: shall be valid for a long time (x-Days) 
      const durable = true;
      set_cookie_value ('oauth_refresh_token', value, durable)
    }

    // Provider
    get provider() {
      return (get_cookie_value('oauth_provider'))
    }
    set provider(value) {
      if (!value) { value = '' }
      const durable = true;
      set_cookie_value('oauth_provider', value, durable)
    }
  
    // Random State
    get random_state() {
      return (get_cookie_value('oauth_random_state'))
    }
    set random_state(value) {
      if (!value) { value = '' }
      set_cookie_value('oauth_random_state', value)
    }
  
    // is the user authenticated?
    authenticated() {
      return (!!(this.jwt) && (this.jwt.length > 0))
    }
  
    // is currently an authentication process goiing on?
    ongoing() {
      return (!!(this.random_state) && (this.random_state.length>0))
    }
   
    /**
     * Load refresh token and JWT etc  from cookie...
     * Check expiration date of JWT
     * If JWT is missing or expired => call refresh token
     * @returns {Promise<boolean>}
     */
    async initialize(VueRoot) {
  
      // force to reread jwt token from cookie.
      this. _jwt = null
      
      // dont touch an ongoing authentication
      if (this.ongoing()) {
        console.log("ongoing authentication..")
        return (true)
      }
  
      // Incomplete Authentication Data
      // either only provider or only refresh_token is given..
      if ((this.refresh_token && !this.provider) ||
        (!this.refresh_token && this.provider) ||
        (this.jwt && !this.refresh_token)) {
  
        // Incomplete auth configuration..
        // console.log("incomplete auth setup: reset..")
        this.reset_everything()
        return (false)
      }
  
      if (!this.refresh_token) {
        // console.log("no previous auth session found...")
        return (false)
      }
  
      // Validate TOKENS: Correctly specified tokens
      if (!this.jwt) {
        // Check  JWT token. Issue a new token if no JWT is available:
        // console.log("...retrieve new JWT... ")
        const response = await VueRoot.retrieve_refreshed_token()

        if (!response) {
          return (false)
        }

      }

      // update axios header
      console.log("update axios header while initializing")
      ApiService.setHeader(this.jwt)

      // CALLBACK
      VueRoot.oauth_callback()
  
      return (true)
    }
  
  
    /**
     * Step 1: Send User to oAuth-Provider Authorization Routine.
     * When remote routine is finished, User returns to the redirect_uri (including authorization code).
     * oAuth Service Conditions:
     *  -   Client_Type: Public
     *  -   Response_Type: Authentication Code.
     *
     * @param provider
     * @returns nothings
     **/
    redirect_to_provider (protected_url=null, provider = 'DemokratieFabrik/fabrikAuth'){
      // console.log("redirected to provider.." + provider)
      this.reset_everything()
      this.random_state = "HUXT" + Math.floor(Math.random() * 10000000 + 1000000)
      this.provider = provider

      if(protected_url) {
        this.protected_url = protected_url
      }
      // Redirect...
      oAuthService.redirectToProvider(this.provider, this.random_state)
    }
  
    /**
     * Step 2: after receiving authentication code.
     * @returns {Promise}
     */
    async authorize_by_authentication_code (callback) {
      // console.log("authorize by code.." + this.random_state)
  
      // Error Handling....
      // TODO: can we catch console.asserts???
      let urlParams = new URLSearchParams(window.location.search);
      let authorization_code = urlParams.get('code')
      if (!authorization_code) {
        console.warn("Error during authentication routine. Authorization code is empty")
        return(false)
      }
      if (!this.random_state) {
        console.warn("Error during authentication routine. No randomState in the cache")
        return(false)
      }
      let transmitted_random_state = urlParams.get('state');
      if (!transmitted_random_state) {
        console.warn("Error during authentication routine. Received randomState is empty")
        return(false)
      }
      if (this.random_state != transmitted_random_state) {
        console.warn("Error during authentication routine. Random states do not match")
        return(false)
      }
  
      // Validate authorization code...
      // let accessToken = null
      console.assert(this.provider)
      var response = false
      try {
        var accessToken = await oAuthService.authorizeByAuthenticationCode(this.provider, authorization_code)
        if(!accessToken) {
          console.warn("No access token received 98df9")
          return(false)
        }
        console.log("last step: finalize by access code: " + accessToken)
        response = this._finalize_authentication_by_access_token(this.provider, accessToken)

      } catch (error) {
        if (error.response) {
          if (error.response.status) {
            console.warn("Error during authentication routine. 83979 " + error.response.status)
            return(false)
          } else if (error.response.data && error.response.data.error) {
            console.warn("Error during authentication routine. 77839" + error.response.data.error)
            return(false)
          }
        } else {
          console.warn("Error during authentication routine. 098876 - Unknown error.")
          return(false)
        }
      }
      
      if(response && callback) {
        callback()
      }

      return (response)
    }
  
  
    /**
     * Perform logout. reset all oAuth data (including cookie)
     */
    async logout(callback) {
      // console.log("logout called..")

      this.reset_everything()

      // Revoke refresh token (oAuth Server)
      if (this.refresh_token) {
        void oAuthService.tokenRevoke(this.provider, this.refresh_token)
      }

      if(callback) {
        callback()
      }
    }
  
    /**
     * Reset all oAuth params to null
     * => force to re-login.
     */
    reset_everything(){
      // console.log("reset everything...")
      this.jwt = null
      this.random_state = null
      this.provider = null
      this.refresh_token = null
    }
  
  
    // /**
    //  * Show error message popup in vue.js
    //  * @param msg_body
    //  * @private
    //  * TODO: move it beyond  oauth mixin..
    //  */
    // notify (msg_body, msg_title = 'Authentication error', type:string = 'error'){
    //   this.reset_everything()
    //   this._flash.show({ status: type, title: msg_title, message: msg_body })
    //   this._router.push({ name: 'login_screen' })
    //   throw new Error(`fabrikClient Error: ${msg_body}`)
    // }
  
    /**
     * Finalization routine:
     * a) notifies resource server (fabrikApi). (transforms accessToken to JWT)
     * b) notifies Vue.js on successful login. (stores jwt in axios default header)
     * @param provider
     * @param accessToken
     */
    async _finalize_authentication_by_access_token (provider, accessToken) {
  
      // Validate parameters
      if (!accessToken) {
        console.log("error accessToken has not been transmitted...")
        return(false)
        // let details = 'Error during authentication routine. Received accessToken is empty'
        // this.notify(details)
      }
      console.assert(provider)
      console.assert(accessToken)
      console.assert(accessToken['refresh_token'])
      this.refresh_token = accessToken['refresh_token']
      this.random_state = null
      this.jwt = accessToken['access_token'] // bidirectional => axios header... 
      // console.log("successfull (re-)login..." + accessToken['access_token'])
      console.assert(this.jwt)
      return (true)
    }
}

export default oauthSession
