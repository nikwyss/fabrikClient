"use strict";
/*
This does initiate a oauth2 session and stores it in Vue.$session
// TODO: Significant rewriting necessary: => i.e. use EventBus
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var oauth_main_1 = require("./oauth.main");
var eventbus_js_1 = require("src/layouts/components/eventbus.js");
var oauth_api_1 = require("./oauth.api");
var xhr_1 = require("../../utils/xhr");
var xhr_2 = require("../../utils/xhr");
console.log('Installing the Oauth Plugin!');
exports["default"] = {
    install: function (Vue, opts) {
        // add the session instance as Vue property (non-reactive)
        var session = new oauth_main_1["default"]();
        Vue.prototype.$session = session;
        // Add a reactive "authenticated" variable to the Vue.$root:
        // and initialize the session.
        Vue.mixin({
            data: function () {
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
                oauth_callback: function () {
                    console.log("CALL BACK");
                    this.$root.authenticated = this.$session.authenticated();
                    // decode session
                    if (this.$session._jwt) {
                        var token = oauth_api_1.oAuthService.tokenDecode(this.$session._jwt);
                        this.$root.username = token['userName'];
                        this.$root.userid = token['sub'];
                    }
                    else {
                        this.$root.username = null;
                        this.$root.userid = 0;
                    }
                },
                /**
                * oauth_callback  push notification to opener window
                * is normally called after login routine in popup window (Necessary since Vue-responsivity is flawed)
                */
                forceVueUpdateOfOpener: function () {
                    console.log("Try TO UPDATE OPENER");
                    console.log(window);
                    window.opener.forceVueUpdate();
                },
                forceVueUpdate: function () {
                    console.log("Vue Update after authentication");
                    var protected_url = this.$session.protected_url;
                    if (this.$session.protected_url) {
                        console.log("Redirect to protected_url in temp");
                        this.$session.protected_url = null;
                        window.location.href = protected_url;
                    }
                    else {
                        window.location.reload();
                    }
                    // hard refresh really necessary????
                    // for updating reactive fields???
                    // console.log("UPPPDAAATED")
                    // // this.$session._jwt = null
                    // console.log("UPPPDAAATED:  " + this.$session.jwt)
                    // this.$session.initialize(this)
                    //           this.oauth_callback()
                    // this.$forceUpdate() // does not work. Useless?          
                    // // change key of root element to enforce refresh of all components.
                    // console.log(this.$root.key)
                    // this.$root.key='kkk'
                    // this.$root.key='ddd'
                    // console.log("AHA:  " + this.$root.authenticated)
                    // this.set(this.$root, 'authenticated', this.$root.authenticated)
                    // console.log(this.$root.authenticated)
                },
                onAxiosReject: function (error) {
                    var _this = this;
                    // enfoce that ApiService Wrapper is used, (and not pure Axios)
                    console.log("XHR ERROR");
                    xhr_1.ApiService.is_api_service_used_as_axios_wrapper(error.config);
                    // No remote connection established
                    if (!error.response) {
                        var msg_title = 'Network Error';
                        var msg_body = 'We could not make a connection to the service provider. Please try again!';
                        // this._flash.show({ status: 'error', title: msg_title, message: msg_body })
                        console.log("Network error");
                        console.warn(msg_title + ' ' + msg_body);
                        eventbus_js_1.LayoutEventBus.$emit('showServiceError');
                        return (false);
                    }
                    else if (error.response.status == 400) {
                        // 400 errors (parse errors)
                        if (xhr_2.Allow400Status(error.config)) {
                            // dont raise 400 errors, if this is made explicit
                            // console.log("AXIOS: Pass Error 400")
                            return (true);
                        }
                    }
                    else if (error.response.status == 403) {
                        // 403 errors
                        if (xhr_2.ReloginOnStatus403(error.config)) {
                            console.log("AXIOS: ReloginOnStatus403");
                            // at 403: try to (re)establish authentication, if not explicitly denied..
                            if (this.$session.refresh_token && !error.config.retry) {
                                // Not too bad: only a token refresh might fix this.
                                // Hence, we specify the token refresh function and th status 449 ("retry with")
                                console.log("try to refresh token and then relaunch xhr (2)");
                                error.response.status = 449;
                                error.config.retoken = this.$root.retrieve_refreshed_token;
                                error.config.retry = true;
                                return (error.config);
                            }
                            // There seems to be a need for a complete (re)login.
                            // retoken is not possible anymore (due to logout / or session expiration?)
                            console.log('cannot access refresh token');
                            var customactions = [
                                { label: 'Homepage', color: 'white', handler: function () { _this.$router.push('/'); } }
                            ];
                            if (this.$root.authenticated) {
                                eventbus_js_1.LayoutEventBus.$emit('showAuthorizationError');
                            }
                            else {
                                eventbus_js_1.LayoutEventBus.$emit('showAuthenticationWarning');
                            }
                            return (false);
                        }
                    }
                    // All other errors:
                    console.log("Unknown oauth request error");
                    eventbus_js_1.LayoutEventBus.$emit('showServiceError');
                    return Promise.reject(error);
                },
                /**
                 * Refresh token routine: MAIN
                 * @returns {Promise<void>}
                 */
                retrieve_refreshed_token: function () {
                    return __awaiter(this, void 0, void 0, function () {
                        var accessToken, success;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    console.log("START refresh token handling");
                                    // VALIDATE DATA
                                    // re-read cookie values
                                    // TODO: dont know why I have to doo this...
                                    console.assert(this.$session.refresh_token);
                                    console.assert(this.$session.provider);
                                    // empty jwt
                                    this.jwt = null;
                                    return [4 /*yield*/, oauth_api_1.oAuthService.tokenRefresh(this.$session.provider, this.$session.refresh_token)];
                                case 1:
                                    accessToken = _a.sent();
                                    if (!accessToken) {
                                        // console.log("auth session invalid: reset and redirect to login..")
                                        // let msg_title = 'Session Timeout'
                                        // let msg_body = 'We could not continue your last login session. Please login again!'
                                        // this._flash.show({ status: 'warning', title: msg_title, message: msg_body })
                                        this.$session.reset_everything();
                                        return [2 /*return*/, (false)];
                                    }
                                    return [4 /*yield*/, this.$session._finalize_authentication_by_access_token(this.$session.provider, accessToken)];
                                case 2:
                                    success = _a.sent();
                                    console.assert(success);
                                    return [2 /*return*/, (true)];
                            }
                        });
                    });
                }
            },
            mounted: function () {
                // add only to root object
                if (this.$root == this) {
                    console.log("Added onAxiosReject Event Listener");
                    // this.extend(onAxiosReject)
                    // TODO: put this in root Vue or in helper (this is not only oauth specific)
                    xhr_1.ApiService.mountAxiosInterceptor(this.onAxiosReject);
                    console.log("INITIAILIZE");
                    this.$session.initialize(this);
                    console.log("END MOUNT");
                    // Force update Vue
                    // TODO: not used, right? (have once be used after authentication...)
                    window.forceVueUpdate = this.forceVueUpdate;
                }
            }
        });
    }
};
