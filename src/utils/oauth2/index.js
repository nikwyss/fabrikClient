// import { boot } from 'quasar/wrappers';

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
    console.log('We will try to get a new access token via grant code or refresh token.')
    LayoutEventBus.$emit('ReloadPayload')

    return refreshAccessToken()
  },
  onInvalidGrant(refreshAuthCodeOrRefreshToken) {
    console.log('Expired! Auth code or refresh token needs to be renewed.')
    console.log('...Redirecting to auth server to obtain a new auth grant code.')
    LayoutEventBus.$emit('ReloadPayload')
    return refreshAuthCodeOrRefreshToken()
  }
}


export default {

  install(Vue, options) {

    /**
     * oAuth Server delivers user roles in the format "<role>@<assemblyIdentifier>".
     * THis method translates thes roles in a list of acls for the given Assembly.
     * => such as  ['delegate', 'contribute', 'observe']
     */
    const translate_auth_roles_to_acls = function (roles, assemblyIdentifier) {

      var assembly_roles = roles.filter(function (el) {
        return el.endsWith(`@${assemblyIdentifier}`);
      });
      var assembly_roles = assembly_roles.map(function (el) {
        return el.split('@')[0]
      });

      const assembly_acls = []
      if (assembly_roles.includes('administrator')) {
        assembly_acls.push('administrate', 'manage', 'observe')
      }
      if (assembly_roles.includes('manager')) {
        assembly_acls.push('manage', 'observe')
      }
      if (assembly_roles.includes('delegate')) {
        assembly_acls.push('delegate', 'contribute', 'observe')
      }
      if (assembly_roles.includes('contributor')) {
        assembly_acls.push('contribute', 'observe')
      }
      if (assembly_roles.includes('expert')) {
        assembly_acls.push('expert', 'observe')
      }

      // TODO: Are visitors welcome within this assembly???
      if (Vue.prototype.pkce.isAuthorized()) {
        assembly_acls.push('observe')
      }
      return (assembly_acls)
    }

    Vue.prototype.pkce = new OAuth2AuthCodePKCE(pkce_config)
    // Vue.prototype.enforce_reactivity = 1

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

        payload: function () {
          console.log('...OAUTH: loaeding payload..')
          if (!this.authorized || !('accessToken' in Vue.prototype.pkce.state)) {
            LayoutEventBus.$emit('AfterTokenChanged', null)
            // console.log('...OAUTH: not authorized')
            return (null)
          }

          // add xhr decorator
          const jwt = Vue.prototype.pkce.state.accessToken.value
          LayoutEventBus.$emit('AfterTokenChanged', jwt)
          // this.authorized = true
          // console.log('...OAUTH: jwt token is established')
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
        }
      },

      methods: {
        /**
         * Returns a list of all roles obtained by the authenticated user for the given assembly
         * @param {*} assemblyIdentifier 
         */
        acls: function (assemblyIdentifier) {
          if (!this.payload || !this.payload.roles) {
            return ([])
          }
          return (translate_auth_roles_to_acls(this.payload.roles, assemblyIdentifier))
        },


        /* Refresh token already before a invalid request has been issued */
        refresh_token_if_required: async function () {
          // console.log(this.payload.exp)
          if (Vue.prototype.pkce.isAuthorized()) {

            const expired = Vue.prototype.pkce.isAccessTokenExpired()
            // const tokendate = date.extractDate(`${this.payload.exp}`, 'X')
            // const expired = date.getDateDiff(new Date(), tokendate, 'seconds') > 0
            if (expired) {
              await Vue.prototype.pkce.exchangeRefreshTokenForAccessToken()
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

        // console.log("INI oAUTH2 Mixin")
        // INITIAL Data Loading
        Vue.prototype.pkce.isReturningFromAuthServer().then(hasAuthCode => {
          if (hasAuthCode) {
            // A valid Redirect by the auth server
            Vue.prototype.pkce.getAccessToken().then(({ token, scopes }) => {
              this.enforce_reactivity += 1
              // console.log('...OAUTH: token received and established, right!')
              LayoutEventBus.$emit('AfterAuthenticationStatusChanged')
              const destination_route = JSON.parse(localStorage.getItem('oauth2authcodepkce-destination'));
              localStorage.removeItem('oauth2authcodepkce-destination');
              LayoutEventBus.$emit('AfterLogin', destination_route)
            })
              .catch(error => {
                console.log("error in oauth plugin (1)..")
                // More errors to handle.
                console.error(error)
                LayoutEventBus.$emit('LoginError', error)
                Vue.prototype.logout()
              });
          }
        })
          .catch((error) => {
            console.log("error in oauth plugin (2)..")
            if (error) {
              LayoutEventBus.$emit('LoginError', error)
              console.error(error)
              Vue.prototype.logout()
            }
          })
      }
    })

    // Methods
    Vue.prototype.login = function (destination_route = null) {
      // save destiantion route to localstorage
      localStorage.setItem('oauth2authcodepkce-destination', JSON.stringify(destination_route));
      // redirect to login
      Vue.prototype.pkce.fetchAuthorizationCode()
    },

      Vue.prototype.logout = function () {
        Vue.prototype.pkce.reset();
        LayoutEventBus.$emit('AfterLogout')
        // LayoutEventBus.$emit('AfterAuthenticationStatusChanged')
      }
  }
}
