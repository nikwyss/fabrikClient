"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vuex = require("vuex");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  // non-reactive variables => access it by this.$options.varname..
  temp_content_object: null,
  data: function data() {
    return {
      expanded: null,
      filter: '',
      expanded_filter: false
    };
  },
  computed: _objectSpread({
    containerID: function containerID() {
      return this.container.id;
    },
    root_node_ids: function root_node_ids() {
      if (this.startingContentID) {
        return this.startingContent_node.children.map(function (x) {
          return x.id;
        });
      }

      return this.contenttree.structure.children.map(function (x) {
        return x.id;
      });
    },
    startingContent_node: function startingContent_node() {
      console.log("get startingContent_node");

      if (this.custom_starting_node) {
        return this.custom_starting_node;
      } else {
        console.assert(this.startingContentID);
        return this.get_node_by_id(this.startingContentID);
      }
    },
    total_nof_contents: function total_nof_contents() {
      return this.startingContent_node["nof_descendants"];
    }
  }, (0, _vuex.mapGetters)({
    get_default_expanded_branches_from_store: 'contentstore/get_default_expanded_branches_from_store'
  })),
  methods: _objectSpread({
    is_currently_expanded: function is_currently_expanded(node_id) {
      return this.expanded.includes(node_id);
    },
    collapse_all_children: function collapse_all_children(parent_id) {
      if (parent_id == null) {
        return this.expand_none();
      }

      var parent_node = this.get_node_by_id(parent_id);
      var siblings = parent_node.children; // remove siblings from expanded list

      if (siblings.length > 0) {
        var siblings_ids = siblings.map(function (x) {
          return x.id;
        });
        this.expanded = this.expanded.filter(function (x) {
          return !siblings_ids.includes(x);
        });
      }

      return true;
    },
    expand_node: function expand_node(node_id) {
      this.expanded.push(node_id);
    },
    expand_more: function expand_more() {
      console.log("EXPAND MORE"); /// expand all children of currently expanded nodes.

      var new_ids = [];
      var child_ids = [];
      var nodes = this.$refs.qtree.getExpandedNodes();

      if (nodes) {
        for (var key in nodes) {
          var node = nodes[key];

          if (node) {
            child_ids = node.children.map(function (y) {
              return y.id;
            });
            new_ids = new_ids.concat(child_ids);
          }
        }
      } /// expand all root nodes


      var root_ids = this.root_node_ids;
      new_ids = new_ids.concat(root_ids);
      var all_ids = this.expanded.concat(new_ids);
      this.expanded = all_ids;
      this.updateExpanded(); // Notify

      var nof_shown = this.expanded.length;
      var nof_total = this.total_nof_contents; // TODO: consider alos search/filtering.

      this.$q.notify({
        type: 'info',
        message: "".concat(nof_shown, " of ").concat(nof_total, " are expanded.")
      });
    },
    expand_none: function expand_none() {
      console.log("expand_none");
      this.expanded = [];
      this.updateExpanded(); // Notify

      var nof_shown = 0;
      var nof_total = this.total_nof_contents;
      this.$q.notify({
        type: 'info',
        message: "".concat(nof_shown, " of ").concat(nof_total, " are expanded.")
      });
    },
    calculate_default_expanded_branches: function calculate_default_expanded_branches() {
      // get default values
      var node = this.startingContent_node; // TODO: do a while and loop the x level until 25 are reached...
      //    let branches = Object.keys(node.children)

      var branches = node.children.map(function (x) {
        return x.id;
      });
      branches.push(node.id);
      return branches;
    },
    updateExpanded: function updateExpanded() {
      this.update_expanded_branches({
        containerID: this.containerID,
        startingContentID: this.startingContentID,
        expanded: this.expanded
      });
    },
    // FILTER TREE
    treeFilterMethod: function treeFilterMethod(node, filter) {
      var filt = filter.toLowerCase(); // return node.label && node.label.toLowerCase().indexOf(filt) > -1 && node.label.toLowerCase().indexOf('(*)') > -1

      var obj = this.contenttree.entries[node.id];
      var searchable = obj.content.title + ' ' + obj.content.text;
      return searchable.toLowerCase().indexOf(filt) > -1;
    },
    resetFilter: function resetFilter() {
      console.log("reset filter");
      this.filter = '';
      this.$refs.filter.focus();
    },
    zoomToContent: function zoomToContent(content) {
      console.log("ZOOOM TO CONTENT"); // collapsse all siblings to improve overview

      console.log("CALL CLOSE CHILDREN FOR PARENT" + content.parent_id);
      this.collapse_all_children(content.parent_id); // expand newly added content and its parent...

      if (content.parent_id) {
        this.expand_node(content.parent_id);
      }

      this.expand_node(content.id); // scroll to newly entered content

      var anchorid = 'arg' + content.id;
      var element = document.getElementById(anchorid);

      if (element) {
        // See for better scrolling: https://quasar.dev/quasar-utils/scrolling-utils#Scrolling-to-an-element
        // DEFAULT SCROLL: goes too far down. TODO: correct this
        element.scrollIntoView();
      }
    },
    cachedNode: function cachedNode(contentID) {
      // With this getter the content data has to be loaded only once; 
      // and can be used in the tree.header as well as the tree.body templates. 
      if (this.$options.temp_content_object === null || this.$options.temp_content_object.content.id != contentID) {
        this.$options.temp_content_object = this.contenttree.entries[contentID];
      }

      return this.$options.temp_content_object;
    },
    get_node_by_branch: function get_node_by_branch(branch) {
      console.log("get node by branch: " + branch);
      var parent_node = null;
      var path = branch.split(":");
      var children = this.contenttree.structure.children;

      var _loop = function _loop(key) {
        var junction = Number(path[key]);

        if (!junction) {
          return "continue";
        }

        parent_node = children.filter(function (c) {
          return c.id == junction;
        })[0];
        console.assert(parent_node);
        children = parent_node.children;
      };

      for (var key in path) {
        var _ret = _loop(key);

        if (_ret === "continue") continue;
      }

      console.assert(parent_node);
      return parent_node;
    },
    get_branch_by_id: function get_branch_by_id(node_id) {
      // console.log(this.$refs)
      // let node = this.$refs.qtree.getNodeByKey(node_id)
      // return(node.branch)
      // this.$refs.tree.getNodeByKey(node_id);
      if (node_id === null) {
        return null;
      }

      var obj = this.contenttree.entries[node_id];
      console.assert(obj);
      var parent_id = obj.content.parent_id;
      var branch = ":" + node_id;
      console.assert(obj);

      while (parent_id !== null) {
        branch = ":" + parent_id + branch;
        obj = this.contenttree.entries[parent_id];
        parent_id = obj.content.parent_id;
      }

      console.assert(branch);
      return branch;
    },
    get_node_by_id_via_branch: function get_node_by_id_via_branch(node_id) {
      console.log("get node by id via branch: " + node_id); // console.log(this.$refs)
      // let node = this.$refs.qtree.getNodeByKey(node_id)
      // return(node)

      if (node_id === null) {
        return this.contenttree.structure;
      }

      var branch = this.get_branch_by_id(node_id);
      var node = this.get_node_by_branch(branch);
      return node;
    },
    get_node_by_id: function get_node_by_id(node_id) {
      console.log("get node by id: " + node_id);

      if ("qtree" in this.$refs) {
        var node = this.$refs.qtree.getNodeByKey(node_id);

        if (node) {
          return node;
        }
      }

      return this.get_node_by_id_via_branch(node_id);
    }
  }, (0, _vuex.mapActions)({
    // add_or_update_container: 'container/add_or_update_container',
    // update_contenttree: 'containerstore/update_contenttree',
    update_expanded_branches: 'contentstore/update_expanded_branches'
  })),
  created: function created() {
    // set expanded branches
    if (this.expanded === null) {
      console.assert(this.contenttree); // first: check in 

      this.expanded = this.get_default_expanded_branches_from_store({
        containerID: this.containerID,
        startingContentID: this.startingContentID
      });
    }

    if (this.expanded === null) {
      this.expanded = this.calculate_default_expanded_branches();
      // console.log(this.expanded);
      this.update_expanded_branches({
        containerID: this.containerID,
        startingContentID: this.startingContentID,
        expanded: this.expanded
      });
    }

    // console.log(this.expanded);
  },
  mounted: function mounted() {
    console.log("finished loading");
    this.$emit("tree_is_mounted");
  }
};
exports["default"] = _default;