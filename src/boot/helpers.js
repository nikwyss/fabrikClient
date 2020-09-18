/* THIS is a mixin for global helper methods and properties used in the Demokratie Fabrik. */
import { boot } from 'quasar/wrappers'
import Vue from 'vue'
import VueSanitize from "vue-sanitize";
// we import all of `date`
import ReactiveProvide from 'vue-reactive-provide';

Object.filter = (obj, predicate) => 
Object.keys(obj)
      .filter( key => predicate(obj[key]) )
      .reduce( (res, key) => (res[key] = obj[key], res), {} );

      
// Vue.use(VueDOMPurifyHTML)
let defaultOptions = {
  allowedTags: ['a', 'b', 'q'],
  allowedAttributes: {
    'a': [ 'href' ],
    'q': [ 'class' ]
  }
}

// Used for all editable Richt-Text CONTENT : v-html="$sanitize(item.content.text)"
Vue.use(VueSanitize, defaultOptions);

/*  Used for reactive provide/injections (between antecedents/descendents components)
Note: The descendent object have to load them by .incect!
Advantage:, the mixin can only be loaded once in nested structures....
to keep reactivitiy, see https://github.com/vuejs/vue/issues/7017
// TODO: Vuejs 3: use this for reactive provisions
// msg: Vue.computed(() => this.msg), */
Vue.use(ReactiveProvide)


export default boot(({ Vue }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.mixin(
    {
      //TODO: where to define global constants?
      data: function() {
        return {
          // User-specific Statuses
          // ongoing process: already started, but not yet finished 
          // not yet started
          // keep in sync with => fabrikApi/models/mixins.py
          STATUS_IDLE: 1,
          // status: very important tasks
          STATUS_ALERT: 2,
          // status: perliminary completed
          STATUS_PRELIMINARY_COMPLETED: 3,
          // Task accomplished
          // (no way to re-open by user)
          STATUS_COMPLETED: 11,
          // skipped/cancelled by user
          STATUS_SKIPPED: 12,
          // locked by admins
          STATUS_LOCKED: 13,

          // API Events
          MonitorContenttreeEntering: 'MonitorContenttreeEntering',
          MonitorStageEntering: 'MonitorStageEntering',
          MonitorAssemblyEntering: 'MonitorAssemblyEntering',

          // Enter number of minutes between each notification request.
          CacheUpdateFrequency: 5 

        }
      },
      methods: {

        /*
        Returns length of a object/list, while handling null as 0. 
        TODO: put this to window.object
        */
        nLength: function (object1) {
          if (object1===null){
            return(0)
          }
          return (object1.length)
        },

        check4OutdatedData: function (dbdatestring, frequencyMinutes) {
          console.assert(typeof frequencyMinutes === 'number' && frequencyMinutes)

          if (!dbdatestring) {
            console.log("dbdatestring is emtpy...")
            return (true)
          }

          var thresholdDate = new Date();
          thresholdDate.setMinutes(thresholdDate.getMinutes() - frequencyMinutes)
          const dbdate = new Date(dbdatestring)
          console.log(`OUTDATED AS SOON AS:  ${thresholdDate} > ${dbdate}`)
          if (thresholdDate > dbdate){
            console.log("OUTDATED")
            return (true)
          }

          // Not Outdated
          return (false)
        },


        // // LOAD TREE
        // monitorApi (event, data) {
        //   /* Allowed Events (see fabrikApi/utils/events.py)
        //   __all__  = [EventStageVisit]

        //   stealth request: dont show any loading progression._200
        //   however: show error on failure.
        //   */

        //   console.log("Start Notify API")
        //   console.assert(event)

        //   let url = `${Configuration.value('ENV_APISERVER_URL')}/notify/${event}`
        //   ApiService.post(url, {content: data}).then (
        //     response => {
        //       console.log("API Notified." + event)

        //       // update local storage with updated data
        //       if (response && 'data' in response) {
        //         this.localstorage_add_or_update(response.data)
        //       }
        //     }
        //   )
        // },

        // // TODO: longerm: store all localstorage opbjects via this method
        // localstorage_add_or_update (data) {
        //   console.log(data)
          
        //   // Stage Progression
        //   if (data && 'stage_progression' in data){
        //     console.assert('assembly_identifier' in data)
        //     console.assert('stage_id' in data)
        //     this.$store.dispatch('assemblystore/add_or_update_stage_progression',
        //       {assembly_identifier: data.assembly_identifier, 
        //         stage_id: data.stage_id,
        //         progression: data.stage_progression});            
        //   }
        // }

      //   /* Random Translator method. (tr <default>, trc <pluarization>)
      //   This allows to define multiple translations with exactly the same meaning.
      //   This shall bring variation in AM-instructions and feels a bit less robotic.
      //   (when using this method, instead of just $t, then you have to add to the i18n libraray
      //     a list of strings instead simply a string.)
      //   */
      //  '$tr': function (key, param1) {
      //     let counter = 1
      //     return (this.$trc(key, counter, param1))
      //   },

      // '$trc': function (key, param1, param2) {

      //   // get list of available translations...
      //   let list_of_translations = this.$i18n.t(key, param1)
      //   if (!(list_of_translations instanceof Array)) {
      //     return (list_of_translations)
      //   }

      //   // return the translation at position <random>....
      //   let random = Math.floor(Math.random() * list_of_translations.length)
      //   key = `${key}[${random}]`

      //   // translate it again...
      //   let final_translation = this.$i18n.t(key, param1, param2)
      //   return (final_translation)
      // }
    }
  })
})
