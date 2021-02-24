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
      const { webcrypto } = require('webcrypto-shim')
    }
    if (typeof window.fetch === 'undefined') {
      const { fetch } = require('whatwg-fetch')
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
      throw new Error("ErrorInvalidGrant");
    } else {
      // TOKEN Failed. However, user is up to leave the page. (so ignore it...)
      Promise.resolve()
    }
  }
}

// WAIT FOR ONGOING TOKEN REQUESTS! (wait maximal 5 seconds!)
const ensureNoRefreshTokenIsOngoing = async function () {
  const maxiter = 20
  let iter = 0
  return new Promise(function (resolve, reject) {
    (function waitForOngoingTokenRefresh() {
      if (store.state.ongoingTokenRefresh !== true) return resolve();
      iter++;
      if (iter >= maxiter) {
        console.log("(infinity loop)")
        store.dispatch("tokenRefreshEnds")
        return reject("infinity loop");
      }
      console.log('.')
      setTimeout(waitForOngoingTokenRefresh, 300);
    })()
  })
}

export default {

  install(Vue, options) {

    Vue.prototype.pkce = new OAuth2AuthCodePKCE(pkce_config)

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
      LayoutEventBus.$emit('AfterTokenChanged', null)
      LayoutEventBus.$emit('LoginStatusUpdate', null)
      LayoutEventBus.$emit('AfterLogout')
    }

    Vue.prototype.refresh_token = async function () {

      console.log("@@@ START TOKEN REFRESH")
      await store.dispatch("tokenRefreshStarts")
      try {
        await Vue.prototype.pkce.exchangeRefreshTokenForAccessToken()
      } catch (error) {
        console.log("Error while refreshing token #83", error)
      }
      // TOKEN REFRESH ENDS: Notify the computed properties
      await store.dispatch("tokenRefreshEnds")
      const jwt = Vue.prototype.pkce.state.accessToken.value
      LayoutEventBus.$emit('AfterTokenChanged', jwt)
      LayoutEventBus.$emit('LoginStatusUpdate', jwt)
      console.log("@@@ END WITH REFRESH")
    }

    // Component Mixin
    Vue.prototype.oauth = new Vue({

      data: function () {
        return {
          jwt: null
        }
      },

      computed: {

        authorized: function () {
          // enforce_reactivity: changing enforce_reactivity allows onthefly modifications of oauth data (username, logoin  status)  
          // just change this property, and all computed data is reloaded...
          // if (this.enforce_reactivity < 0) { return; }

          if (!this.jwt) {
            // THis should not be required, however, you never know;-)
            this.jwt = Vue.prototype.pkce?.state?.accessToken?.value
          }

          const authorized = this.jwt && Vue.prototype.pkce.isAuthorized()
          return (authorized)
        },

        ongoing: function () {
          // if (this.enforce_reactivity < 0) { return; }

          // Its not yet clear, if user is logged in (i.e. login process is ongoing)
          return (this.authorized === null || this.authorized === undefined)
        },

        payload: function () {
          // if (this.enforce_reactivity < 0) { return; }
          // console.log('...OAUTH: loaeding payload..')

          if (!this.authorized) {
            return (null)
          }

          // add xhr decorator
          console.assert(this.jwt)
          const payload = JSON.parse(window.atob(this.jwt.split('.')[1]))

          // console.log(payload)
          return (payload);
        },

        username: function () {
          // if (this.enforce_reactivity < 0) { return; }

          if (this.payload) {
            return (this.payload.userName)
          }
        },

        userid: function () {
          // if (this.enforce_reactivity < 0) { return; }

          // console.log('...OAUTH: loading userid..')
          if (this.payload) {
            return (this.payload.sub)
          }
        },

        incompleteProfile: function () {
          // if (this.enforce_reactivity < 0) { return; }

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
          if (Vue.prototype.pkce.isAuthorized()) {

            console.log("@@@ START REFRESH IF REQUIRED")
            if (await Vue.prototype.pkce.isAccessTokenExpired()) {
              console.log("..already ongoing token refresh?", store.state.ongoingTokenRefresh)
              if (store.state.ongoingTokenRefresh) {
                await ensureNoRefreshTokenIsOngoing().catch(error => Promise.reject(error))
              } else {
                store.dispatch("tokenRefreshStarts")
              }
              if (await Vue.prototype.pkce.isAccessTokenExpired()) {
                await Vue.prototype.refresh_token()
              }
              store.dispatch("tokenRefreshEnds")
            }
            console.log("@@@ END WITH REFRESH IF REQUIRED")
          }
          return true
        },


        initialize: async function () {

          LayoutEventBus.$on('AfterTokenChanged', jwt => {
            this.jwt = jwt
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

          // this.enforce_reactivity += 1
          // this.jwt = Vue.prototype.pkce?.state?.accessToken?.value

          // 1. One: technical stuff: replace token in axios and in Vue.oauth.jwt
          // note: alteady authorized: but vue has not yet been notified. (no reactivity in properties of pkce module)
          LayoutEventBus.$emit('AfterTokenChanged', token.token.value)
          // 2. Update permissions 
          LayoutEventBus.$emit('LoginStatusUpdate', token.token.value)

          if (hasAuthCode) {
            LayoutEventBus.$emit('AfterLogin')
          }
        }
      }
    })
  }
}

/**
 * AfterTokenChanged
 * => after each token change
 * => store token everywhere => xhr header / payload
 * LoginStatusUpdate
 * => after each token change
 * => update permission /
 * AfterLogin
 * => only after login
*/
