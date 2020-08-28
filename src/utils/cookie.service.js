import Cookies from 'js-cookie'

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
  // let domain = process.env.VUE_APP_DOMAIN.replace(/(^\w+:|^)\/\//, '');

  const options = {
    // domain: domain,
    sameSite: 'lax'
  }

  if (durable) {
    // console.log(process.env.VUE_APP_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS)
    options.expires = parseInt(process.env.VUE_APP_OAUTH_REFRESH_TOKEN_EXPIRATION_DAYS)
  }
  
  if (value) {

    // console.log("cookie updated" + name + " :" + value + " ( durable: " + durable + ")")
    Cookies.set(name, value, options) // // jwt token (in secured cookies)

  } else {
    // console.log("cookie removed " + name)
    Cookies.remove(name, options) // // jwt token (in secured cookies)
  }
}
