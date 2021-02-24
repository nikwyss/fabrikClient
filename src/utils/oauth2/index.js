// import { boot } from 'quasar/wrappers';
import store from 'src/store'
import { runtimeStore } from "src/store/runtime.store";
import ApiService from "src/utils/xhr";
import constants from 'src/utils/constants'


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
    return refreshAccessToken()
  },
  onInvalidGrant(refreshAuthCodeOrRefreshToken) {
    if (!runtimeStore.appExitState) {
      console.log("TOKEN REFRESH FAILED")
      console.log('Expired! Auth code AND refresh token needs to be renewed. => Redirect to authserver!')
      throw new Error("ErrorInvalidGrant");
    } else {
      // TOKEN Failed. However, user is up to leave the page. (so ignore it...)
      Promise.resolve()
    }
  }
}

function Sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
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

    Vue.prototype.logout = async function () {
      await store.dispatch('monitorFire', {
        eventString: constants.MONITOR_LOGOUT, data: {}
      })

      Vue.prototype.pkce.reset();

      // 1. technical level notification: e.g. replace token in axios / delete user cache
      // console.log("oAUTH: token reset => emit AfterTokenChanged")
      LayoutEventBus.$emit('AfterTokenChanged', null)

      // 2: user level notification  
      // console.log("oAUTH: token updated => emit AfterLogout")
      LayoutEventBus.$emit('AfterLogout')
    }

    Vue.prototype.refresh_token = async function () {

      // console.log("EXPRIRED in ... refresh_token_if_required")
      store.dispatch("tokenRefreshStarts")

      try {
        await Vue.prototype.pkce.exchangeRefreshTokenForAccessToken()
        const jwt = Vue.prototype.pkce.state.accessToken.value
        ApiService.setHeader(jwt)
        console.log("token refreshed...!")

      } catch (error) {
        console.log("Error while refreshing token #83", error)
      }
      store.dispatch("tokenRefreshEnds")

      LayoutEventBus.$emit('ReloadPayload')
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
            // alert("test1")
            console.log("CHECK IF EXPRIRED in ... refresh_token_if_required")
            const expired = Vue.prototype.pkce.isAccessTokenExpired()
            if (expired) {
              Vue.prototype.refresh_token()
            }
          }

          return true
        },

        // /* Refresh token already before a invalid request has been issued */
        // refresh_token_if_required: async function (iter = 0) {

        //   if (!Vue.prototype.pkce.isAuthorized()) {
        //     console.log("Not logged in: no token refresh required...")
        //     Promise.resolve()
        //   }

        //   // WAIT FOR ONGOING TOKEN REQUESTS!
        //   function ensureNoRefreshTokenIsOngoing() {
        //     const maxiter = 50
        //     let iter = 0
        //     return new Promise(function (resolve, reject) {
        //       (function waitForOngoingTokenRefresh() {
        //         if (store.state.ongoingTokenRefresh !== true) return resolve();
        //         iter++;
        //         if (iter >= maxiter) {
        //           console.log("TOKEN REFRESH FAILED (infinity loop)")
        //           store.dispatch("tokenRefreshEnds")
        //           Promise.reject("TOKEN REFRESH FAILED (infinity loop)")
        //           // return refreshAuthCodeOrRefreshToken()
        //         }
        //         console.log('.')
        //         setTimeout(waitForOngoingTokenRefresh, 300);
        //         // } else {
        //         // }
        //       })()
        //     })
        //   }

        //   console.log("..ongoing token refresh?", store.state.ongoingTokenRefresh)
        //   await ensureNoRefreshTokenIsOngoing().catch(error => Promise.reject(error))

        //   // console.log(store.state.ongoingTokenRefresh)
        //   console.log("No ongoing token refresh found...")
        //   store.dispatch("tokenRefreshStarts")
        //   console.assert(store.state.ongoingTokenRefresh)

        //   console.log("CHECK IF EXPRIRED in ... refresh_token_if_required")
        //   const expired = Vue.prototype.pkce.isAccessTokenExpired()
        //   if (expired) {
        //     console.log("EXPRIRED in ... refresh_token_if_required")
        //     const response = await Vue.prototype.pkce.exchangeRefreshTokenForAccessToken()
        //       .then(response => {
        //         console.log(" finished: exchangeRefreshTokenForAccessToken")
        //         if (Vue.prototype.pkce.state && Vue.prototype.pkce.state.accessToken) {
        //           const jwt = Vue.prototype.pkce.state.accessToken.value
        //           console.log("new XHR header set", jwt)
        //           ApiService.setHeader(jwt)
        //         }
        //         LayoutEventBus.$emit('ReloadPayload')
        //         store.dispatch("tokenRefreshEnds")
        //         return true
        //       })
        //       .catch(error => {
        //         console.log('errord ;', error)
        //         // Promise.reject(error)
        //         store.dispatch("tokenRefreshEnds")
        //         Promise.reject(error)
        //       })
        //   }
        // },

        initialize: async function () {

          LayoutEventBus.$on('AfterLogout', data => {
            this.enforce_reactivity += 1
          })
          LayoutEventBus.$on('ReloadPayload', data => {
            this.enforce_reactivity += 1
          })

          const hasAuthCode = await Vue.prototype.pkce.isReturningFromAuthServer()
            .catch((potentialError) => {
              if (potentialError) {
                console.log(potentialError);
                Promise.reject(potentialError)
              }
              console.log("catch without potentialError?", potentialError)
            })

          const token = await Vue.prototype.pkce.getAccessToken()

          this.enforce_reactivity += 1

          // 1. One: technical stuff: replace token in axios
          // note: alteady authorized: but vue has not yet been notified. (no reactivity in properties of pkce module)
          // console.log("oAUTH: token received => emit AfterTokenChanged", token.value)
          LayoutEventBus.$emit('AfterTokenChanged', token.token.value)

          if (hasAuthCode) {
            LayoutEventBus.$emit('AfterLogin')
          }
        }
      }
    })
  }
}
