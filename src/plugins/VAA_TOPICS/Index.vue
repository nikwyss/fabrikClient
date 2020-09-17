<template>
    <q-page class="doc_content">


        <q-btn align="around" 
            class="btn-fixed-width" color="brown-5" 
            label="Back to the assembly home"
            icon="mdi-arrow-left"
            @click="gotoAssemblyHomeIndex()" />

        <div v-if="assembly && stage">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="stage.disabled" style="padding:2em; margin-bottom:1em;">
            This Stage is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')"
                :assembly_id="assembly.id"
                :model="stage" />

            <div class="text-h4">{{stage.title}}</div>

            <p>{{stage.info}}</p>
        </div>

        <q-spinner-dots color="secondary" size="7em" v-if="!contenttree"/>

        <div class="" v-if="stage && contenttree">
            <!-- gt-sm: SHOW ONLY ON WIDE SCREENS -->
            <div class="row justify-between gt-xs ">

                <div class="col-12 col-sm-6">
                    <h2 class=" q-mb-none q-ml-md">{{stage.title}}</h2>
                </div>

            </div>
            <div class="row justify-between" v-for="(nodeL1, keyL1)  in contenttree.structure.children"
                    :key="`L1${nodeL1.id}`">
                <TextsheetCard 
                    :acl="assembly_acls"
                    :level="1"
                    :comments="filter_comment_entries(nodeL1.children)"
                    :questions="filter_question_entries(nodeL1.children)"
                    :heading_number="(keyL1+1)"
                    :contenttree="contenttree"
                    :stage="stage"
                    :item="contenttree.entries[nodeL1.id]"/>
            </div>

        </div>
    </q-page>
</template>


<script>
import ContentTreeMixin from "src/mixins/contenttree"
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import TextsheetCard from "./components/TextsheetCard";

export default {
    name: 'VAATopics',
    components: {
        ComponentStageEditor,
        TextsheetCard,
    },

    mixins: [ContentTreeMixin],

    methods: {
        
        gotoAssemblyHomeIndex: function() {

            // REDIRECT TO ARGUMENT PAGE
            this.$router.replace({name: 'assembly_home_stepper', 
                params: {
                    assemblyIdentifier: this.assembly.identifier,
                    stageID: this.stage.id
                    }
            })
        },

        filter_textsheet_entries: function(nodes) {
            var TEXTSHEET_ENTRIES = ['PARAGRAPH', 'SECTION', 'SUBSECTION']
            var local_contenttree = this.contenttree
            let filtered = nodes.filter(
                item => TEXTSHEET_ENTRIES.includes(local_contenttree.entries[item.id].content.type))
            return(filtered)
        }
    }
}
</script>
