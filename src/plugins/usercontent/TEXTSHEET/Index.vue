<template>
    <q-page class="doc_content">


        <q-btn align="around"
            class="btn-fixed-width" color="brown-5"
            label="Back to the assembly home"
            icon="mdi-arrow-left"
            @click="gotoAssemblyHomeIndex()" />

        <div v-if="assembly && container">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="container.disabled" style="padding:2em; margin-bottom:1em;">
            This UserContent Container is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentContainerEditor 
                v-if="assembly.acl.includes('manage')"
                :assembly_id="assembly.id"
                :model="container" />

            <div class="text-h4">{{container.title}}</div>

            <p>{{container.info}}</p>
        </div>

        <q-spinner-dots color="secondary" size="7em" v-if="!contenttree"/>

        <div class="" v-if="container && contenttree">
            <!-- gt-sm: SHOW ONLY ON WIDE SCREENS -->
            <div class="row justify-between gt-xs ">

                <div class="col-12 col-sm-6">
                    <h2 class=" q-mb-none q-ml-md">{{container.title}}</h2>
                </div>

            </div>
            <div class="row justify-between" v-for="(nodeL1, keyL1)  in filter_textsheet_entries(contenttree.structure.children)" 
            :key="`L1${nodeL1.id}`">
                <TextsheetCard 
                    :acl="assembly.acl" 
                    :level="1"
                    :comments="filter_comment_entries(nodeL1.children)"
                    :questions="filter_question_entries(nodeL1.children)"
                    :heading_number="(keyL1+1)"
                    :contenttree="contenttree"
                    :container="container" 
                    :item="contenttree.entries[nodeL1.id]"/>

                <div class="row justify-between" v-for="(nodeL2, keyL2) in filter_textsheet_entries(nodeL1.children)" 
                :key="`L2${nodeL2.id}`">
                    <TextsheetCard
                        :acl="assembly.acl"
                        :level="2"
                        :comments="filter_comment_entries(nodeL2.children)"
                        :questions="filter_question_entries(nodeL2.children)"
                        :heading_number="`${(keyL1+1)}.${(keyL2+1)}`"
                        :container="container"
                        :contenttree="contenttree"
                        :item="contenttree.entries[nodeL2.id]"/>

                    <div class="row justify-between" v-for="(nodeL3, keyL3)  in filter_textsheet_entries(nodeL2.children)" 
                            :key="`L3${nodeL3.id}`">
                        <TextsheetCard
                            :acl="assembly.acl"
                            :comments="filter_comment_entries(nodeL3.children)"
                            :questions="filter_question_entries(nodeL3.children)"
                            :level="3"
                            :heading_number="`${(keyL1+1)}.${(keyL2+1)}.${(keyL3+1)}`"
                            :contenttree="contenttree"
                            :container="container"
                            :item="contenttree.entries[nodeL3.id]"/>
                    </div>
                </div>
            </div>

        </div>
    </q-page>
</template>


<script>
import ContentTreeMixin from "src/pages/UserContent/mixins/contenttree"
import ComponentContainerEditor from "src/pages/UserContent/components/ContainerEditor";
import TextsheetCard from "./components/TextsheetCard";

export default {
    name: 'TextsheetDefault',
    components: {
        ComponentContainerEditor,
        TextsheetCard,
    },

    mixins: [ContentTreeMixin],

    methods: {

        gotoAssemblyHomeIndex: function() {

            // REDIRECT TO ARGUMENT PAGE
            this.$router.replace({name: 'assembly_home_stepper', 
                params: {
                    assemblyIdentifier: this.assembly.identifier,
                    containerID: this.container.id
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
