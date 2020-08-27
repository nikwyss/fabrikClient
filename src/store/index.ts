import Vuex from 'vuex'
import Vue from 'vue'
import createPersistedState from "vuex-persistedstate";

import { contentstore } from './vuex-store-contenttree'
import { assemblystore } from './vuex-store-assembly'
import { pluginstore } from 'src/plugins/vuex-store'

var stores = {
    assemblystore,
    contentstore,
    pluginstore
}

Vue.use(Vuex)

export default new Vuex.Store({
    modules: stores,
    plugins: [createPersistedState()],
    strict: false // disable for production
})