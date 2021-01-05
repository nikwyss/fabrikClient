import Cookies from 'js-cookie'
import Configuration from 'src/utils/configuration'
// TODO: replace by vue-cookie ???


// TODO: https://github.com/js-cookie/js-cookie => use domain -specific cookies, samesite, secure..
const nonull = function (val) {
  if (val === undefined || val === 'null' || val === '' || val === {}) {
    return (null)
  }

  return (val)
}

export const get_cookie_value = function(name) {
  return (nonull(Cookies.get(name)))
}

// TODO: how secure is it to store refresh token within such cookies?
// that we canno use the HTTPonly flag.
export const set_cookie_value = function (name, value, durable=false) {
  // TODO: DO we have to specify the domain?
  // get domain without protocol
  // let domain = Configure.value('DOMAIN').replace(/(^\w+:|^)\/\//, '');

  const options = {
    // domain: Configuration.value('ENV_DOMAIN'), (Default is okay...)
    sameSite: 'lax'
    // httpOnly: true, // not possible to read cookies by js 
    // secure: true 
  }

  if (durable) {
    options.expires = parseInt(Configuration.value('ENV_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS'))
  }
  
  if (value) {

    // console.log("cookie updated" + name + " :" + value + " ( durable: " + durable + ")")
    Cookies.set(name, value, options) // // jwt token (in secured cookies)

  } else {
    // console.log("cookie removed " + name)
    Cookies.remove(name, options) // // jwt token (in secured cookies)
  }
}
