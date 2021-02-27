import cir_pros_and_cons_routes from 'src/plugins/CIR_PROS_AND_CONS/routes.js'
import textsheet_routes from 'src/plugins/TEXTSHEET/routes.js'
import vaa_topics_routes from 'src/plugins/VAA_QUESTIONNAIRE/routes.js';
import survey_routes from 'src/plugins/SURVEY/routes.js';

// TODO: AUTO IMPORT
var plugin_routes = []
plugin_routes.push(...vaa_topics_routes)
plugin_routes.push(...textsheet_routes)
plugin_routes.push(...cir_pros_and_cons_routes)
plugin_routes.push(...survey_routes)
// console.log(plugin_routes)
export default plugin_routes
