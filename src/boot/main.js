import Vue from 'vue'


// APP CONSTANTS
/////////////////////////////////
import Constants from 'src/utils/constants'
Vue.prototype.Constants = Constants

// SANITIZER
/////////////////////////////////
import VueDOMPurifyHTML from 'vue-dompurify-html'
Vue.use(VueDOMPurifyHTML)

// GLOBAL METHODS
/////////////////////////////////

// Add Object filter: helper...
// TODO: remove this. not necessary, since [].filter() does work perfectly...
Object.filter = (obj, predicate) => Object.keys(obj)
  .filter(key => predicate(obj[key]))
  .reduce((res, key) => (res[key] = obj[key], res), {});

/* Returns length of a object/list, while handling null as 0. */
Vue.prototype.$nLength = function (object1) {
  if (object1 === null) {
    return (0)
  }
  return (object1.length)
}

// Vue.prototype.$check4OutdatedData = function (dbdatestring, frequencyMinutes) {
//   console.assert(typeof frequencyMinutes === 'number' && frequencyMinutes)

//   if (!dbdatestring) {
//     console.log('dbdatestring is emtpy...')
//     return (true)
//   }

//   var thresholdDate = new Date();
//   thresholdDate.setMinutes(thresholdDate.getMinutes() - frequencyMinutes)
//   const dbdate = new Date(dbdatestring)
//   console.log(`OUTDATED AS SOON AS:  ${thresholdDate} > ${dbdate}`)
//   if (thresholdDate > dbdate) {
//     console.log('OUTDATED')
//     return (true)
//   }

//   // Not Outdated
//   return (false)
// }



// AUTH
/////////////////////////////////
// enable oAuth2 Functionality
import oAuth2 from 'src/utils/oauth2'
Vue.use(oAuth2)


// CUSTOMMIZATION QUASAR COMPONENTS
//////////////////////////////////
import { Notify } from 'quasar'
Notify.registerType('nFabrikInfo', {
  icon: 'mdi-announcement',
  color: 'brown',
  textColor: 'white',
  classes: 'glossy'
})

Notify.registerType('nFabrikInfo', {
  icon: 'mdi-error',
  color: 'red',
  textColor: 'white',
  classes: 'glossy'
})