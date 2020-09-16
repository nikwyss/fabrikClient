/* eslint-disable */
import { oAuthService } from './requests';
import {get_cookie_value, set_cookie_value} from '../cookie.service'
import { LayoutEventBus } from 'src/utils/eventbus.js'

// DEFINE SESSION Object
class oauthLibrary {

    static protected_url = null

    set_jwt_cookie (value) {
      console.log("update jwt cookie" + value)

      // TODO: not sure, whether jwt should be saved in cookies or only in runtime variable.
      set_cookie_value('oauth_jwt', value)
      set_cookie_value('oauth_random_state', null)

      // Global notification  that login status has changed ...
      const jwt = value
      LayoutEventBus.$emit('oauthUpdate', jwt)
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
    // TODO: does it have to be in a cookie?
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
    redirect_to_provider (protected_url=null, provider = 'demokratiefabrik/fabrikAuth'){
      // console.log("redirected to provider.." + provider)
      LayoutEventBus.$emit("oauthResetEverything")

      this.random_state = "HUXT" + Math.floor(Math.random() * 10000000 + 1000000)
      this.provider = provider

      if(protected_url) {
        this.protected_url = protected_url
      }
      // Redirect...
      console.log("redirect to " + protected_url)
      oAuthService.redirectToProvider(this.provider, this.random_state)
    }
  
    /**
     * Step 2: after receiving authentication code.
     * @returns {Promise}
     */
    async authorize_by_authentication_code () {
  
      let urlParams = new URLSearchParams(window.location.search);
      let authorization_code = urlParams.get('code')
      console.log("oAuth step 2: AUthorization by code: " + authorization_code)
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
      console.assert(this.provider)
      try {

        const accessToken = await oAuthService.authorizeByAuthenticationCode(this.provider, authorization_code)
        if(!accessToken || !('access_token' in accessToken)) {
          console.warn("No access token received 98df9")
          return(false)
        }
        
        const jwt = accessToken['access_token']
        console.log("last step: finalize by access code: " + jwt)
        this.set_jwt_cookie(jwt)

      } catch (error) {

        // Finalize...
        console.log('error while authorizeByAuthentication' + error)

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

      LayoutEventBus.$emit('oauthAuthenticationEnds')
    }
  
  
    /**
     * Perform logout. reset all oAuth data (including cookie)
     */
    async logout () {
      console.log ("Logout method...")
      
      // Revoke refresh token (oAuth Server)
      if (this.refresh_token) {
        void oAuthService.tokenRevoke(this.provider, this.refresh_token)
      }

      console.log("emit 1")
      LayoutEventBus.$emit("oauthResetEverything")

      // Global notification  that login status has changed ...
      console.log("emit 2")
      LayoutEventBus.$emit("resetLayoutToDefault")

    }
}

export default oauthLibrary
