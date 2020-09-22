/*
contains all method that are specific to q-tree. 
i.e.  filtering and management of expanded content .
*/

import { mapActions, mapGetters } from 'vuex'

export default {

    // non-reactive variables => access it by this.$options.varname..
    temp_content_object: null,
    data: function() {
        return {
            expanded: null,
            filter: '',
            expanded_filter: false
        }
    },

    inject: ['CTREE', 'ABLY'],
    computed: {

        // contenttreeID: function() {
        //     return(CTREE.contenttree.id)
        // },

        root_node_ids: function() {
            if(this.CTREE.startingContentID) {
                return(this.CTREE.startingContent_node.children.map(x=> x.id))
            }
            return(this.CTREE.contenttree.structure.children.map(x=> x.id))
        },

        startingContent_node: function() {
            console.log("get startingContent_node")
            if(this.custom_starting_node) {
                return(this.custom_starting_node)
            }else{
                console.assert(this.CTREE.startingContentID)
                return(this.get_node_by_id(this.CTREE.startingContentID))
            }
        },

        total_nof_contents: function() {
            return(this.CTREE.startingContent_node["nof_descendants"])
        },

        ...mapGetters({ 
            get_default_expanded_branches_from_store: 'contentstore/get_default_expanded_branches_from_store',
        }),
    },

    methods: {
        is_currently_expanded: function(node_id) {
            return(this.expanded.includes(node_id))
        },

        collapse_all_children: function(parent_id) {

            if (parent_id==null) {
                return(this.expand_none())
            }

            let parent_node = this.get_node_by_id(parent_id)
            var siblings = parent_node.children

            // remove siblings from expanded list
            if(siblings.length>0) {
                let siblings_ids = siblings.map(x => x.id);
                this.expanded = this.expanded.filter(
                    x => !siblings_ids.includes(x)
                )
            }

            return(true)
        },

        expand_node: function(node_id) {
            this.expanded.push(node_id)
        },

        expand_more: function() {
            console.log("EXPAND MORE")

            /// expand all children of currently expanded nodes.
            var new_ids = []
            var child_ids = []
            let nodes = this.$refs.qtree.getExpandedNodes()
            if (nodes) {
                for(let key in nodes) {
                    let node = nodes[key]
                    if (node) {
                        child_ids = node.children.map(y => y.id)
                        new_ids = new_ids.concat(child_ids);
                    }
                }
            }

            /// expand all root nodes
            let root_ids = this.root_node_ids
            new_ids = new_ids.concat(root_ids)
            let all_ids = this.expanded.concat(new_ids)
            this.expanded = all_ids
            this.updateExpanded()

            // Notify
            var nof_shown =  this.expanded.length
            var nof_total =  this.total_nof_contents
            // TODO: consider alos search/filtering.
            this.$q.notify({
                type: 'info',
                message: `${nof_shown} of ${nof_total} are expanded.`
              })
        },

        expand_none: function() {
            console.log("expand_none")
            this.expanded = []
            this.updateExpanded()

            // Notify
            var nof_shown =  0
            var nof_total =  this.total_nof_contents
            this.$q.notify({
                type: 'info',
                message: `${nof_shown} of ${nof_total} are expanded.`
            })
        },

        calculate_default_expanded_branches: function () {
            
            // get default values
            let node = this.startingContent_node
           // TODO: do a while and loop the x level until 25 are reached...
            //    let branches = Object.keys(node.children)
           let branches = node.children.map(function (x) { return x.id});
           branches.push(node.id)

           return(branches)
        },

        updateExpanded: function() {
            this.update_expanded_branches({
                contenttreeID: this.CTREE.contenttreeID, 
                startingContentID: this.CTREE.startingContentID, 
                expanded: this.expanded})
        },

        // FILTER TREE
        treeFilterMethod (node, filter) {
            const filt = filter.toLowerCase()
            // return node.label && node.label.toLowerCase().indexOf(filt) > -1 && node.label.toLowerCase().indexOf('(*)') > -1
            let obj = this.CTREE.contenttree.entries[node.id]
            let searchable = `${obj.content.title} ${obj.content.text}`
            return searchable.toLowerCase().indexOf(filt) > -1
        },
        resetFilter () {
            console.log("reset filter")
            this.filter = ''
            this.$refs.filter.focus()
        },
        
        zoomToContent: function(content) {
            console.log("ZOOOM TO CONTENT")

            // collapsse all siblings to improve overview
            console.log("CALL CLOSE CHILDREN FOR PARENT" + content.parent_id)
            this.collapse_all_children(content.parent_id)

            // expand newly added content and its parent...
            if (content.parent_id) {
                this.expand_node(content.parent_id)
            }

            this.expand_node(content.id)

            // scroll to newly entered content
            let anchorid = `arg${content.id}`
            var element = document.getElementById(anchorid);
            if(element) {
                // See for better scrolling: https://quasar.dev/quasar-utils/scrolling-utils#Scrolling-to-an-element
                // DEFAULT SCROLL: goes too far down. TODO: correct this
                element.scrollIntoView();
            }
        },


        cachedNode: function(contentID) {
            // With this getter the content data has to be loaded only once; 
            // and can be used in the tree.header as well as the tree.body templates. 
            if (this.$options.temp_content_object===null || this.$options.temp_content_object.content.id != contentID) {
                this.$options.temp_content_object = this.CTREE.contenttree.entries[contentID]
            }
            return(this.$options.temp_content_object)
        },

        get_node_by_branch: function(branch) {
            console.log("get node by branch: " + branch)

            var parent_node = null
            let path = branch.split(":")
            var children = this.CTREE.contenttree.structure.children
            for(let key in path) {
                let junction = Number(path[key])
                if (!junction) {
                    continue
                }
                parent_node = children.filter(c => c.id == junction)[0]
                console.assert(parent_node)
                children = parent_node.children;
            }
            console.assert(parent_node)
            return(parent_node)
        },

        get_branch_by_id: function(node_id) {
            // console.log(this.$refs)
            // let node = this.$refs.qtree.getNodeByKey(node_id)
            // return(node.branch)

            // this.$refs.tree.getNodeByKey(node_id);
            if(node_id===null) {
                return(null)
            }
            var obj = this.CTREE.contenttree.entries[node_id]
            console.assert(obj)
            var parent_id = obj.content.parent_id
            var branch = ":" + node_id
            console.assert(obj)
            while(parent_id!==null) {
                branch = ":" + parent_id + branch
                obj = this.CTREE.contenttree.entries[parent_id]
                parent_id = obj.content.parent_id
            }
            console.assert(branch)
            return(branch)
        },

        get_node_by_id_via_branch: function(node_id) {
            console.log("get node by id via branch: " + node_id)
            // console.log(this.$refs)
            // let node = this.$refs.qtree.getNodeByKey(node_id)
            // return(node)

            if(node_id===null) {
                return(this.CTREE.contenttree.structure)
            }

            let branch = this.get_branch_by_id(node_id)
            let node = this.get_node_by_branch(branch)
            return(node)
        },

        get_node_by_id: function(node_id) {
            console.log("get node by id: " + node_id)
            if("qtree" in this.$refs) {
                let node = this.$refs.qtree.getNodeByKey(node_id)
                if(node) {
                    return(node)
                }
            }
            return(this.get_node_by_id_via_branch(node_id))
        },

        ...mapActions({
            // add_or_update_contenttree: 'contenttree/add_or_update_contenttree',
            // update_contenttree: 'contenttreestore/update_contenttree',
            update_expanded_branches: 'contentstore/update_expanded_branches'
        }),
    },

    created: function() {

        // set expanded branches
        if(this.expanded === null) {
            console.assert(this.CTREE.contenttree)
          
            // first: check in 
            this.expanded = this.get_default_expanded_branches_from_store({
                contenttreeID: this.CTREE.contenttreeID, 
                startingContentID: this.CTREE.startingContentID})
        }

        if(this.expanded===null) {
            this.expanded = this.calculate_default_expanded_branches()
            // console.log(this.expanded)
            this.update_expanded_branches({
                contenttreeID: this.CTREE.contenttreeID, 
                startingContentID: this.CTREE.startingContentID, 
                expanded: this.expanded})
        }
        // console.log(this.expanded)

    },

    mounted: function() {
        this.$emit("tree_is_mounted");
    }
}
