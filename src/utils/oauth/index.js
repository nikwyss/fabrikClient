/*
This does initiate a oauth2 session and stores it in Vue.$session
// TODO: Significant rewriting necessary: => i.e. use EventBus
*/

import oauthLibrary from './library'
import { LayoutEventBus } from 'src/utils/eventbus.js'
import { ApiService } from '../xhr'
import { Allow400Status, ReloginOnStatus403 } from '../xhr'
import {mapGetters, mapActions} from 'vuex'
import Configuration from 'src/utils/configuration'


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

      },

      methods: {

        /**
         * Initialize  refresh token and JWT etc  from cookie...
         * Check expiration date of JWT
         * If JWT is missing or expired => call refresh token
         * @returns {Promise<boolean>}
         */
        async oauth_initialize() {
          var that = this
          console.log("init oauth")

          async function onAxiosReject(error) {
            // onAxiosReject = async function (error) {
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
              LayoutEventBus.$emit('showNetworkError')
              return Promise.reject(error)

            } else if (error.response.status == 400) {
              // 400 errors (parse errors)
              if (Allow400Status(error.config)) {
                  // dont raise 400 errors, if this is made explicit
                  console.log("AXIOS: Pass Error 400")
                  return (true)
              }

              return Promise.reject(error)

            } else if (error.response.status == 405) {
              // 405 errors (parse errors)
              console.log("AXIOS: Pass Error 405")
              LayoutEventBus.$emit('showAuthorizationError')
              return Promise.reject(error)

            } else if (error.response.status == 403) {

              // 403 errors: Permission errors : probaly token expired...
              if (ReloginOnStatus403(error.config)) {
                console.log("AXIOS: ReloginOnStatus403")
                // at 403: try to (re)establish authentication, if not explicitly denied..
                if (!that.$session.refresh_token || error.config.retry) {

                  // Ooops. There seems to be a need for a complete (re)login.
                  if (that.oauth_authenticated) {
                    LayoutEventBus.$emit('showAuthorizationError')
                  }else{
                    LayoutEventBus.$emit('showAuthenticationWarning')
                  }
                  console.log("Oauth Permission request error")
                  return Promise.reject(error)
                }

                // Not too bad: only a token refresh might fix this.
                // Hence, we specify the token refresh function and th status 449 ("retry with")
                console.log("try to refresh token and then relaunch xhr (2)")
                error.response.status = 449
                error.config.retoken = await that.retrieveNewJWT({})
                error.config.retry = true

                // Token should now be up to date!
                return (error.config)
              }
            }

            // All other errors:
            console.log("Unknown oauth request error")
            console.log("status: " + error.response.status)
            LayoutEventBus.$emit('showServiceError')
            return Promise.reject(error)
          }

          // Allow "publicVueUpdateMethod" method to be accessed by popup window.
          window.publicVueUpdateMethod = this.publicVueUpdateMethod
          // TODO: put this in root Vue or in helper (this is not only oauth specific)
          ApiService.mountAxiosInterceptor(onAxiosReject)

          this.registerListener()

          // ONGOING AUTHENTICATION PROCESS: NO Initizalization needed.
          if (this.$session.random_state) {
            console.log("ongoing authentication (random state is transmitted)..")
            console.log( `${this.$session.random_state} - Random state `)
            return (true)
          }

          LayoutEventBus.$emit('oauthUpdate')

          // at least refresh token is available. Thats okay so far.
          return (true)
        },

        clickAuthLink(route) {
          if (!route) {
            var route = {name: 'assemblies'}
          }
          route = this.$router.resolve(route)
          this.$session.redirect_to_provider(route.href)
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
             this.oauthUpdate({newdate, jwt})
          })

          /* This Method Removes all Oauth Artefats from session and localstorage  */
          LayoutEventBus.$on('oauthResetEverything', jwt => {
            console.log("oauthResetEverything Listener...")
            let newdate = new Date ()
            this.resetEverything() // passing {}??
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
              // if (window.opener !== null){
              let url = Configuration.value('ENV_DOMAIN')
              window.location.href=url
              //.publicVueUpdateMethod(notification)
              // window.close()
              // }else{
              // this.$q.notify(notification)
              // }
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
          LayoutEventBus.$emit('hideNotificationBanners')
          LayoutEventBus.$emit('oauthUpdate')
        },

        ...mapActions({
          retrieveNewJWT: 'oauthstore/retrieveNewJWT',
          oauthUpdate: 'oauthstore/oauthUpdate',
          resetEverything: 'oauthstore/resetEverything'
        }),
      }
    })
  }
}
