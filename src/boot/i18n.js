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

export { i18n }

// Localization
const moment = require('moment')
// require('moment/locale/de')
moment.defineLocale('de-ch', {parentLocale: 'de',});
Vue.use(require('vue-moment'), {moment})
