// import { boot } from 'quasar/wrappers';
import store from 'src/store'
import { runtimeStore } from "src/store/runtime.store";

/// POLYFILL (IE11 for oAuth2 PKCE Module)
; (function (window) {
  if (typeof window.TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding');
    window.TextEncoder = TextEncodingPolyfill.TextEncoder;
    window.TextDecoder = TextEncodingPolyfill.TextDecoder;
  }
  if (typeof window.crypto === 'undefined') {
    const { webcrypto } = require("webcrypto-shim")
  }
  if (typeof window.fetch === 'undefined') {
    const { fetch } = require('whatwg-fetch')
    // window.fetch = fetch
  }
}(window));


const { OAuth2AuthCodePKCE } = require('@bity/oauth2-auth-code-pkce')
import { LayoutEventBus } from 'src/utils/eventbus'
import { mapActions } from "vuex";

/**
 * OAuth2AuthCodePKCE Configuration
 */
const pkce_config = {
  authorizationUrl: `${process.env.ENV_OAUTH_BASE_URL}/o/authorize/`,
  tokenUrl: `${process.env.ENV_OAUTH_BASE_URL}/o/token/`,
  clientId: process.env.ENV_OAUTH_CLIENT_ID,
  scopes: ['read'], // TODO
  redirectUrl: `${process.env.ENV_DOMAIN}${process.env.ENV_OAUTH_LOCAL_REDIRECTION_URI}`,

  onAccessTokenExpiry(refreshAccessToken) {
    console.log('Expired! Access token needs to be renewed.')
    console.log("PKCE: ", Vue.prototype.pkce)
    // console.log('We will try to get a new access token via grant code or refresh token.')
    return refreshAccessToken()
  },
  onInvalidGrant(refreshAuthCodeOrRefreshToken) {
    console.log('Expired! Auth code AND refresh token needs to be renewed. => Redirect to authserver!')
    // console.log("PKCE: ", Vue.prototype.pkce)
    // NOT TRUE IN MANY CASES => parallel accesses?!!!
    console.trace()

    // However, in some special cases a redirect is not desired. i.e. when sending final eventmessages before closing the browser.
    if (!runtimeStore.appExitState) {
      LayoutEventBus.$emit('ReloadPayload')
      return refreshAuthCodeOrRefreshToken()
    } else {
      // app has been exited already : never ever redirect again...
      return Promise
    }
  }
}


