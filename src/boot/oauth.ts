import { boot } from 'quasar/wrappers'
import oauthInstance from '../plugins/oauth'

export default boot(({ Vue }) => {
  Vue.use(oauthInstance)
})