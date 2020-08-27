"use strict";
exports.__esModule = true;
var wrappers_1 = require("quasar/wrappers");
var vue_router_1 = require("vue-router");
var routes_1 = require("./routes");
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
exports["default"] = wrappers_1.route(function (_a) {
    var Vue = _a.Vue;
    Vue.use(vue_router_1["default"]);
    var Router = new vue_router_1["default"]({
        scrollBehavior: function () { return ({ x: 0, y: 0 }); },
        routes: routes_1["default"],
        // Leave these as is and change from quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        mode: process.env.VUE_ROUTER_MODE,
        base: process.env.VUE_ROUTER_BASE
    });
    return Router;
});
