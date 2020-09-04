"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _oauth = _interopRequireDefault(require("./oauth.main"));

var _eventbus = require("src/layouts/components/eventbus.js");

var _oauth2 = require("./oauth.api");

var _xhr = require("../../utils/xhr");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
This does initiate a oauth2 session and stores it in Vue.$session
// TODO: Significant rewriting necessary: => i.e. use EventBus
*/
console.log('Installing the Oauth Plugin!');
var _default = {
  install: function install(Vue, opts) {
    // add the session instance as Vue property (non-reactive)
    var session = new _oauth["default"]();
    Vue.prototype.$session = session; // Add a reactive "authenticated" variable to the Vue.$root:
    // and initialize the session.

    Vue.mixin({
      data: function data() {
        return {
          authenticated: undefined,
          username: undefined,
          userid: undefined
        };
      },
      methods: {
        /**
        * oauth_callback  is normally called at the end of an oauth ajax request.
        */
        oauth_callback: function oauth_callback() {
          console.log("CALL BACK");
          this.$root.authenticated = this.$session.authenticated(); // decode session

          if (this.$session._jwt) {
            var token = _oauth2.oAuthService.tokenDecode(this.$session._jwt);

            this.$root.username = token['userName'];
            this.$root.userid = token['sub'];
          } else {
            this.$root.username = null;
            this.$root.userid = 0;
          }
        },

        /**
        * oauth_callback  push notification to opener window
        * is normally called after login routine in popup window (Necessary since Vue-responsivity is flawed)
        */
        forceVueUpdateOfOpener: function forceVueUpdateOfOpener() {
          console.log("Try TO UPDATE OPENER");
          console.log(window);
          window.opener.forceVueUpdate();
        },
        forceVueUpdate: function forceVueUpdate() {
          console.log("Vue Update after authentication");
          var protected_url = this.$session.protected_url;

          if (this.$session.protected_url) {
            console.log("Redirect to protected_url in temp");
            this.$session.protected_url = null;
            window.location.href = protected_url;
          } else {
            window.location.reload();
          } // hard refresh really necessary????
          // for updating reactive fields???
          // console.log("UPPPDAAATED")
          // // this.$session._jwt = null
          // console.log("UPPPDAAATED:  " + this.$session.jwt)
          // this.$session.initialize(this)
          //           this.oauth_callback()
          // this.$forceUpdate() // does not work. Useless?          

        },
        onAxiosReject: function onAxiosReject(error) {
          var _this = this;

          // enfoce that ApiService Wrapper is used, (and not pure Axios)
          console.log("XHR ERROR");

          _xhr.ApiService.is_api_service_used_as_axios_wrapper(error.config); // No remote connection established


          if (!error.response) {
            var msg_title = 'Network Error';
            var msg_body = 'We could not make a connection to the service provider. Please try again!'; // this._flash.show({ status: 'error', title: msg_title, message: msg_body })

            console.log("Network error");
            console.warn(`${msg_title} ${msg_body}`);

            _eventbus.LayoutEventBus.$emit('showServiceError');

            return false;
          } else if (error.response.status == 400) {
            // 400 errors (parse errors)
            if ((0, _xhr.Allow400Status)(error.config)) {
              // dont raise 400 errors, if this is made explicit
              // console.log("AXIOS: Pass Error 400")
              return true;
            }
          } else if (error.response.status == 403) {
            // 403 errors
            if ((0, _xhr.ReloginOnStatus403)(error.config)) {
              console.log("AXIOS: ReloginOnStatus403"); // at 403: try to (re)establish authentication, if not explicitly denied..

              if (this.$session.refresh_token && !error.config.retry) {
                // Not too bad: only a token refresh might fix this.
                // Hence, we specify the token refresh function and th status 449 ("retry with")
                console.log("try to refresh token and then relaunch xhr (2)");
                error.response.status = 449;
                error.config.retoken = this.$root.retrieve_refreshed_token;
                error.config.retry = true;
                return error.config;
              } // There seems to be a need for a complete (re)login.
              // retoken is not possible anymore (due to logout / or session expiration?)


              console.log('cannot access refresh token');
              var customactions = [{
                label: 'Homepage',
                color: 'white',
                handler: function handler() {
                  _this.$router.push('/');
                }
              }];

              if (this.$root.authenticated) {
                _eventbus.LayoutEventBus.$emit('showAuthorizationError');
              } else {
                _eventbus.LayoutEventBus.$emit('showAuthenticationWarning');
              }

              return false;
            }
          } // All other errors:


          console.log("Unknown oauth request error");

          _eventbus.LayoutEventBus.$emit('showServiceError');

          return Promise.reject(error);
        },

        /**
         * Refresh token routine: MAIN
         * @returns {Promise<void>}
         */
        retrieve_refreshed_token: function retrieve_refreshed_token() {
          var accessToken, success;
          return regeneratorRuntime.async(function retrieve_refreshed_token$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  console.log("START refresh token handling"); // VALIDATE DATA
                  // re-read cookie values
                  // TODO: dont know why I have to doo this...

                  console.assert(this.$session.refresh_token);
                  console.assert(this.$session.provider); // empty jwt

                  this.jwt = null; // Re-issue a token
                  // try to re-issue an access_token by refresh token.

                  _context.next = 6;
                  return regeneratorRuntime.awrap(_oauth2.oAuthService.tokenRefresh(this.$session.provider, this.$session.refresh_token));

                case 6:
                  accessToken = _context.sent;

                  if (accessToken) {
                    _context.next = 10;
                    break;
                  }

                  // console.log("auth session invalid: reset and redirect to login..")
                  // let msg_title = 'Session Timeout'
                  // let msg_body = 'We could not continue your last login session. Please login again!'
                  // this._flash.show({ status: 'warning', title: msg_title, message: msg_body })
                  this.$session.reset_everything();
                  return _context.abrupt("return", false);

                case 10:
                  _context.next = 12;
                  return regeneratorRuntime.awrap(this.$session._finalize_authentication_by_access_token(this.$session.provider, accessToken));

                case 12:
                  success = _context.sent;
                  console.assert(success);
                  return _context.abrupt("return", true);

                case 15:
                case "end":
                  return _context.stop();
              }
            }
          }, null, this);
        }
      },
      mounted: function mounted() {
        // add only to root object
        if (this.$root == this) {
          console.log("Added onAxiosReject Event Listener"); // this.extend(onAxiosReject)
          // TODO: put this in root Vue or in helper (this is not only oauth specific)

          _xhr.ApiService.mountAxiosInterceptor(this.onAxiosReject);

          console.log("INITIAILIZE");
          this.$session.initialize(this);
          console.log("END MOUNT"); // Force update Vue
          // TODO: not used, right? (have once be used after authentication...)

          console.log("VueUpdate");
          window.forceVueUpdate = this.forceVueUpdate;
        }
      }
    });
  }
};
exports["default"] = _default;