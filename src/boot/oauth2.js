// eslint-disable-next-line @typescript-eslint/no-var-requires
const { OAuth2AuthCodePKCE } = require('@bity/oauth2-auth-code-pkce')
// require @bity/oauth2-auth-code-pkce

export default ({ Vue }) => {

  const oauth = new OAuth2AuthCodePKCE({
    // extraAuthorizationParams: {
    //   'test': '1',
    //   'hello': 'world'
    // },
    authorizationUrl: 'http://localhost:8010/o/authorize/',
    tokenUrl: 'http://localhost:8010/o/token/',
    clientId: 'xF6n5vYaxCp3GJXDkKBFgHJlY25Z3U4MmT3N2Grk',
    scopes: ['read'],
    redirectUrl: 'http://localhost:8080/authorization',

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

  oauth.isReturningFromAuthServer().then(hasAuthCode => {
    if (!hasAuthCode) { console.log('Something wrong...no auth code.'); }
    return oauth.getAccessToken().then((token) => console.log(token));
  })
    .catch((potentialError) => {
      if (potentialError) { console.log(potentialError)}
    })

  // make globally available...
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.prototype.$oauth = oauth
}
