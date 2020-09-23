<template>
    <q-page class="doc_content">
dddddddddddddddd
        <q-btn align="around" 
            class="btn-fixed-width" color="brown-5" 
            label="Back to the assembly home"
            icon="mdi-arrow-left"
            @click="gotoAssemblyHome()" />

        <div v-if="assembly && routedStage">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="routedStage.stage.disabled" style="padding:2em; margin-bottom:1em;">
            This Stage is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')"
                :assembly_id="assembly.id"
                :model="routedStage" />

            <div class="text-h4">{{routedStage.stage.title}}</div>

            <p>{{routedStage.stage.info}}</p>
        </div>

        <q-spinner-dots color="secondary" size="7em" v-if="!contenttree"/>

        <div class="" v-if="routedStage && contenttree">
            <!-- gt-sm: SHOW ONLY ON WIDE SCREENS -->
            <div class="row justify-between gt-xs ">

                <div class="col-12 col-sm-6">
                    <h2 class=" q-mb-none q-ml-md">{{routedStage.stage.title}}</h2>
                </div>

            </div>
            <div class="row justify-between" v-for="(nodeL1, keyL1)  in contenttree.structure.children"
                    :key="`L1${nodeL1.id}`">
                <TextsheetCard 
                    :level="1"
                    :comments="filter_entries(nodeL1.children, ['COMMENT'])"
                    :questions="filter_entries(nodeL1.children, ['QUESTION'])"
                    :heading_number="(keyL1+1)"
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

    mixins: [ContentTreeMixin]
}
</script>
