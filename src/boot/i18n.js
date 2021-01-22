import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
// import { Quasar } from 'quasar'
import { date } from 'quasar'

Vue.use(VueI18n)


// Date Filters:
/////////////////////////////////
const { getDateDiff, formatDate } = date

// Format Date
Vue.filter('formatDate', function (value) {
  console.log("FILTER")
  if (value) {
    console.log(process.env.ENV_I18N_DATEFORMAT)
    return formatDate(value, process.env.ENV_I18N_DATEFORMAT)
  }
})

// Calculate & Format Time Left
Vue.filter('formatTimeLeft', function (value) {
  let diff = getDateDiff(value, Date.now(), 'seconds')
  // TODO: take appropriate unit
  return diff
})
// console.log(Quasar.utils.date.formatDate(new Date(), 'MM.DD.YY'))



const i18n = new VueI18n({
  locale: process.env.ENV_I18N_LOCALE,
  fallbackLocale: process.env.ENV_I18N_FALLBACK_LOCALE,
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
  // Quasar.lang.set(process.env.ENV_I18N_LOCALE)
  // Quasar.lang.set(Quasar.lang.de)
}

export { i18n }
