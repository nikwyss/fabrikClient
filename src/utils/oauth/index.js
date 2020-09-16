/*
This does initiate a oauth2 session and stores it in Vue.$session
// TODO: Significant rewriting necessary: => i.e. use EventBus
*/

import oauthLibrary from './library'
import { LayoutEventBus } from 'src/utils/eventbus.js'
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

      // destroyed () {
      // // TODO: Does not work: destroys listener on lifetime
      //   LayoutEventBus.$off('oauthAuthenticationEnds')
      //   LayoutEventBus.$off('oauthUpdate')
      //   LayoutEventBus.$off('oauthResetEverything')
      // },

      mounted () {
        // TODO: this is run mulitple times in each component that used the mixins. 
        // how to limit this on root. Seems to be freaky.
        if(this.$root === this) {
          // initialize oauth library on browser startup
          this.oauth_initialize(this)
        }
      },

      computed: {

        ...mapGetters({
          retrieveCredentials: 'oauthstore/retrieveCredentials',
          oauth_userid: 'oauthstore/oauth_userid',
          oauth_authenticated: 'oauthstore/oauth_authenticated',
          oauth_username: 'oauthstore/oauth_username',
          oauth_ongoing: 'oauthstore/oauth_ongoing'
        }),

        // /* Reads JWT from Cookie */
        // oauth_jwt_decoded:  function () {
        //   return (this.retrieveCredentials)
        // },

        // oauth_userid: function () {
        //   // TODO: put this in vuex, right?
        //   // console.log("READ userid...........")
        //   const token = this.oauth_jwt_decoded
        //   if (token) {
        //     return (token['sub'])
        //   }
        // },

        // /* Authentication is alright, as soon as refresh token is present 
        // // TODO: put this 
        // */
        // oauth_authenticated: function () {
        //   // console.log("OREAD authenticated...")
        //   // return (this.$session.refresh_token)
        //   const token = this.oauth_jwt_decoded
        //   if (!token || !token['sub']){
        //     return (false)
        //   }else {
        //     return (true)
        //   }
        // },

        // oauth_username: function () {
        //   // console.log("READ username...........")
        //   const token = this.oauth_jwt_decoded
        //   if (token) {
        //     return (token['userName'])
        //   }
        // },

        // oauth_ongoing: function () {
        //   // console.log(this.$session.random_state)
        //   return(!!this.$session.random_state)
        // }
      },
      
      
      methods: {

        /**
         * Initialize  refresh token and JWT etc  from cookie...
         * Check expiration date of JWT
         * If JWT is missing or expired => call refresh token
         * @returns {Promise<boolean>}
         */
        async oauth_initialize() {

          // Allow "publicVueUpdateMethod" method to be accessed by popup window.
          window.publicVueUpdateMethod = this.publicVueUpdateMethod
          // TODO: put this in root Vue or in helper (this is not only oauth specific)
          ApiService.mountAxiosInterceptor(this.onAxiosReject)

          this.registerListener()

          // ONGOING AUTHENTICATION PROCESS: NO Initizalization needed.
          if (this.$session.random_state) {
            console.log("ongoing authentication (random state is transmitted)..")
            console.log( `${this.$session.random_state} - Random state `)
            return (true)
          }

          this.$store.dispatch('oauthstore/oauthUpdate', {})

          // at least refresh token is available. Thats okay so far.
          return (true)
        },
    
        /**
        * forceVueUpdateOfOpener  push notification to opener window
        * is normally called after login routine in popup window (Necessary since Vue-responsivity is flawed)
        */
        registerListener() {
          /* Register oAuthUpdate EventBus.
          * This Method Updates local oauth storage based on Cookie data */
          LayoutEventBus.$on('oauthUpdate', jwt => {
            console.log("oauthUpdate Listener...")
             let newdate = new Date ()
             this.$store.dispatch('oauthstore/oauthUpdate', {newdate, jwt})
          })

           
          /* This Method Removes all Oauth Artefats from session and localstorage  */
          LayoutEventBus.$on('oauthResetEverything', jwt => {
            console.log("oauthResetEverything Listener...")
            let newdate = new Date ()
            this.$store.dispatch('oauthstore/resetEverything', {})
          })
 
          /* Event is raised when Authentication process ends. (success or error)
          * Goals: 
          * 1) inform user about error or success. 
          * 2) in case of popups: notify potential Opener Window and close popup
          */

          LayoutEventBus.$on('oauthAuthenticationEnds', data => {
            console.log("oauthAuthenticationEnds Listener...")
  
            // Anyway: hide loading messages...
            LayoutEventBus.$emit('hideLoading')

            // on Error:
            if (!this.oauth_authenticated) {
              console.log("AUTHENTICATION FAILED")
              LayoutEventBus.$emit('showAuthenticationError')
            }

            // on Success
            if(this.oauth_authenticated) {
              console.log("AUTHENTICATED")

              // Prepare Notification Message
              const msg_title = this.$i18n.t('auth.authentication_succeeded_title')
              const msg_caption = this.$i18n.t('auth.authentication_succeeded_caption')
              const notification = {
                type: 'info',
                caption: `${msg_caption}`,
                message: `${msg_title}`
              }

              // On Popup
              if (window.opener !== null){
                window.opener.publicVueUpdateMethod(notification)
                window.close()
              }else{
                this.$q.notify(notification)
              }
            }
          })
        },

        publicVueUpdateMethod(notification) {
          // notify Vuex that cookie might have change...
          if (notification){
            this.$q.notify(notification)
          }
          console.log("Popup requests update of oauth runtime values!")
          LayoutEventBus.$emit('resetLayoutToDefault')
          LayoutEventBus.$emit('oauthUpdate')
        },

        async onAxiosReject (error) {
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
                    error.config.retoken = await this.$store.dispatch('oauthstore/retrieveNewJWT', {})
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
      //   retrieve_refreshed_token: async function() {
      //     console.log("START refresh token handling")

      //     // VALIDATE DATA
      //     // re-read cookie values
      //     // TODO: dont know why I have to doo this...
      //     console.assert(this.$session.refresh_token)
      //     console.assert(this.$session.provider)

      //     // empty jwt
      //     // this.$session.set_jwt_cookie(null)
          
      //     // Re-issue a token
      //     // try to re-issue an access_token by refresh token.
      //     let accessToken = await oAuthService.tokenRefresh(this.$session.provider, this.$session.refresh_token)
      //     if (!accessToken) {
      //       // console.log("auth session invalid: reset and redirect to login..")
      //       // let msg_title = 'Session Timeout'
      //       // let msg_body = 'We could not continue your last login session. Please login again!'
      //       // this._flash.show({ status: 'warning', title: msg_title, message: msg_body })
      //       this.$session.reset_everything()
      //       return (false)
      //     }

      //     // Convert to JWT
      //     // let success = await this.$session._finalize_authentication_by_access_token(this.$session.provider, accessToken)
      //     // console.assert(success)
      //     return (true)
      //   }
      }
    })
  }
}
