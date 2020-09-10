<template>
    <q-page class="doc_content">

        <!-- DISABLED WARNING -->
        <q-banner dense inline-actions class="text-white bg-red" v-if="container.disabled" style="padding:2em; margin-bottom:1em;">
        This Container is disabled and, therefore, not visible for users.
        </q-banner>

        <div v-if="contenttree">

           
            <div v-if="starting_content">

                <q-btn align="around" 
                    class="btn-fixed-width" color="brown-5" 
                    label="Back to the Pro/Con list" 
                    icon="mdi-arrow-left"
                    @click="clickBackButton"/>

                <ArgumentCard :acl="assembly.acl" 
                    :container="container" 
                    :content="starting_content"
                    :standalone="true" />

            </div>
        </div>




            <!-- @syncstorecontent="syncstorecontent" -->

        <br /><br />
        
        <ComponentContentTree
            :acl="assembly.acl"
            label="Offene Diskussion"
            :container="container" 
            :contenttree="contenttree" 
            :startingContentID="startingContentID" 
        /> 
            
    </q-page>
</template>


<script>
import ContentTreeMixin from "src/pages/ContentTree/mixins/contenttree"
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
            this.$router.push({name: 'CIR_PROS_AND_CONS', params: {containerID: this.containerID}})
        }
    }
}
</script>
