"use strict";
exports.__esModule = true;
var vuex_1 = require("vuex");
var vue_1 = require("vue");
var vuex_persistedstate_1 = require("vuex-persistedstate");
var vuex_store_contenttree_1 = require("./vuex-store-contenttree");
var vuex_store_assembly_1 = require("./vuex-store-assembly");
var vuex_store_1 = require("src/plugins/vuex-store");
var stores = {
    assemblystore: vuex_store_assembly_1.assemblystore,
    contentstore: vuex_store_contenttree_1.contentstore,
    pluginstore: vuex_store_1.pluginstore
};
vue_1["default"].use(vuex_1["default"]);
exports["default"] = new vuex_1["default"].Store({
    modules: stores,
    plugins: [vuex_persistedstate_1["default"]()],
    strict: false // disable for production
});
