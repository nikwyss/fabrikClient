"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assemblystore = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _wrappers = require("quasar/wrappers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* Stores assembly in the vuex store: it is easy likely that the assembly object is required on many pages._200
 * TODO: ALternative: create a runtime variable...
*/
var state = {
  randomSeed: null,
  // publicIndex: null,
  // ongoing_assemblies: null,
  // published_assemblies: null,
  assemblies: {},
  current_containerID: {},
  current_assemblyIdentifier: null
};
/*
Vuex allows us to define "getters" in the store. You can think of them as computed properties
for stores. Like computed properties, a getter's result is cached based on its dependencies,
and will only re-evaluate when some of its dependencies have changed.
(Hence, getter are run only when Vue-boot or content-change)
*/

var getters = {

  randomLocalStorageSeed: function randomLocalStorageSeed(state) {
    return state.randomSeed;
  },

  get_assembly: function get_assembly(state) {
    return function (assemblyIdentifier) {
      // return state.things.find(thing => thing.identifier === id)
      if (!(assemblyIdentifier in state.assemblies)) {
        return null;
      }

      if (!('assembly' in state.assemblies[assemblyIdentifier])) {
        return null;
      }

      return state.assemblies[assemblyIdentifier].assembly;
    };
  },

  get_assembly_containers: function get_assembly_containers(state) {
    return function (assemblyIdentifier) {
      // return state.things.find(thing => thing.identifier === id)
      console.log(assemblyIdentifier);

      if (!(assemblyIdentifier in state.assemblies)) {
        return null;
      }

      console.assert('containers' in state.assemblies[assemblyIdentifier]);
      console.assert(state.assemblies[assemblyIdentifier].containers !== null);
      return state.assemblies[assemblyIdentifier].containers;
    };
  },

  get_assembly_configuration: function get_assembly_configuration(state) {
    return function (assemblyIdentifier) {
      // return state.things.find(thing => thing.identifier === id)
      // return state.things.find(thing => thing.identifier === id)
      if (!(assemblyIdentifier in state.assemblies)) {
        return null;
      }

      if ('configuration' in state.assemblies[assemblyIdentifier]) {
        return state.assemblies[assemblyIdentifier].configuration;
      }
    };
  },

  get_assembly_progression: function get_assembly_progression(state) {
    return function (assemblyIdentifier) {
      // return state.things.find(thing => thing.identifier === id)
      // return state.things.find(thing => thing.identifier === id)
      if (!(assemblyIdentifier in state.assemblies)) {
        return null;
      }

      if (!('progression' in state.assemblies[assemblyIdentifier])) {
        return null;
      }

      return state.assemblies[assemblyIdentifier].progression;
    };
  },

  get_assembly_container: function get_assembly_container(state) {
    return function (_ref) {
      var assemblyIdentifier = _ref.assemblyIdentifier,
          containerID = _ref.containerID;

      // return state.things.find(thing => thing.identifier === id)
      // return state.things.find(thing => thing.identifier === id)
      if (!(assemblyIdentifier in state.assemblies)) {
        return null;
      }

      if (!('containers' in state.assemblies[assemblyIdentifier])) {
        return null;
      }

      var containers = state.assemblies[assemblyIdentifier].containers;
      console.assert(containerID in containers);
      return containers[containerID];
    };
  },
  
  get_current_assemblyIdentifier: function get_current_assemblyIdentifier(state) {
    // return state.things.find(thing => thing.identifier === id)
    return state.current_assemblyIdentifier;
  },

  get_current_containerID: function get_current_containerID(state) {
    return function (assemblyIdentifier) {
      // return state.things.find(thing => thing.identifier === id)
      if (!(assemblyIdentifier in state.current_containerID)) {
        return null;
      }

      return state.current_containerID[assemblyIdentifier];
    }
  }
}

