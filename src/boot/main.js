import Vue from 'vue'

// APP CONSTANTS
/////////////////////////////////
import { runtimeStore } from "src/store/runtime.store"
import Constants from 'src/utils/constants'
Vue.prototype.Constants = Constants

// SANITIZER
/////////////////////////////////
import VueDOMPurifyHTML from 'vue-dompurify-html'
Vue.use(VueDOMPurifyHTML, {
  namedConfigurations: {
    'alink': {
      ADD_ATTR: ['target'],
    }
  }
})


// GLOBAL METHODS
/////////////////////////////////

// Add Object filter: helper...
// TODO: remove this. not necessary, since [].filter() does work perfectly...
Object.filter = (obj, predicate) => Object.keys(obj)
  .filter(key => predicate(obj[key]))
  .reduce((res, key) => (res[key] = obj[key], res), {});

/* Returns length of a object/list, while handling null as 0. 
TODO: same as object?.length rigth?
*/
Vue.prototype.$nLength = function (object1) {
  if (object1 === null) {
    return (0)
  }
  return (object1.length)
}
Vue.prototype.$unloaded = function (object1) {
  return object1 === null || object1 === undefined
}


// AUTH
/////////////////////////////////
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
    console.log('Expired! Access token needs to be renewed. (onAccessTokenExpiry)')
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
import VueOAuth2PKCE from 'src/utils/VueOAuth2PKCE'
Vue.use(VueOAuth2PKCE, pkce_config)


// CUSTOMMIZATION QUASAR COMPONENTS
//////////////////////////////////
import { Notify } from 'quasar'
Notify.registerType('nFabrikInfo', {
  icon: 'mdi-announcement',
  color: 'brown',
  textColor: 'white',
  classes: 'glossy'
})

Notify.registerType('nFabrikError', {
  icon: 'mdi-error',
  color: 'red',
  textColor: 'white',
  classes: 'glossy'
})