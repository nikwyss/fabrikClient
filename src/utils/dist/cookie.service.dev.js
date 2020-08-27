"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set_cookie_value = exports.get_cookie_value = void 0;

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var nonull = function nonull(val) {
  if (val === undefined || val == 'null' || val == '' || val == {}) {
    return null;
  }

  return val;
};

var get_cookie_value = function get_cookie_value(name) {
  return nonull(_jsCookie["default"].get(name));
}; // TODO: how secure is it to store refresh token within such cookies? 
// that we canno use the HTTPonly flag. 


exports.get_cookie_value = get_cookie_value;

var set_cookie_value = function set_cookie_value(name, value) {
  var durable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  // TODO: DO we have to specify the domain?
  // get domain without protocol
  // let domain = process.env.VUE_APP_DOMAIN.replace(/(^\w+:|^)\/\//, '');
  var options = {
    // domain: domain,
    sameSite: 'lax'
  };

  if (durable) {
    // console.log(process.env.VUE_APP_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS)
    options.expires = parseInt(process.env.VUE_APP_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS);
  }

  if (value) {
    // console.log("cookie updated" + name + " :" + value + " ( durable: " + durable + ")")
    _jsCookie["default"].set(name, value, options); // // jwt token (in secured cookies)

  } else {
    // console.log("cookie removed " + name)
    _jsCookie["default"].remove(name, options); // // jwt token (in secured cookies)

  }
};

exports.set_cookie_value = set_cookie_value;