import('./polyfills')
const { OAuth2AuthCodePKCE } = require('@bity/oauth2-auth-code-pkce')
import { oAuthEventBus } from './eventbus'
import { mapActions } from "vuex";



export default {

  install(Vue, pkce_config) {

    Vue.prototype.pkce = new OAuth2AuthCodePKCE(pkce_config)

    Vue.prototype.login = function (destination_route = null) {
      // save destiantion route to localstorage
      localStorage.setItem('oauth2authcodepkce-destination', JSON.stringify(destination_route));
      Vue.prototype.pkce.fetchAuthorizationCode()
    }

    Vue.prototype.refresh_token = async function () {

      console.log("@@@ START TOKEN REFRESH")
      Vue.prototype.setOngoingTokenRefresh(true)
      try {
        await Vue.prototype.pkce.exchangeRefreshTokenForAccessToken()
      } catch (error) {
        console.log("Error while refreshing token #83", error)
      }
      // TOKEN REFRESH ENDS: Notify the computed properties
      const jwt = Vue.prototype.pkce.state.accessToken.value
      oAuthEventBus.$emit('TokenChanges', jwt)
      oAuthEventBus.$emit('AfterTokenChanged', jwt)
      Vue.prototype.setOngoingTokenRefresh(false)
      console.log("@@@ END WITH REFRESH")
    }

    // WAIT FOR ONGOING TOKEN REQUESTS! (wait maximal 5 seconds!)
    Vue.prototype.ensureNoRefreshTokenIsOngoing = async function () {
      let iter = 0
      return new Promise(function (resolve, reject) {
        (function waitForOngoingTokenRefresh() {
          if (!Vue.prototype.getOngoingTokenRefresh()) return resolve();
          iter++;
          if (iter >= 20) {
            console.log("(infinity loop)")
            Vue.prototype.setOngoingTokenRefresh(false)
            return reject("infinity loop");
          }
          console.log('.')
          setTimeout(waitForOngoingTokenRefresh, 300);
        })()
      })
    }

    Vue.prototype.getOngoingTokenRefresh = async function () {
      return Vue.prototype.pkce.state.ongoingTokenRefresh
    }

    Vue.prototype.setOngoingTokenRefresh = async function (value) {
      Vue.prototype.pkce.state.ongoingTokenRefresh = value
      console.log(" ongoing SHALL BE ", value)
    }

    // Component Mixin
    Vue.prototype.oauth = new Vue({

      data() {
        return {
          jwt: null
        }
      },

      computed: {

        authorized: function () {
          if (!this.jwt) {
            // THis should not be required, however, you never know;-)
            this.jwt = Vue.prototype.pkce?.state?.accessToken?.value
          }
          const authorized = this.jwt && Vue.prototype.pkce.isAuthorized()
          return (!!authorized)
        },

        ongoing: function () {
          // During oauth setup: if its not yet clear, if user is logged in (i.e. login process is ongoing)
          return (this.authorized === null || this.authorized === undefined)
        },

        payload: function () {
          if (!this.authorized) { return (null) }
          return JSON.parse(window.atob(this.jwt.split('.')[1]))
        },

        userid: function () {
          return this.payload?.sub
        }
      },

      methods: {
        ...mapActions({
          touchRandomSeed: "assemblystore/touchRandomSeed",
          storeOauthAcls: "publicprofilestore/storeOauthAcls"
        }),

        expiredJWT: function () {
          console.assert(this.payload?.exp)
          console.log("EXPIRES IN ", Math.round(this.payload.exp - (new Date().getTime() / 1000), 1) / 60, ' minutes.')
          return this.payload.exp < (new Date().getTime() / 1000 + 5)
        },

        /* Refresh token already before a invalid request has been issued */
        refresh_token_if_required: async function () {
          if (!Vue.prototype.pkce.isAuthorized()) {
            return true;
          }

          if (await this.expiredJWT()) {
            if (Vue.prototype.getOngoingTokenRefresh()) {
              await Vue.prototype.ensureNoRefreshTokenIsOngoing().catch(error => { return false })
            } else {
              Vue.prototype.setOngoingTokenRefresh(true)
            }
            if (this.expiredJWT()) {
              await Vue.prototype.refresh_token()
            }
            Vue.prototype.setOngoingTokenRefresh(false)
          }

          return true
        },

        async logout() {
          console.log("$$$ LOGOUT IN PLUGIN")
          Vue.prototype.pkce.reset();
          this.jwt = null
          oAuthEventBus.$emit('TokenChanges', null)
          oAuthEventBus.$emit('AfterTokenChanged', null)
          oAuthEventBus.$emit('AfterLogout')
        },


        initialize: async function () {

          // During Startup
          oAuthEventBus.$on('TokenChanges', jwt => {
            this.jwt = jwt
            // const refresh = Vue.prototype.pkce.state.refreshToken.value
            // console.log("............NEW NEW REFRESH TOKEN: ", !!refresh, refresh.substring(refresh.length - 5))
          })

          const hasAuthCode = await Vue.prototype.pkce.isReturningFromAuthServer()
            .catch((potentialError) => {
              if (potentialError) {
                console.log(potentialError, "#4385");
                Promise.reject(potentialError)
              }
              console.log("catch without potentialError?", potentialError)
            })

          // const token = Vue.prototype.pkce.isAuthorized() ? await Vue.prototype.pkce.getAccessToken() : null

          let token = null
          try {
            token = await Vue.prototype.pkce.getAccessToken()
            token = token?.token?.value
          } catch (error) {
            console.log("Not logged in, right?", error)
          }

          oAuthEventBus.$emit('TokenChanges', token)
          oAuthEventBus.$emit('AfterTokenChanged', token)
          if (hasAuthCode) {
            oAuthEventBus.$emit('AfterLogin')
          }

          // DEBUG
          // this.expiredJWT()
        }
      }
    })
  }
}
