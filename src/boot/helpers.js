/* THIS is a mixin for global helper methods and properties used in the Demokratie Fabrik. */
import { boot } from 'quasar/wrappers'
import Vue from 'vue'
import VueSanitize from "vue-sanitize";

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

export default boot(({ Vue }) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  Vue.mixin({
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
      }
    }
  })
})
