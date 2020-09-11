import messages from 'src/i18n'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
// require('moment/locale/de')



Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'de-ch',
  fallbackLocale: 'de-ch',
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
}

// if you need to import it from
// other files, then:


export { i18n }


// // Localization
const moment = require('moment')
// require('moment/locale/de')
moment.defineLocale('de-ch', {parentLocale: 'de',});
Vue.use(require('vue-moment'), {moment})
 

console.log("----------")
console.log(Vue.moment().locale()) //es
console.log("----------")
Vue.moment.locale('de-ch');
console.log(Vue.moment().locale()) //es


// Vue.use(require('vue-moment'));

// Vue.moment.locale('de');
// // console.log(i18n.locale)
// // Vue.moment.locale(i18n.locale)
// console.log(Vue.moment().locale()) //es

// // ADDED BY DW
// // date filters
// Vue.filter('formatDate', function (value: string) {
//   if (value) {
//     return moment(String(value)).format('L')
//   }
// })

// import {getStartingLocale, loadLocaleMessages} from "./i18n.service"
// set moment locales
// var clocale = getStartingLocale();
// moment.locale(clocale);

// Vue.use(VueI18n)

// export const i18n = new VueI18n({
//   locale: 'en-us',
//   fallbackLocale: 'en-us',
//   messages
// })

// // locale: clocale,
// // silentTranslationWarn: true,
// // fallbackLocale: Configuration.value('ENV_I18N_FALLBACK_LOCALE') || 'de-CH',
// // messages: loadLocaleMessages()

// export default boot(({ app }) => {
//   // Set i18n instance on app
//   app.i18n = i18n
// })
