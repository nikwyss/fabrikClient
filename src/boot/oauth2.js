// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OAuth2AuthCodePKCE} = require('@bity/oauth2-auth-code-pkce')
// require @bity/oauth2-auth-code-pkce
import Configuration from 'src/utils/configuration'
import { ApiService, ReloginOnStatus403} from 'src/utils/xhr'
import { LayoutEventBus } from 'src/utils/eventbus.js'

// var clientId = Configuration.value('ENV_OAUTH_CLIENT_ID')
var baseUrl = Configuration.value('ENV_OAUTH_BASE_URL')
var app_domain = Configuration.value('ENV_DOMAIN')
var oauthUrl = Configuration.value('ENV_OAUTH_LOCAL_REDIRECTION_URI')


const pkce = new OAuth2AuthCodePKCE({
  authorizationUrl: baseUrl + '/o/authorize/',
  tokenUrl: baseUrl + '/o/token/',
  clientId: Configuration.value('ENV_OAUTH_CLIENT_ID'),
  scopes: ['read'], // TODO
  redirectUrl: `${app_domain}${oauthUrl}`,

  onAccessTokenExpiry (refreshAccessToken) {
    console.log('Expired! Access token needs to be renewed.')
    console.log('We will try to get a new access token via grant code or refresh token.')
    return refreshAccessToken()
  },

  onInvalidGrant (refreshAuthCodeOrRefreshToken) {
    console.log('Expired! Auth code or refresh token needs to be renewed.')
    console.log('...Redirecting to auth server to obtain a new auth grant code.')
    return refreshAuthCodeOrRefreshToken()
  }
})

export default ({ Vue }) => {


  Vue.prototype.oauth = new Vue({

    data: function() {
        return {
          // authorized: false,
          pkce: pkce,
          enforce_reactivity: 1
        }
    },


    computed: {

      authorized: function(){
        // enforce_reactivity: changing enforce_reactivity allows onthefly modifications of oauth data (username, logoin  status)  
        // just change this property, and all computed data is reloaded...
        const authorized =  this.enforce_reactivity > 0 && this.pkce.state && this.pkce.state.accessToken && this.pkce.state.accessToken.value && this.pkce.isAuthorized()
        console.log(`...OAUTH: authorized: ${authorized}`)
        return (authorized)
      } ,


      payload: function(){
        console.log("...OAUTH: loaeding payload..")
        // || !this.oauth.state || !oauth.state.accessToken || !this.oauth.state.accessToken.value
        if (!this.authorized) {
          ApiService.removeHeader()
          console.log("...OAUTH: not authorized")
          return (null)
        }

        // add xhr decorator
        const jwt = this.pkce.state.accessToken.value
        ApiService.setHeader(jwt)
        // this.authorized = true
        console.log("...OAUTH: jwt token is established")
        return(JSON.parse(window.atob(jwt.split('.')[1])));
      },  

      username: function(){
        console.log("...OAUTH: loading username..")
        if (this.payload) {
          console.log(`   username: ${this.payload.userName}`)
          return(this.payload.userName)
        }else{
          console.log(`   username: null`)
        }
      },

      userid: function(){
        console.log("...OAUTH: loading userid..")
        if (this.payload) {
          return(this.payload.sub)
        }
      }
    },

    methods: {

      login: function(destination_route=null) {
        // save destiantion route to localstorage
        localStorage.setItem('oauth2authcodepkce-destination', JSON.stringify(destination_route));
        // redirect to login
        this.pkce.fetchAuthorizationCode()
      },

      logout: function() {
        pkce.reset();
        LayoutEventBus.$emit('AfterAuthenticationStatusChanged')
        LayoutEventBus.$emit('AfterLogout')
      },
      
      acls: function(assemblyIdentifier){

        // console.log(this.payload);

        /* Returns a list of all roles obtained by the authenticated user for the given assembly */
        // assembly_acls: (state) => (assemblyIdentifier) => {
        // console.log("CHECK ACLs for current assembly...........")
        if (!this.payload || !this.payload.roles) {
          return([])
        }

        var assembly_roles = this.payload.roles.filter(function (el) {
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
          assembly_acls.push('contribute', 'observe')
        }
        if (this.oauth.authorized) {
          assembly_acls.push('observe')
        }
        return (assembly_acls)
      }
    },

    
    created: function() {

      // INITIAL Data Loading
      this.pkce.isReturningFromAuthServer().then(hasAuthCode => {
        if (hasAuthCode) { 
          // A valid Redirect by the auth server
          this.pkce.getAccessToken().then(({ token, scopes }) => {
            this.enforce_reactivity += 1
            console.log("...OAUTH: token received and established, right!")
            LayoutEventBus.$emit('AfterAuthenticationStatusChanged')
            const destination_route = JSON.parse(localStorage.getItem('oauth2authcodepkce-destination'));
            localStorage.removeItem('oauth2authcodepkce-destination');
            LayoutEventBus.$emit('AfterLogin', destination_route)
          })
          .catch(error => {
            // More errors to handle.
            console.error(error)      
          });
        }
      })
      .catch((potentialError) => {
        // if (potentialError) { console.error(potentialError)}
      })
    }
  })

  // install axios Interceptor to for all errors and invalid tokens
  ApiService.mountAxiosInterceptor(onAxiosReject)
}




async function onAxiosReject(error) {
  // onAxiosReject = async function (error) {
  // enfoce that ApiService Wrapper is used, (and not pure Axios)
  console.log("XHR ERROR")
  ApiService.is_api_service_used_as_axios_wrapper(error.config)

  // No remote connection established
  if (!error.response) {
    console.log("Network error")
    LayoutEventBus.$emit('showNetworkError')
    return Promise.reject(error)

  } else if (error.response.status == 400) {
    // 400 errors (parse errors)
    console.log("400 Error")
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
    console.log("403 Error")

    if (ReloginOnStatus403(error.config)) {
      console.log("AXIOS: ReloginOnStatus403")

      // Not too bad: only a token refresh might fix this.
      // Hence, we specify the token refresh function and th status 449 ("retry with")
      console.log("try to refresh token and relaunch XHR")
      error.response.status = 449
      if (pkce.isAuthorized()) {

        try {
          await pkce.exchangeRefreshTokenForAccessToken()
          const jwt = pkce.state.accessToken.value
          ApiService.setHeader(jwt)
          error.config.retoken = true
          // Token should now be up to date!
          return (error.config)

        }catch (error){

          // Unsuccessful Refresh:-(
            if (pkce.isAuthorized()) {
              LayoutEventBus.$emit('showAuthorizationError')
            }else{
              LayoutEventBus.$emit('showAuthenticationWarning')
            }

            console.log('permission/authorization error')
            console.log(error)
            return Promise.reject(error)
          }
      } else {
        LayoutEventBus.$emit('showAuthenticationWarning')
        console.log("Oauth Permission request error")
        return Promise.reject(error)
      }
    }
  }

  // All other errors:
  console.log("Unknown oauth request error")
  console.log("status: " + error.response.status)
  LayoutEventBus.$emit('showServiceError')

  return Promise.reject(error)
}
