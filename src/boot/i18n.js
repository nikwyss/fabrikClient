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

  let seconds = getDateDiff(value, Date.now(), 'seconds')
  let minutes = getDateDiff(value, Date.now(), 'minutes')
  let hours = getDateDiff(value, Date.now(), 'hours')
  let days = getDateDiff(value, Date.now(), 'days')
  let months = getDateDiff(value, Date.now(), 'months')
  const result = new Array()
  if (months > 1) {
    result.push(`${months} Monate`)
    days -= (30 * days)
    console.log(days)
    hours = 0
    minutes = 0
    seconds = 0
  }
  if (days > 1) {
    result.push(`${days} Tage`)
    hours -= (24 * hours)
    minutes = 0
    seconds = 0
  }
  if (hours > 1) {
    result.push(`${hours} Stunden`)
    minutes -= (60 * minutes)
    seconds = 0
  }
  if (minutes > 1) {
    result.push(`${minutes} Minuten`)
    seconds -= (60 * seconds)
  }
  if (seconds > 0) {
    result.push(`${seconds} Sekunden`)
  }
  return (result.join(','))
})

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
