import pros_and_cons_routes from "./usercontent/PROS_AND_CONS/routes.js"
import textsheet_routes from "./usercontent/TEXTSHEET/routes.js"
import vaa_topics_routes from "./usercontent/VAA_TOPICS/routes.js";
import oauth_routes from "./oauth/routes.js"

// TODO: AUTO IMPORT
var plugin_routes = []
plugin_routes.push(...vaa_topics_routes)
plugin_routes.push(...textsheet_routes)
plugin_routes.push(...pros_and_cons_routes)
plugin_routes.push(...oauth_routes)

export default plugin_routes
