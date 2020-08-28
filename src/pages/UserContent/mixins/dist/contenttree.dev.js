"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _xhr = _interopRequireDefault(require("src/utils/xhr"));

var _vuex = require("vuex");

var _assembly = _interopRequireDefault(require("src/pages/Assembly/mixins/assembly"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import assembly from "src/pages/Assembly/mixins/assembly"
var _default = {
  mixins: [_assembly["default"]],
  data: function data() {
    return {
      is_loaded: false,
      checked_sync_state: false
    };
  },
  computed: _objectSpread({
    containerID: function containerID() {
      return this.$route.params.containerID;
    },
    container: function container() {
      console.assert(this.assembly);

      if (!this.containerID) {
        return null;
      }

      if (!this.assemblyIdentifier) {
        return null;
      } // has contentree already be cached in the vues store??


      var container = this.get_assembly_container({
        assemblyIdentifier: this.assemblyIdentifier,
        containerID: this.containerID
      });

      if (!container) {
        // Not yet loaded. please wait
        return null;
      }

      console.assert(container);
      return container;
    },
    contenttree: function contenttree() {
      if (!this.containerID) {
        return null;
      }

      if (!this.assemblyIdentifier) {
        return null;
      } // has contentree already be cached in the vues store??


      var contenttree = this.get_contenttree(this.containerID); // // TODO: reload container data to check last modification date.

      if (contenttree) {
        //     // Retrieve once the version of the API
        //     // to ensure, that the local tree is up to date...
        //     this.retrieveContainer()
        //     // return cached version. (dont wait until data are up to date...)
        return contenttree;
      } // no cache version exists: load the full tree...


      this.retrieveContentTree();
      return null;
    },
    startingContentID: function startingContentID() {
      if (this.$route.params.contentID !== undefined) {
        return Number(this.$route.params.contentID);
      }

      return null;
    },
    starting_content: function starting_content() {
      if (this.startingContentID) {
        console.log("starting content found");
        return this.contenttree.entries[this.startingContentID];
      }

      return null;
    }
  }, (0, _vuex.mapGetters)({
    get_assembly_container: 'assemblystore/get_assembly_container',
    get_contenttree: 'contentstore/get_contenttree'
  })),
  methods: _objectSpread({
    retrieveContentTree: function retrieveContentTree() {
      var _this = this;

      console.log("Retrieve contenttree"); // Load container data (to check sync status)

      console.assert(this.assemblyIdentifier);
      var url = process.env.VUE_APP_APISERVER_URL + '/assembly/' + this.assemblyIdentifier + '/container/' + this.containerID + '/contenttree/';

      _xhr["default"].get(url).then(function (response) {
        // update
        console.log('save full contenttree to cache.');
        console.assert('OK' in response.data);
        console.assert('contenttree' in response.data);

        _this.add_or_update_contenttree({
          containerID: _this.containerID,
          contenttree: response.data.contenttree
        });
      }); // this.checked_sync_state = true

    },
    filter_question_entries: function filter_question_entries(nodes) {
      var QUESTION_ENTRIES = ['QUESTION'];
      var local_contenttree = this.contenttree;
      var filtered = nodes.filter(function (item) {
        return QUESTION_ENTRIES.includes(local_contenttree.entries[item.id].content.type);
      });
      return filtered;
    },
    filter_comment_entries: function filter_comment_entries(nodes) {
      var COMMENT_ENTRIES = ['COMMENT'];
      var local_contenttree = this.contenttree;
      var filtered = nodes.filter(function (item) {
        return COMMENT_ENTRIES.includes(local_contenttree.entries[item.id].content.type);
      });
      return filtered;
    }
  }, (0, _vuex.mapActions)({
    add_or_update_contenttree: 'contentstore/add_or_update_contenttree'
  }))
};
exports["default"] = _default;