import cir_pros_and_cons_routes from "./CIR_PROS_AND_CONS/routes.js"
import textsheet_routes from "./TEXTSHEET/routes.js"
import vaa_topics_routes from "./VAA_TOPICS/routes.js";
import survey_routes from "./SURVEY/routes.js";

// TODO: AUTO IMPORT
var plugin_routes = []
plugin_routes.push(...vaa_topics_routes)
plugin_routes.push(...textsheet_routes)
plugin_routes.push(...cir_pros_and_cons_routes)
plugin_routes.push(...survey_routes)

export default plugin_routes
