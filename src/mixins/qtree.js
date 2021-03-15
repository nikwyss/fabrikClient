/*
contains all method that are specific to q-tree. 
i.e.  filtering and management of expanded content .
*/

import { mapActions, mapGetters } from 'vuex'
import { ReactiveProvideMixin } from 'vue-reactive-provide'
/* Make available all the properties and methods in any descendant object.*/
// const ReactiveProvidePropertiesMixin = ReactiveProvideMixin({
//     name: 'QUASAR_TREE',
//     include: ['rootNode', 'realRootNodesIDs'],
// })

export default {

    // non-reactive variables => access it by this.$options.varname..
    temp_content_object: null,
    data() {
        return {
            expanded: null,
            filter: '',
            expanded_filter: false
        }
    },

    /*
    Which <label> should be displayed on top of the ContentTree?
    SHould the Tree be displayed in <dense> layout?
    SHould the whole ContentTree be displayed or only a specific <childrenNodes>?

    <filterTypes>: You may additionaly limit the nodetypes to insert:...
    If nothing is indicated: every type is allowed, that is allowed for the given parent. */

    props: [
        'label',
        'dense',
        'node',
        'filterTypes'],
    // mixins: [ReactiveProvidePropertiesMixin],
    provide() {
        return {
            // popup_content_form: this.popup_content_form,
            contenttreeID: this.CONTENTTREE.contenttreeID,
            realFilterTypes: this.realFilterTypes,
            toggle_node: this.toggle_node,
            is_currently_expanded: this.is_currently_expanded,
            // realRootNodesIDs: this.realRootNodesIDs
        }
    },
    inject: ['CONTENTTREE', 'filter_entries', 'isRead', 'markRead',
        'recalculate_nof_descendants_unread',
        'recalculate_nof_descendants'],
    computed: {

        // childrenNodes() {
        //     return this.rootNode.children
        // },

        rootNodeID: function () {
            return (this.node.id)
        },

        /* Adapt to filters...and also for the case when this.node is empty => root element tree. */
        rootNode: function () {
            console.log('get rootNode')
            var node = this.node

            // Create root-Node entry
            if (!node) {
                node = this.CONTENTTREE.contenttree.structure
            }

            const rootNode = { ...node }
            const original_children_count = node.children.length

            // Correct for filterTypes
            if (this.filterTypes) {
                const children = this.filter_entries(node.children, this.filterTypes);
                rootNode.children = children
            }

            // Correct Numbers
            if (original_children_count > rootNode.children.length) {
                // recalculate metrics...                
                rootNode.nof_descendants = this.recalculate_nof_descendants(rootNode.children)
                rootNode.nof_descendants_unread = this.recalculate_nof_descendants_unread(rootNode.children)
            }

            return (rootNode)
        },

        /* Which node types are allowed within this contenttree/branch? */
        realFilterTypes: function () {
            // get filterTypes
            var allowed_node_types = this.get_allowed_node_types({ contenttreeID: this.CONTENTTREE.contenttreeID })
            // console.log(allowed_node_types)
            if (this.filterTypes) {
                allowed_node_types = allowed_node_types.filter(v => this.filterTypes.includes(v))
            }
            // console.log(allowed_node_types)
            return (allowed_node_types)
        },

        realRootNodesIDs: function () {
            if (!this.rootNode) {
                return [];
            }
            return (this.rootNode.children.map(x => x.id))
        },


        total_nof_contents: function () {
            if (!this.rootNode) {
                return (null)
            }

            return this.rootNode.nof_descendants
        },

        ...mapGetters({
            // assemblyIdentifier: 'assemblystore/assemblyIdentifier',
            get_allowed_node_types: 'contentstore/get_allowed_node_types',
            get_default_expanded_branches_from_store: 'contentstore/get_default_expanded_branches_from_store',
        }),
    },

    methods: {
        is_currently_expanded: function (node) {
            // EXPANDABLE - ALL: if (!node.children?.length) {return;}
            return (this.expanded.includes(node.id))
        },

        collapse_all_children: function (parent_id) {

            if (parent_id == null) {
                return (this.expand_none())
            }

            let parent_node = this.get_node_by_id(parent_id)
            var siblings = parent_node.children

            // remove siblings from expanded list
            if (siblings.length > 0) {
                let siblings_ids = siblings.map(x => x.id);
                this.expanded = this.expanded.filter(
                    x => !siblings_ids.includes(x)
                )
            }

            return (true)
        },

        toggle_node: function (node_id, content) {
            if (this.expanded.includes(node_id, content)) {
                this.collapse_node(node_id)
            } else {
                this.expand_node(node_id, content)
            }
        },

        collapse_node: function (node_id) {
            this.expanded = this.expanded.filter(x => x != node_id)
            this.updateExpanded()
        },

        expand_node: function (node_id, content) {
            this.expanded.push(node_id)
            this.updateExpanded()

            if (!content) {
                content = this.CONTENTTREE.contenttree.entries[node_id]
            }

            if (!this.isRead(content)) {
                this.markRead(content)
            }
        },

        expand_more: function () {
            console.log('EXPAND MORE')

            /// expand all children of currently expanded nodes.
            var new_ids = []
            var child_ids = []
            let nodes = this.$refs.qtree.getExpandedNodes()

            if (nodes) {
                for (let key in nodes) {
                    let node = nodes[key]
                    console.log(node)
                    if (node) {
                        child_ids = node.children.map(y => y.id)
                        new_ids = new_ids.concat(child_ids);
                    }
                }
            }
            console.log(this.realRootNodesIDs, "lll")
            /// expand all root nodes
            new_ids = new_ids.concat(this.realRootNodesIDs)
            // let all_ids = 

            var all_ids = this.expanded.concat(new_ids)

            // Remove empty/undefineds & remove root node
            all_ids = all_ids.filter(x => !!x && x !== this.rootNodeID)
            // Remove duplicates
            all_ids = [...new Set(all_ids)]

            console.log(all_ids, this.rootNodeID);


            this.expanded = all_ids

            this.updateExpanded()

            // Notify
            var nof_shown = this.expanded.length
            var nof_total = this.total_nof_contents
            // TODO: consider alos search/filtering.
            this.$q.notify({
                type: 'nFabrikInfo',
                message: this.$i18n.t('contenttree.notification_number_of_expanded',
                    {
                        nof_shown: nof_shown,
                        nof_total: nof_total
                    })
            })
        },

        expand_none: function () {
            console.log('expand_none')
            this.expanded = []
            this.updateExpanded()
        },

        calculate_default_expanded_branches: function () {

            // get default values
            let node = this.rootNode
            // TODO: do a while and loop the x level until 25 are reached...
            //    let branches = Object.keys(node.children)
            let branches = node.children.map(function (x) { return x.id });
            branches.push(node.id)

            return (branches)
        },

        /* Method store list of expanded array in localstorage */
        updateExpanded: function () {
            this.update_expanded_branches({
                contenttreeID: this.CONTENTTREE.contenttreeID,
                rootNodeID: this.rootNodeID,
                expanded: this.expanded
            })
        },

        // FILTER TREE
        treeFilterMethod(node, filter) {
            const filt = filter.toLowerCase()
            // return node.label && node.label.toLowerCase().indexOf(filt) > -1 && node.label.toLowerCase().indexOf('(*)') > -1
            let obj = this.cachedNode(node.id)
            //this.CONTENTTREE.contenttree.entries[node.id]
            let searchable = `${obj.content.title} ${obj.content.text}`
            return searchable.toLowerCase().indexOf(filt) > -1
        },
        resetFilter() {
            console.log('reset filter')
            this.filter = ''
            this.$refs.filter.focus()
        },

        // zoomToContent: function (content) {
        //     console.log('ZOOOM TO CONTENT')

        //     // collapsse all siblings to improve overview
        //     // console.log('CALL CLOSE CHILDREN FOR PARENT' + content.parent_id)
        //     this.collapse_all_children(content.parent_id)
        //     // expand newly added content and its parent...
        //     if (content.parent_id) {
        //         this.expand_node(content.parent_id)
        //     }

        //     this.expand_node(content.id)
        //     let anchorElName = `arg${content.id}`
        //     this.$root.scrollToAnchor(anchorElName)
        // },


        cachedNode: function (contentID) {
            // With this getter the content data has to be loaded only once; 
            // and can be used in the tree.header as well as the tree.body templates. 
            // TODO: test if useful?
            // Alternative: put whole content in header (and leave body empty...)
            if (this.$options.temp_content_object === null || this.$options.temp_content_object.content.id != contentID) {
                this.$options.temp_content_object = this.CONTENTTREE.contenttree.entries[contentID]
            }
            return (this.$options.temp_content_object)
        },

        get_node_by_branch: function (branch) {
            console.log('get node by branch: ' + branch)

            var parent_node = null
            let path = branch.split(':')
            var children = this.CONTENTTREE.contenttree.structure.children
            for (let key in path) {
                let junction = Number(path[key])
                if (!junction) {
                    continue
                }
                parent_node = children.filter(c => c.id == junction)[0]
                console.assert(parent_node)
                children = parent_node.children;
            }
            console.assert(parent_node)
            return (parent_node)
        },

        get_branch_by_id: function (node_id) {
            // console.log(this.$refs)
            // let node = this.$refs.qtree.getNodeByKey(node_id)
            // return(node.branch)

            // this.$refs.tree.getNodeByKey(node_id);
            if (node_id === null) {
                return (null)
            }
            // var obj = this.CONTENTTREE.contenttree.entries[node_id]
            var obj = this.cachedNode(node.id)
            console.assert(obj)
            var parent_id = obj.content.parent_id
            var branch = `:${node_id}`
            console.assert(obj)
            while (parent_id !== null) {
                branch = `:${parent_id}${branch}`
                obj = this.CONTENTTREE.contenttree.entries[parent_id]
                parent_id = obj.content.parent_id
            }
            console.assert(branch)
            return (branch)
        },

        get_node_by_id_via_branch: function (node_id) {
            // console.log('get node by id via branch: ' + node_id)
            // console.log(this.$refs)
            // let node = this.$refs.qtree.getNodeByKey(node_id)
            // return(node)

            if (node_id === null) {
                return (this.CONTENTTREE.contenttree.structure)
            }

            let branch = this.get_branch_by_id(node_id)
            let node = this.get_node_by_branch(branch)
            return (node)
        },

        get_node_by_id: function (node_id) {
            console.log('get node by id: ' + node_id)
            if ('qtree' in this.$refs) {
                let node = this.$refs.qtree.getNodeByKey(node_id)
                if (node) {
                    return (node)
                }
            }
            return (this.get_node_by_id_via_branch(node_id))
        },

        ...mapActions({
            update_expanded_branches: 'contentstore/update_expanded_branches'
        }),
    },

    created: function () {

        // set expanded branches
        if (this.expanded === null) {
            console.assert(this.CONTENTTREE.contenttree)

            // first: check in 
            this.expanded = this.get_default_expanded_branches_from_store({
                contenttreeID: this.CONTENTTREE.contenttreeID,
                rootNodeID: this.rootNodeID
            })
        }

        if (this.expanded === null) {
            this.expanded = this.calculate_default_expanded_branches()
            // console.log(this.expanded)
            this.update_expanded_branches({
                contenttreeID: this.CONTENTTREE.contenttreeID,
                rootNodeID: this.rootNodeID,
                expanded: this.expanded
            })
        }
    }
}
