<template>

    <q-page class="doc_content " >

    <q-btn 
        align="left"
        class="btn-fixed-width q-mb-lg"
        flat
        label="Back to the assembly home"
        icon="mdi-arrow-left"
        @click="gotoAssemblyHome()" />

    <div align="center">
        <div v-if="stage">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="stage.disabled" style="padding:2em; margin-bottom:1em;">
            This ContentTree Stage is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')"
                :assembly_id="assembly.id"
                :model="stage" />

            <!-- <div class="text-h4">{{stage.stage.title}}</div> -->
        </div>

        <div v-if="stage && contenttree" class="text-vessel">
            <!-- gt-sm: SHOW ONLY ON WIDE SCREENS -->


            <h2>{{stage.title}}</h2>
            <p class="text-body1">{{stage.info}}</p>

            <div class="row justify-between" v-for="(nodeL1, keyL1)  in filter_textsheet_entries(contenttree.structure.children)" 
            :key="`L1${nodeL1.id}`">

                <div class="seperator"><q-icon name="mdi-star-four-points-outline" /></div>

                <TextsheetCard 
                    :acl="assembly_acls" 
                    :level="1"
                    :comments="filter_entries(nodeL1.children, ['COMMENT'])"
                    :questions="filter_entries(nodeL1.children, ['QUESTION'])"
                    :heading_number="(keyL1+1)"
                    :contenttree="contenttree"
                    :stage="stage"
                    :item="contenttree.entries[nodeL1.id]"/>

                <div class="row justify-between" 
                        v-for="(nodeL2, keyL2) in filter_textsheet_entries(nodeL1.children)" 
                        :key="`L2${nodeL2.id}`">

                    <TextsheetCard
                        :acl="assembly_acls"
                        :level="2"
                        :comments="filter_entries(nodeL2.children, ['COMMENT'])"
                        :questions="filter_entries(nodeL2.children, ['QUESTION'])"
                        :heading_number="`${(keyL1+1)}.${(keyL2+1)}`"
                        :stage="stage"
                        :contenttree="contenttree"
                        :item="contenttree.entries[nodeL2.id]"/>


                    <div class="row justify-between" v-for="(nodeL3, keyL3)  in filter_textsheet_entries(nodeL2.children)" 
                            :key="`L3${nodeL3.id}`">

                        <TextsheetCard
                            :acl="assembly_acls"
                            :comments="filter_entries(nodeL3.children, ['COMMENT'])"
                            :questions="filter_entries(nodeL3.children, ['QUESTION'])"
                            :level="3"
                            :contenttree="contenttree"
                            :stage="stage"
                            :item="contenttree.entries[nodeL3.id]"/>
                    </div>
                </div>

            </div>

        </div>
    </div>
    </q-page>
</template>

<script>
import ContentTreeMixin from "src/mixins/contenttree"
import ComponentStageEditor from "src/pages/ContentTree/components/StageEditor";
import TextsheetCard from "./components/TextsheetCard";

export default {
    name: 'TextsheetDefault',
    components: {
        ComponentStageEditor,
        TextsheetCard,
    },

    mixins: [ContentTreeMixin],

    methods: {

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
