"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _xhr = _interopRequireDefault(require("src/utils/xhr"));

var _vuex = require("vuex");

var _eventbus = require("src/layouts/components/eventbus.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  data: function data() {
    return {
      attempts_to_retrieve_an_assembly: 0
    };
  },
  computed: _objectSpread({
    // Helper Dummies

    /** 
     * Is there an active Assembly: 
     * assembly_identifier is taken from the localstorage 
     */
    current_assembly_identifier: function current_assembly_identifier() {
      return this.get_current_assembly_identifier;
    },
    assembly_identifier: function assembly_identifier() {
      return this.$route.params.assembly_identifier;
    },
    assembly: function assembly() {
      console.log("ASSEMBLY GETTER" + this.assembly_identifier);

      _eventbus.LayoutEventBus.$emit('showLoading');

      if (!this.assembly_identifier) {
        console.log("no identifier");
        return null;
      } // has contentree already be cached in the vues store??


      var synced = false;
      var assembly = this.get_assembly(this.assembly_identifier);

      if (assembly) {
        // check sync state of local container version
        synced = this.checkAssemblyStatus(assembly);
      }

      if (!synced) {
        // re-load assembly
        // anyway: downt wait; return cache version. (dont wait until remote data are loaded...)
        console.log("The local copy of the assembly is outdated");
        this.retrieveAssembly(this.assembly_identifier);
      } // update store: current_assembly


      this.set_current_assembly_identifier(assembly); // no cache version exists: load the full tree...

      return assembly;
    },
    assembly_containers: function assembly_containers() {
      console.log("get assembly_containers");

      if (!this.assembly_identifier) {
        return null;
      }

      console.assert(this.assembly);
      console.assert(this.assembly_identifier);
      return this.get_assembly_containers(this.assembly_identifier);
    },
    assembly_configuration: function assembly_configuration() {
      if (!this.assembly_identifier) {
        return null;
      }

      console.assert(this.assembly);
      console.assert(this.assembly_identifier);
      return this.get_assembly_configuration(this.assembly_identifier);
    },
    assembly_progression: function assembly_progression() {
      if (!this.assembly_identifier) {
        return null;
      }

      console.assert(this.assembly);
      console.assert(this.assembly_identifier);
      return this.get_assembly_progression(this.assembly_identifier);
    }
  }, (0, _vuex.mapGetters)({
    get_assembly: 'assemblystore/get_assembly',
    get_current_assembly_identifier: 'assemblystore/get_current_assembly_identifier',
    get_assembly_containers: 'assemblystore/get_assembly_containers',
    get_assembly_progression: 'assemblystore/get_assembly_progression',
    get_assembly_configuration: 'assemblystore/get_assembly_configuration'
  })),
  methods: _objectSpread({
    // LOAD TREE
    retrieveAssembly: function retrieveAssembly(assembly_identifier) {
      var _this = this;

      console.log("Retrieve Assembly"); // Load assembly from the resource server

      console.assert(assembly_identifier);

      if (this.attempts_to_retrieve_an_assembly > 5) {
        // it is not possible to retrieve a valid assembly. Sorry.
        return null;
      }

      this.attempts_to_retrieve_an_assembly += 1;
      console.log("Attempts: " + this.attempts_to_retrieve_an_assembly);
      var url = process.env.VUE_APP_APISERVER_URL + '/assembly/' + assembly_identifier;

      _xhr["default"].get(url).then(function (response) {
        // store it to vuex
        console.log("ASSEMBLY RETRIEVED.");

        _eventbus.LayoutEventBus.$emit('hideLoading');

        console.log('Update CACHE STATUS OF ASSEMBLY'); // if response contains a full version of the container then replace it in the cache

        if (response.data && 'assembly' in response.data) {
          console.assert('assembly' in response.data);
          console.assert('containers' in response.data);

          _this.add_or_update_assembly({
            assembly: response.data.assembly,
            containers: response.data.containers,
            configuration: response.data.configuration,
            progression: response.data.progression
          });
        }
      });
    },
    // CHECK STATE OF LOADED Assembly
    checkAssemblyStatus: function checkAssemblyStatus(assembly) {
      console.log("Is out of date? CACHE STATUS"); // Load container data (to check sync status)
      // check if user_id has changed!
      // reload assembly all half 20 minutes..

      var twentyMinutesEarlier = new Date();
      twentyMinutesEarlier.setMinutes(twentyMinutesEarlier.getMinutes() - 20);

      if (!assembly || assembly.access_sub === undefined || assembly.access_date === undefined || // TODO: just during page reload $root.userid is null.
      assembly.access_sub != this.$root.userid || assembly.access_date < twentyMinutesEarlier) {
        console.log("OUTDATED");
        return false;
      }

      console.log("OK");
      return true;
    }
  }, (0, _vuex.mapActions)({
    add_or_update_assembly: 'assemblystore/add_or_update_assembly',
    set_current_assembly_identifier: 'assemblystore/set_current_assembly_identifier'
  })),
  mounted: function mounted() {// this.update_public_index()
  }
};
exports["default"] = _default;