var actions = {

  touchRandomSeed: function touchRandomSeed(_ref2) {
    var commit = _ref2.commit;
    commit('set_random_seed');
  },

  set_current_containerID: function set_current_containerID(_ref3, _ref4) {
    var commit = _ref3.commit;
    var assembly = _ref4.assembly,
        containerID = _ref4.containerID;
    commit('set_current_containerID', {
      assembly: assembly,
      containerID: containerID
    });
  },

  set_current_assemblyIdentifier: function set_current_assemblyIdentifier(_ref5, assembly) {
    var commit = _ref5.commit;
    commit('set_current_assemblyIdentifier', assembly);
  },

  add_or_update_assembly: function add_or_update_assembly(_ref6, _ref7) {
    var commit = _ref6.commit;
    var assembly = _ref7.assembly,
        containers = _ref7.containers,
        configuration = _ref7.configuration,
        progression = _ref7.progression;
    commit('add_or_update_assembly', {
      assembly: assembly,
      containers: containers,
      configuration: configuration,
      progression: progression
    });
  },

  add_or_update_publicIndex: function add_or_update_publicIndex(_ref8, publicIndex) {
    var commit = _ref8.commit;
    commit('add_or_update_publicIndex', publicIndex);
  }
}

var mutations = {

  set_random_seed: function set_random_seed(state) {
    console.log("SET RANDOM SEED IF NOT YET DONE");

    if (!state.randomSeed) {
      console.log("setter");
      var randomSeed = Math.floor(Math.random() * Math.floor(99)) + 1;
      state.randomSeed = randomSeed;
    }
  },

  set_current_assemblyIdentifier: function set_current_assemblyIdentifier(state, assembly) {
    // keep list of opened contents (if previously available)
    console.log("update current assembly identifier"); // TODO: Vue.set would make the change reactive!! necessary?

    state.current_assemblyIdentifier = assembly ? assembly.identifier : null;
  },

  set_current_containerID: function set_current_containerID(state, _ref9) {
    var assembly = _ref9.assembly,
        containerID = _ref9.containerID;
    // keep list of opened contents (if previously available)
    console.log("update current  container id for the given assembly"); // preprare folder

    if (!(assembly.identifier in state.current_containerID)) {
      _vue["default"].set(state.current_containerID, assembly.identifier, null);
    } // Vue.set  makes the change reactive!!


    _vue["default"].set(state.current_containerID, assembly.identifier, containerID);
  },

  add_or_update_assembly: function add_or_update_assembly(state, _ref10) {
    var assembly = _ref10.assembly,
        containers = _ref10.containers,
        configuration = _ref10.configuration,
        progression = _ref10.progression;
    // keep list of opened contents (if previously available)
    console.log("update assembly containers"); // preprare folder

    if (!(assembly.identifier in state.assemblies)) {
      _vue["default"].set(state.assemblies, assembly.identifier, {
        containers: null,
        assembly: null,
        configuration: null,
        progression: null
      });
    }

    console.log("...containers....");
    console.log(containers); // Vue.set  makes the change reactive!!

    _vue["default"].set(state.assemblies[assembly.identifier], 'assembly', assembly);

    console.log("assemblies have been updated..");

    _vue["default"].set(state.assemblies[assembly.identifier], 'containers', containers);

    console.log("containers have been updated.."); // convert to named array (names == ids)

    _vue["default"].set(state.assemblies[assembly.identifier], 'configuration', configuration);

    console.log("assemblies configuration have been updated too.."); // convert to named array (names == ids)

    _vue["default"].set(state.assemblies[assembly.identifier], 'progression', progression);

    console.log("assemblies progression have been updated too..");
  },
  add_or_update_publicIndex: function add_or_update_publicIndex(state, publicIndex) {
    // Vue.set  makes the change reactive!!
    _vue["default"].set(state, 'publicIndex', publicIndex.publicIndex);

    console.log('publicIndex of assemblies has been updated.');
    console.log(publicIndex);
    var publicAssemblies = publicIndex.publicIndex.assemblies.filter(function (x) {
      return x.is_public;
    });
    var ongoingAssemblies = publicIndex.publicIndex.assemblies.filter(function (x) {
      return x.is_active;
    });

    _vue["default"].set(state, 'published_assemblies', publicAssemblies);

    _vue["default"].set(state, 'ongoing_assemblies', ongoingAssemblies);
  }
}

var assemblystore = {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
}

exports.assemblystore = assemblystore;