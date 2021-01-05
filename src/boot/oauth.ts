import { boot } from 'quasar/wrappers'
import oauthInstance from '../utils/oauth'

export default boot(({ Vue }) => {
  Vue.use(oauthInstance)
})
