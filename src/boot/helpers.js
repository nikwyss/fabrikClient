/* THIS is a mixin for global helper methods and properties used in the Demokratie Fabrik. */
import { boot } from 'quasar/wrappers'
import Vue from 'vue'
import VueSanitize from "vue-sanitize";

Object.filter = (obj, predicate) => 
Object.keys(obj)
      .filter( key => predicate(obj[key]) )
      .reduce( (res, key) => (res[key] = obj[key], res), {} );

      
// Vue.use(VueDOMPurifyHTML)
// TODO: recheck!!!!!!!! => XSS
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

  // User-specific Statuses
  // ongoing process: already started, but not yet finished 
  // not yet started
  // keep in sync with => fabrikApi/models/mixins.py
  Vue.prototype.STATUS_IDLE = 1
  // status = very important tasks
  Vue.prototype.STATUS_ALERT = 2
  // status = perliminary completed
  Vue.prototype.STATUS_PRELIMINARY_COMPLETED = 3
  // Task accomplished
  // (no way to re-open by user)
  Vue.prototype.STATUS_COMPLETED = 11
  // skipped/cancelled by user
  Vue.prototype.STATUS_SKIPPED = 12
  // locked by admins
  Vue.prototype.STATUS_LOCKED = 13

  // API Events
  Vue.prototype.MonitorContenttreeEntering = 'MonitorContenttreeEntering'
  Vue.prototype.MonitorStageEntering = 'MonitorStageEntering'
  Vue.prototype.MonitorAssemblyEntering = 'MonitorAssemblyEntering'

  // Enter number of minutes between each notification request.
  Vue.prototype.CacheUpdateFrequency = 5 


  /*
  Returns length of a object/list, while handling null as 0. 
  TODO: put this to window.object?
  */
  Vue.prototype.nLength = function (object1) {
    if (object1===null){
      return(0)
    }
    return (object1.length)
  }

  Vue.prototype.check4OutdatedData = function (dbdatestring, frequencyMinutes) {
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
})
