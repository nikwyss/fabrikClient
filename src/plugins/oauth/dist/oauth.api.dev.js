"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.oAuthService = void 0;

var _xhr = _interopRequireDefault(require("../../utils/xhr"));

var _popup = _interopRequireDefault(require("./popup"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Provides methods for oAuth2-related XHR calls.
 */
// interface oAuthServiceInstance {
//   redirectToProvider: (provider, randomState) => void,
//   authorizeByAuthenticationCode: (provider, authorizationCode) => Promise<unknown>,
//   tokenRegistration: (provider, accessToken) => Promise<string>,
//   tokenRefresh: (provider, refreshToken) => Promise<unknown>,
//   tokenRevoke: (provider, refreshToken) => Promise<boolean>,
//   tokenDecode: (jwt) => unknown
// }
var oAuthService = {
  /**
   * Redirect to oauth provider' authorization routine..
   * @param provider's name
   * redirects to authorize page...
   */
  redirectToProvider: function redirectToProvider(provider, randomState) {
    // TODO: retrieve settings by providername

    /* eslint-disable */
    var available_providers = process.env['VUE_APP_OAUTH_PROFILES'];
    console.assert(provider);
    console.assert(provider in available_providers);
    var configuration = available_providers[provider];
    /* eslint-enable */

    var clientId = configuration['VUE_APP_OAUTH_CLIENT_ID'];
    var baseUrl = configuration['VUE_APP_OAUTH_BASE_URL'];
    console.assert(clientId);
    console.assert(baseUrl); // http://localhost:8000/o/authorize/?client_id=3wtT6b469YwVKPSfenC3M6KNSw2WL70sCNEWAAWq&response_type=code&state=random_state_string

    var url = baseUrl + '/o/authorize/?client_id=' + clientId + '&response_type=code&state=' + randomState;
    console.assert(clientId);
    console.assert(baseUrl);

    if (clientId && baseUrl) {
      // window.open(url)
      _popup["default"].openpopup(url); // window.location.href = url

    }
  },

  /**
   * Authorize at oAuth Server (demokratiefabrik/fabrikAuth)
   * @param provider
   * @param authorizationCode
   * @returns {Promise<void>}
   */
  authorizeByAuthenticationCode: function authorizeByAuthenticationCode(provider, authorizationCode) {
    var configuration, clientId, baseUrl, redirectUri, url, data, formData, requestData, response;
    return regeneratorRuntime.async(function authorizeByAuthenticationCode$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.assert(authorizationCode); // console.log("START authorize method")
            // TODO: load vars conditional on provider...

            configuration = process.env['VUE_APP_OAUTH_PROFILES'][provider];
            clientId = configuration['VUE_APP_OAUTH_CLIENT_ID'];
            baseUrl = configuration['VUE_APP_OAUTH_BASE_URL'];
            console.assert(clientId);
            console.assert(baseUrl);
            redirectUri = "".concat(process.env.VUE_APP_DOMAIN).concat(process.env.VUE_APP_OAUTH_LOCAL_REDIRECTION_URI);
            url = baseUrl + '/o/token/';
            console.assert(clientId);
            console.assert(baseUrl);
            console.assert(redirectUri); // interface dataInterface {
            //   'grant_type',
            //   code,
            //   'client_id',
            //   'redirect_uri'
            // }

            data = {
              grant_type: 'authorization_code',
              code: authorizationCode,
              client_id: clientId,
              redirect_uri: redirectUri
            };
            formData = Object.keys(data).map(function (key) {
              return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');
            requestData = {
              method: 'POST',
              url: url,
              data: formData
            };
            _context.next = 16;
            return regeneratorRuntime.awrap(_xhr["default"].customRequest(requestData, {
              ReloginOnStatus403: false
            }));

          case 16:
            response = _context.sent;
            return _context.abrupt("return", response.data);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    });
  },

  /**
   * Registration at resource server (fabrikApi)
   * Convert access token to JWT:
   * It returns a JWT token. (access token becomes obsolete)
   * @param provider
   * @param accessToken
   * @returns {Promise<void>}
   */
  tokenRegistration: function tokenRegistration(provider, accessToken) {
    var expiration, data, api_base_url, url, formData, requestData, response;
    return regeneratorRuntime.async(function tokenRegistration$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            // console.log("api registration")
            console.assert(provider);
            console.assert(accessToken);
            console.assert(accessToken['access_token']);
            expiration = null;

            if ('exp' in accessToken) {
              expiration = accessToken['exp'];
            } else if ('expiration' in accessToken) {
              expiration = accessToken['expiration'];
            } // interface dataInterface {
            //   'access_token',
            //   provider,
            //   expiration
            // }


            data = {
              access_token: accessToken['access_token'],
              provider: provider,
              expiration: expiration
            };
            api_base_url = process.env.VUE_APP_APISERVER_URL;
            url = api_base_url + '/oauth';
            formData = Object.keys(data).map(function (key) {
              return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');
            requestData = {
              method: 'POST',
              url: url,
              data: formData
            };
            _context2.next = 12;
            return regeneratorRuntime.awrap(_xhr["default"].customRequest(requestData, {
              ReloginOnStatus403: false
            }));

          case 12:
            response = _context2.sent;
            console.assert(response.data);
            console.assert("jwt" in response.data);
            console.assert(response.data['jwt']); // console.log("finished api registration..")

            return _context2.abrupt("return", response.data['jwt']);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    });
  },

  /**
   * Refresh token routine:
   * try to re-issue an access_token by refresh token.
   * return True, if new accessToken is retrieved.
   * return False, if refresh token is invalid. => 400 Status code
   * @param provider
   * @param refreshToken
   * @returns {Promise<void>: accessToken}
   */
  tokenRefresh: function tokenRefresh(provider, refreshToken) {
    var configuration, clientId, baseUrl, url, data, formData, requestData, response;
    return regeneratorRuntime.async(function tokenRefresh$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.assert(refreshToken);
            console.assert(provider); // console.log("START refresh token")
            // TODO: load vars conditional on provider...

            configuration = process.env['VUE_APP_OAUTH_PROFILES'][provider];
            clientId = configuration['VUE_APP_OAUTH_CLIENT_ID'];
            baseUrl = configuration['VUE_APP_OAUTH_BASE_URL'];
            console.assert(clientId);
            console.assert(baseUrl);
            url = baseUrl + '/o/token/'; // interface dataInterface {
            //   'grant_type',
            //   'refresh_token',
            //   'client_id'
            // }

            data = {
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
              client_id: clientId
            };
            formData = Object.keys(data).map(function (key) {
              return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');
            requestData = {
              method: 'POST',
              url: url,
              data: formData,
              WithoutAuthHeader: true,
              Allow400Status: true
            };
            _context3.next = 13;
            return regeneratorRuntime.awrap(_xhr["default"].customRequest(requestData));

          case 13:
            response = _context3.sent;

            if (!(response.status == 200)) {
              _context3.next = 18;
              break;
            }

            return _context3.abrupt("return", response.data);

          case 18:
            return _context3.abrupt("return", null);

          case 19:
          case "end":
            return _context3.stop();
        }
      }
    });
  },

  /**
   * Revoke: disable refresh token...(i.e. logout action)
   * @param provider
   * @param refreshToken
   * @returns {Promise<void>: accessToken}
   */
  tokenRevoke: function tokenRevoke(provider, refreshToken) {
    var configuration, clientId, baseUrl, url, data, formData, requestData, response;
    return regeneratorRuntime.async(function tokenRevoke$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            // console.log("start revoke call")
            console.assert(provider);
            console.assert(refreshToken); // TODO: load vars conditional on provider...

            configuration = process.env['VUE_APP_OAUTH_PROFILES'][provider];
            clientId = configuration['VUE_APP_OAUTH_CLIENT_ID'];
            baseUrl = configuration['VUE_APP_OAUTH_BASE_URL'];
            console.assert(clientId);
            console.assert(baseUrl);
            url = baseUrl + '/o/revoke_token/'; // interface dataInterface {
            //   token,
            //   'token_type_hint',
            //   'client_id'
            // }

            data = {
              token: refreshToken,
              client_id: clientId,
              token_type_hint: 'refresh_token'
            };
            formData = Object.keys(data).map(function (key) {
              return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }).join('&');
            requestData = {
              method: 'POST',
              url: url,
              data: formData
            };
            _context4.next = 13;
            return regeneratorRuntime.awrap(_xhr["default"].customRequest(requestData, {
              ReloginOnStatus403: false,
              WithoutAuthHeader: true
            }));

          case 13:
            response = _context4.sent;
            return _context4.abrupt("return", response.status == 200);

          case 15:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  tokenDecode: function tokenDecode(jwt) {
    var token = {}; // token.header = JSON.parse(window.atob(t.split('.')[0]));

    token.payload = JSON.parse(window.atob(jwt.split('.')[1]));
    return token.payload;
  }
};
exports.oAuthService = oAuthService;