<style scoped>
.q-tree__node-header-content .q-icon{
    font-size:unset !important;
}
</style>
<template>
    <div :id="`arg${node.id}`" class="full-width text-h6" >
            <span v-on:click.stop v-if="real_expanded" style="float:right; " class="full-height">
                <ContentToolbar
                    :acl="acl"
                    :obj="obj"
                    :contenttree="contenttree"/>
            </span>
            <div style="margin-top:10px;">{{ content.title }} </div>
            <q-badge color="blue" v-if="!real_expanded" align="top">click to see {{node.nof_descendants}} more</q-badge>

    </div>
</template>

<script>
// TODO: put title also in structure dictionary. This could fasten the tree.
// import ContentToolbar from "./ContentToolbar";
import ContentToolbar from "src/pages/ContentTree/components/ContentToolbar";

export default {
    name: "ContentTreeEntryTitle",
    props: ["obj", "node", "expanded", "currently_selected_contentID", 
        "contenttree"],
    components: {ContentToolbar},

    // data () {
    //     return {
    //         colors: ["red", "purple", "green", "indigo", "cyan", "amber", "brown"],
    //     }
    // },
    computed: {
        // bgColor: function() {
        //     let mod = this.content.level % this.colors.length
        //     let color = this.colors[mod]
        //     return("background-color:" + color)
        // },
        content: function() {
            return(this.obj.content)
        },
        progression: function() {
            return(this.obj.progression)
        },
        real_expanded: function() {
            return(this.expanded || this.node.children.length==0)
        }
    }
}
</script>
