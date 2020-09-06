/* THIS is a mixin for global helper methods and properties used in the Demokratie Fabrik. */
import { boot } from 'quasar/wrappers'

export default boot(({ Vue }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.mixin(
    {
      methods: {

        nLength: function (object1) {
          if (object1===null){
            return(0)
          }
          return (object1.length)
        },

        /* Random Translator method. (tr <default>, trc <pluarization>)
        This allows to define multiple translations with exactly the same meaning.
        This shall bring variation in AM-instructions and feels a bit less robotic.
        (when using this method, instead of just $t, then you have to add to the i18n libraray
          a list of strings instead simply a string.)
        */
       '$tr': function (key, param1) {
          let counter = 1
          return (this.$trc(key, counter, param1))
        },

      '$trc': function (key, param1, param2) {

        // get list of available translations...
        let list_of_translations = this.$i18n.t(key, param1)
        if (!(list_of_translations instanceof Array)) {
          return (list_of_translations)
        }

        // return the translation at position <random>....
        let random = Math.floor(Math.random() * list_of_translations.length)
        key = `${key}[${random}]`

        // translate it again...
        let final_translation = this.$i18n.t(key, param1, param2)
        return (final_translation)
      }
    }
  })
})
