/*
This does initiate a oauth2 session and stores it in Vue.$session
// TODO: Significant rewriting necessary: => i.e. use EventBus
*/

import oauthSession from './oauth.main'
import { LayoutEventBus } from 'src/layouts/components/eventbus.js'
import {oAuthService} from "./oauth.api"
import { ApiService } from '../../utils/xhr'
import { Allow400Status, ReloginOnStatus403 } from '../../utils/xhr'

console.log('Installing the Oauth Plugin!')
export default {

  install (Vue, opts) {

    // add the session instance as Vue property (non-reactive)
    const session = new oauthSession()
    Vue.prototype.$session = session

    // Add a reactive "authenticated" variable to the Vue.$root:
    // and initialize the session.
    Vue.mixin({
      data() {
        return {
          authenticated : undefined,
          username: undefined,
          userid: undefined
        }
      },
      methods: {

        /**
        * oauth_callback  is normally called at the end of an oauth ajax request.
        */
        oauth_callback: function() {
          console.log("CALL BACK")
          this.$root.authenticated = this.$session.authenticated()

          // decode session
          if (this.$session._jwt) {
            let token = oAuthService.tokenDecode(this.$session._jwt)
            this.$root.username = token['userName']
            this.$root.userid = token['sub']
          } else {
            this.$root.username = null
            this.$root.userid = 0
          }
        },

        /**
        * oauth_callback  push notification to opener window
        * is normally called after login routine in popup window (Necessary since Vue-responsivity is flawed)
        */
       forceVueUpdateOfOpener() {
          console.log("Try TO UPDATE OPENER")
          console.log(window)
          window.opener.forceVueUpdate()
        },

        forceVueUpdate() {
          console.log("Vue Update after authentication")
          var protected_url = this.$session.protected_url
          if (this.$session.protected_url) {
            console.log("Redirect to protected_url in temp")
            this.$session.protected_url = null
            window.location.href=protected_url
          }else{
            window.location.reload()
          }
          // hard refresh really necessary????
          // for updating reactive fields???
          // console.log("UPPPDAAATED")
          // // this.$session._jwt = null
          // console.log("UPPPDAAATED:  " + this.$session.jwt)
          // this.$session.initialize(this)
          //           this.oauth_callback()
          // this.$forceUpdate() // does not work. Useless?          
        },

        onAxiosReject: function (error) {
            // enfoce that ApiService Wrapper is used, (and not pure Axios)
            console.log("XHR ERROR")
            ApiService.is_api_service_used_as_axios_wrapper(error.config)
            
            // No remote connection established
            if (!error.response) {
                let msg_title = 'Network Error'
                let msg_body = 'We could not make a connection to the service provider. Please try again!'
                // this._flash.show({ status: 'error', title: msg_title, message: msg_body })
                console.log("Network error")
                console.warn(msg_title + ' ' + msg_body)
                LayoutEventBus.$emit('showServiceError')
                return(false)

            } else if (error.response.status == 400) {
                // 400 errors (parse errors)
                if (Allow400Status(error.config)) {
                    // dont raise 400 errors, if this is made explicit
                    // console.log("AXIOS: Pass Error 400")
                    return (true)
                }

            } else if (error.response.status == 403) {
                // 403 errors
                if (ReloginOnStatus403(error.config)) {
                console.log("AXIOS: ReloginOnStatus403")
                // at 403: try to (re)establish authentication, if not explicitly denied..
                if (this.$session.refresh_token && !error.config.retry) {
                    // Not too bad: only a token refresh might fix this.
                    // Hence, we specify the token refresh function and th status 449 ("retry with")
                    console.log("try to refresh token and then relaunch xhr (2)")
                    error.response.status = 449
                    error.config.retoken = this.$root.retrieve_refreshed_token
                    error.config.retry = true
                    return (error.config)
                }

                // There seems to be a need for a complete (re)login.
                // retoken is not possible anymore (due to logout / or session expiration?)
                console.log('cannot access refresh token')
                var customactions = [
                  { label: 'Homepage', color: 'white', handler: () => { this.$router.push('/') } }
                ]

                if (this.$root.authenticated) {
                  LayoutEventBus.$emit('showAuthorizationError')
                }else{
                  LayoutEventBus.$emit('showAuthenticationWarning')
                }

                return (false)
            }
          }

          // All other errors:
          console.log("Unknown oauth request error")
          LayoutEventBus.$emit('showServiceError')
          return Promise.reject(error)
      },

      /**
       * Refresh token routine: MAIN
       * @returns {Promise<void>}
       */
      retrieve_refreshed_token: async function() {
        console.log("START refresh token handling")

        // VALIDATE DATA
        // re-read cookie values
        // TODO: dont know why I have to doo this...
        console.assert(this.$session.refresh_token)
        console.assert(this.$session.provider)

        // empty jwt
        this.jwt = null

        // Re-issue a token
        // try to re-issue an access_token by refresh token.
        let accessToken = await oAuthService.tokenRefresh(this.$session.provider, this.$session.refresh_token)
        if (!accessToken) {
          // console.log("auth session invalid: reset and redirect to login..")
          // let msg_title = 'Session Timeout'
          // let msg_body = 'We could not continue your last login session. Please login again!'
          // this._flash.show({ status: 'warning', title: msg_title, message: msg_body })
          this.$session.reset_everything()
          return (false)
        }

        // Convert to JWT
        let success = await this.$session._finalize_authentication_by_access_token(this.$session.provider, accessToken)
        console.assert(success)
        return (true)
      }
    },

    mounted: function() {
        // add only to root object
        if(this.$root == this) {
          console.log("Added onAxiosReject Event Listener")
          // this.extend(onAxiosReject)

          // TODO: put this in root Vue or in helper (this is not only oauth specific)
          ApiService.mountAxiosInterceptor(this.onAxiosReject)

          console.log("INITIAILIZE")
          this.$session.initialize(this)
          console.log("END MOUNT")
          
          // Force update Vue
          // TODO: not used, right? (have once be used after authentication...)
          console.log("VueUpdate")
          window.forceVueUpdate = this.forceVueUpdate
        }
      }
    })
  }
}
