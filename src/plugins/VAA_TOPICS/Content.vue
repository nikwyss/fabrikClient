<template>
    <q-page class="doc_content">

        <!-- DISABLED WARNING -->
        <q-banner dense inline-actions class="text-white bg-red" v-if="contenttree.disabled" style="padding:2em; margin-bottom:1em;">
        This ContentTree is disabled and, therefore, not visible for users.
        </q-banner>

        <div v-if="contenttree">

           
            <div v-if="startingContent">

                <q-btn align="around" 
                    class="btn-fixed-width" color="brown-5" 
                    label="Back to the Pro/Con list" 
                    icon="mdi-arrow-left"
                    @click="clickBackButton"/>

                <TextsheetCard :acl="assembly_acls" 
                    :contenttree="contenttree" 
                    :content="startingContent"
                    :standalone="true" />

            </div>
        </div>




            <!-- @syncstorecontent="syncstorecontent" -->

        <br /><br />
        
        <ComponentContentTree
            :acl="assembly_acls"
            label="Offene Diskussion"
            :contenttree="contenttree" 
            :startingContentID="startingContentID" 
        /> 
            
    </q-page>
</template>


<script>
import ContentTreeMixin from "src/mixins/contenttree"
import ComponentContentTree  from "src/pages/ContentTree/components/ContentTree";
import TextsheetCard from "./components/TextsheetCard";

export default {
    name: 'Content',
    components: {
        ComponentContentTree,
        TextsheetCard
    },
    mixins: [ContentTreeMixin],

    methods: {
        clickBackButton: function () {
            alert ("disabled")
            // this.$router.push({name: 'PROS_AND_CONS', params: {contenttreeID: this.contenttreeID}})
        }
    }
}
</script>
