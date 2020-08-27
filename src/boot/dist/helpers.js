"use strict";
exports.__esModule = true;
/* THIS is a mixin for global helper methods and properties used in the Demokratie Fabrik. */
var wrappers_1 = require("quasar/wrappers");
exports["default"] = wrappers_1.boot(function (_a) {
    var Vue = _a.Vue;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Vue.mixin({
        methods: {
            /* Random Translator method. (tr <default>, trc <pluarization>)
            This allows to define multiple translations with exactly the same meaning.
            This shall bring variation in AM-instructions and feels a bit less robotic.
            (when using this method, instead of just $t, then you have to add to the i18n libraray
              a list of strings instead simply a string.)
            */
            '$tr': function (key, param1) {
                var counter = 1;
                return (this.$trc(key, counter, param1));
            },
            '$trc': function (key, param1, param2) {
                // get list of available translations...
                var list_of_translations = this.$i18n.t(key, param1);
                if (!(list_of_translations instanceof Array)) {
                    return (list_of_translations);
                }
                // return the translation at position <random>....
                var random = Math.floor(Math.random() * list_of_translations.length);
                key = key + "[" + random + "]";
                // translate it again...
                var final_translation = this.$i18n.t(key, param1, param2);
                return (final_translation);
            }
        }
    });
});