export default {

  install(Vue, options) {

    Vue.prototype.pkce = new OAuth2AuthCodePKCE(pkce_config)
    // Vue.prototype.enforce_reactivity = 1


    // Methods
    Vue.prototype.login = function (destination_route = null) {
      // save destiantion route to localstorage
      localStorage.setItem('oauth2authcodepkce-destination', JSON.stringify(destination_route));
      Vue.prototype.pkce.fetchAuthorizationCode()
    }

    Vue.prototype.logout = function () {
      LayoutEventBus.$emit('BeforeLogout', {}, true)

      Vue.prototype.pkce.reset();

      // 1. technical level notification: e.g. replace token in axios / delete user cache
      // console.log("oAUTH: token reset => emit AfterTokenChanged")
      LayoutEventBus.$emit('AfterTokenChanged', null)

      // 2: user level notification  
      // console.log("oAUTH: token updated => emit AfterLogout")
      LayoutEventBus.$emit('AfterLogout')
    }

    // Component Mixin
    Vue.prototype.oauth = new Vue({

      data: function () {
        return {
          enforce_reactivity: 1
        }
      },

      computed: {

        authorized: function () {
          // enforce_reactivity: changing enforce_reactivity allows onthefly modifications of oauth data (username, logoin  status)  
          // just change this property, and all computed data is reloaded...
          const authorized = this.enforce_reactivity > 0 && Vue.prototype.pkce.state && 'accessToken' in Vue.prototype.pkce.state && Vue.prototype.pkce.state.accessToken.value && Vue.prototype.pkce.isAuthorized()
          // console.log(`...OAUTH: authorized: ${authorized}`)
          return (authorized)
        },

        ongoing: function () {
          // Its not yet clear, if user is logged in (i.e. login process is ongoing)
          return (this.authorized === null || this.authorized === undefined)
        },

        payload: function () {
          // console.log('...OAUTH: loaeding payload..')
          if (!this.authorized || !('accessToken' in Vue.prototype.pkce.state)) {
            // LayoutEventBus.$emit('AfterTokenChanged', null)
            // console.log('...OAUTH: not authorized')
            return (null)
          }

          // add xhr decorator
          const jwt = Vue.prototype.pkce?.state?.accessToken?.value
          const payload = JSON.parse(window.atob(jwt.split('.')[1]))
          // console.log(payload)
          return (payload);
        },

        username: function () {
          // console.log('...OAUTH: loading username..')
          if (this.payload) {
            // console.log(`   username: ${this.payload.userName}`)
            return (this.payload.userName)
            // }else{
            //   console.log('   username: null')
          }
        },

        userid: function () {
          // console.log('...OAUTH: loading userid..')
          if (this.payload) {
            return (this.payload.sub)
          }
        },

        incompleteProfile: function () {
          return (!this.payload || !this.payload.userEmail)
        }
      },

      methods: {
        /**
         * Returns a list of all roles obtained by the authenticated user for the given assembly
         * @param {*} assemblyIdentifier 
         */
        ...mapActions({
          touchRandomSeed: "assemblystore/touchRandomSeed",
          storeOauthAcls: "publicprofilestore/storeOauthAcls"
        }),


        /* Refresh token already before a invalid request has been issued */
        refresh_token_if_required: async function () {
          // console.log(this.payload.exp)
          if (Vue.prototype.pkce.isAuthorized()) {
            console.log("CHECK IF EXPRIRED in ... refresh_token_if_required")
            const expired = Vue.prototype.pkce.isAccessTokenExpired()
            if (expired) {
              // console.log("EXPRIRED in ... refresh_token_if_required")
              store.dispatch("tokenRefreshStarts")
              await Vue.prototype.pkce.exchangeRefreshTokenForAccessToken()
              store.dispatch("tokenRefreshEnds")
              // console.log("Reload payload in ... refresh_token_if_required")
              LayoutEventBus.$emit('ReloadPayload')
            }
          }
        }
      },

      created: function () {

        LayoutEventBus.$on('AfterLogout', data => {
          this.enforce_reactivity += 1
        })

        LayoutEventBus.$on('ReloadPayload', data => {
          this.enforce_reactivity += 1
        })

        LayoutEventBus.$once('AuthenticationLoaded', data => {
          // SYNC USER PROFILE
          // is email already set: if not => redirect to userprofile...
          console.log("--EVENT AuthenticationLoaded => syncProfile..")
          console.log("PKCE: ", Vue.prototype.pkce)
          if (this.userid) {
            store.dispatch("publicprofilestore/syncProfile", {
              oauthUserID: this.userid,
              oauthUserEmail: this.payload?.userEmail
            });
          }
        })

        // console.log("INI oAUTH2 Mixin")
        // INITIAL Data Loading
        Vue.prototype.pkce.isReturningFromAuthServer().then(hasAuthCode => {
          if (hasAuthCode) {
            // A valid Redirect by the auth server
            Vue.prototype.pkce.getAccessToken().then(({ token, scopes }) => {
              this.enforce_reactivity += 1

              // 1. One: technical stuff: replace token in axios
              // note: alteady authorized: but vue has not yet been notified. (no reactivity in properties of pkce module)
              // console.log("oAUTH: token received => emit AfterTokenChanged", token.value)
              LayoutEventBus.$emit('AfterTokenChanged', token.value)

              // Authentication process is finished: it is clarified, if a user is logged in or not
              // you may start the user-specific api calls..
              console.log("AFTER LOGIN")
              LayoutEventBus.$emit('AfterLogin')

              // Authentication process is finished: it is clarified, if a user is logged in or not
              // you may start the user-specific api calls..
              if (this.userid) {
                LayoutEventBus.$emit('AuthenticationLoaded')
              }

            })
              .catch(error => {
                console.log("error in oauth plugin (1)..")
                // More errors to handle.
                console.error(error)
                LayoutEventBus.$emit('LoginError', error)
                Vue.prototype.logout()

                // Authentication process is finished: it is clarified, if a user is logged in or not
                // you may start the user-specific api calls..
                if (this.userid) {
                  LayoutEventBus.$emit('AuthenticationLoaded')
                }

              })
          } else {
            if (this.userid) {
              LayoutEventBus.$emit('AuthenticationLoaded')
            }
          }
        })
          .catch((error) => {
            LayoutEventBus.$emit('AfterTokenChanged', null)
          })

        if (!this.ongoing) {
          // Authentication process is finished: it is clarified, if a user is logged in or not
          // you may start the user-specific api calls..

          // DEFAULT Browser Reload
          const jwtshort = jwt ? jwt.substring(jwt.length - 5) : 'jwt empty'
          console.log("1.))) Relaunch App: Read Authorization Token from Localstorage. JWT: ", jwtshort)
          const jwt = Vue.prototype.pkce?.state?.accessToken?.value
          if (jwt) {
            console.log("...emit AfterTokenChanged")
            LayoutEventBus.$emit('AfterTokenChanged', jwt)
          }

          if (this.userid) {
            LayoutEventBus.$emit('AuthenticationLoaded')
          }
        }
      }
    })
  }
}
