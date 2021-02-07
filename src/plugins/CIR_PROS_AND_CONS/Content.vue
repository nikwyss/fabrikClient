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

                <ArgumentCard :acl="assemblyAcls" 
                    :contenttree="contenttree" 
                    :content="startingContent"
                    :standalone="true" />

            </div>
        </div>




            <!-- @syncstorecontent="syncstorecontent" -->

        <br /><br />
        
        <ComponentContentTree
            :acl="assemblyAcls"
            label="Offene Diskussion"
            :contenttree="contenttree" 
            :startingContentID="startingContentID" 
        /> 
            
    </q-page>
</template>


<script>
import ContentTreeMixin from "src/mixins/contenttree"
import ComponentContentTree  from "src/pages/ContentTree/components/ContentTree";
import ArgumentCard from "./components/ArgumentCard";

export default {
    name: 'Content',
    components: {
        ComponentContentTree,
        ArgumentCard
    },
    mixins: [ContentTreeMixin],

    methods: {
        clickBackButton: function () {
            this.$router.push({name: 'CIR_PROS_AND_CONS', params: {
                assemblyIdentifier: runtimeStore.assemblyIdentifier,
                stageID: this.stageID,
                contenttreeID: this.contenttreeID
            }})
        }
    }
}
</script>
