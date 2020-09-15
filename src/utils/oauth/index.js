/*
This does initiate a oauth2 session and stores it in Vue.$session
// TODO: Significant rewriting necessary: => i.e. use EventBus
*/

import oauthLibrary from './library'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import {oAuthService} from "./requests"
import { ApiService } from '../xhr'
import { Allow400Status, ReloginOnStatus403 } from '../xhr'
import {mapGetters} from 'vuex'


console.log('Installing the Oauth Plugin!')
export default {

  install (Vue, opts) {

    // add the session instance as Vue property (non-reactive)
    const session = new oauthLibrary()
    Vue.prototype.$session = session

    // Add a reactive "authenticated" variable to the Vue.$root:
    // and initialize the session.
    Vue.mixin({
      // data() {
      //   return {
      //     authenticated : undefined,
      //     username: undefined,
      //     userid: undefined
      //   }
      // },

      methods: {

        /**
        * oauth_callback  is normally called at the end of an oauth ajax request.
        */
        // oauth_callback: function() {
        //   // console.log("CALL BACK")
        //   // //hmm: this.oauth_authenticated = this.$session.authenticated()

        //   // // decode session
        //   // if (this.$session._jwt) {
        //   //   let token = oAuthService.tokenDecode(this.$session._jwt)
        //   //   this.oauth_username = token['userName']
        //   //   this.oauth_userid = token['sub']
        //   // } else {
        //   //   this.oauth_username = null
        //   //   this.oauth_userid = 0
        //   // }
        // },

        /**
        * forceVueUpdateOfOpener  push notification to opener window
        * is normally called after login routine in popup window (Necessary since Vue-responsivity is flawed)
        */
       forceVueUpdateOfOpener() {
          console.log("Try TO UPDATE OPENER:")
          if (window.opener !== null){
            window.opener.forceVueUpdate()
          }
        },

        forceVueUpdate() {
          // notify Vuex that cookie might have change...
          console.log("DRAWER IS GOING TO BE CLOSED..................!!!!")
          LayoutEventBus.$emit('resetLayoutToDefault')
          LayoutEventBus.$emit('oauthUpdate')
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
                console.warn(`${msg_title} ${msg_body}`);
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

                if (this.oauth_authenticated) {
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
          this.$session.set_jwt(null)
          
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

      computed: {

        ...mapGetters({
          retrieve_oauth_data: 'oauthstore/retrieve_oauth_data'
        }),

        /* Reads JWT from Cookie */
        oauth_jwt_decoded:  function () {
          return (this.retrieve_oauth_data)
        },

        oauth_userid: function () {
          // console.log("READ userid...........")
          const token = this.oauth_jwt_decoded
          if (token) {
            return (token['sub'])
          }
        },

        oauth_authenticated: function () {
          // console.log("OREAD authenticated...")
          const token = this.oauth_jwt_decoded
          if (!token || !token['sub']){
            return (false)
          }else {
            return (true)
          }
        },

        oauth_username: function () {
          // console.log("READ username...........")
          const token = this.oauth_jwt_decoded
          if (token) {
            return (token['userName'])
          }
        },

        oauth_ongoing: function () {
          console.log(this.$session.random_state)
          return(!!this.$session.random_state)
        }
      },
      
      beforeDestroy () {
        LayoutEventBus.$off('authentication_ends')
        LayoutEventBus.$off('oauthUpdate')
      },

      mounted () {
        // TODO: this is run mulitple times in each component that used the mixins. 
        // how to limit this on root.
        if(this.$root === this) {

          // Allow "forceVueUpdate" method to be accessed by popup window.
          window.forceVueUpdate = this.forceVueUpdate

          // TODO: put this in root Vue or in helper (this is not only oauth specific)
          ApiService.mountAxiosInterceptor(this.onAxiosReject)

          // // initialize oauth library
          this.$session.initialize(this)


          /* Register oAuth update EventBus.
          * Shall be called, after oauth cookie has been modified)
          * Goal: notify Vuex Getter about this Modification. */
         console.log("register eventbus")
         LayoutEventBus.$on('oauthUpdate', data => {
            // console.log(" notify gloablly that oauth changed...")
            console.log("Kkkkkkkkkkkkkkkkkkkkk")
            let newdate = new Date ()
            this.$store.dispatch('oauthstore/oauthUpdate', {newdate})
          })

          /* Event is raised after Authentication process ends. (success or error)
          * Goal: notify Opener Window (when authentication process took place in Popup
          */
          LayoutEventBus.$on('authentication_ends', data => {
            // Update local data.
            // this is since the cookie plugin as well as the VUE.prototype $session is not reactive.
            // this.$root.oauth_callback()
            console.log("ending authorization....444444")
            LayoutEventBus.$emit('hideLoading')

            if (!this.oauth_authenticated) {
              LayoutEventBus.$emit('showAuthenticationError')
            }

            this.forceVueUpdateOfOpener()

            if(this.oauth_authenticated) {
                console.log("AUTHENTICATED")
                window.close()
            }
          })
        }
      }
    })
  }
}
