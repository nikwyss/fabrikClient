// ADD POLYFILL FOR IE11 SUPPORT
import "@babel/polyfill"

// everything else..
import { date } from 'quasar'
import Vue from 'vue'
import oAuth2 from 'src/utils/oauth2'
import Constants from 'src/utils/constants'
const { getDateDiff, formatDate } = date


// APP CONSTANTS
/////////////////////////////////
Vue.prototype.Constants = Constants

// GLOBAL METHODS
/////////////////////////////////

// Methods
/* Returns length of a object/list, while handling null as 0. 
TODO: put this to window.object? */
Vue.prototype.$currentRouteObject = function ($router) {
  return ({ name: $router.currentRoute.name, params: $router.currentRoute.params })
}

Vue.prototype.$nLength = function (object1) {
  if (object1 === null) {
    return (0)
  }
  return (object1.length)
}

Vue.prototype.$check4OutdatedData = function (dbdatestring, frequencyMinutes) {
  console.assert(typeof frequencyMinutes === 'number' && frequencyMinutes)

  if (!dbdatestring) {
    console.log('dbdatestring is emtpy...')
    return (true)
  }

  var thresholdDate = new Date();
  thresholdDate.setMinutes(thresholdDate.getMinutes() - frequencyMinutes)
  const dbdate = new Date(dbdatestring)
  console.log(`OUTDATED AS SOON AS:  ${thresholdDate} > ${dbdate}`)
  if (thresholdDate > dbdate) {
    console.log('OUTDATED')
    return (true)
  }

  // Not Outdated
  return (false)
}


// Date Filters:
/////////////////////////////////
// Format Date
Vue.filter('formatDate', function (value) {
  if (value) {
    return formatDate(value, 'DD-MM-YYYY')
  }
})

// Calculate & Format Time Left
Vue.filter('formatTimeLeft', function (value) {
  let diff = getDateDiff(value, Date.now(), 'seconds')
  // TODO: take appropriate unit
  return diff
})


// SANITIZE OPTIONS (IE11 BUGGY?)
/////////////////////////////////
Object.filter = (obj, predicate) => Object.keys(obj)
  .filter(key => predicate(obj[key]))
  .reduce((res, key) => (res[key] = obj[key], res), {});

// Vue.use(VueDOMPurifyHTML)
// TODO: recheck!!!!!!!! => XSS
let defaultOptions = {
  allowedTags: ['a', 'b', 'q'],
  allowedAttributes: {
    'a': ['href'],
    'q': ['class']
  }
}


// AUTH
/////////////////////////////////
// enable oAuth2 Functionality
Vue.use(oAuth2)
