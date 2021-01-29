<template>
    <q-page class="doc_content">
        <div v-if="contenttree">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="routed_stage.stage.disabled" style="padding:2em; margin-bottom:1em;">
            This ContentTree Stage is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentStageEditor 
                v-if="assembly_acls.includes('manage')" 
                @syncstorestage="syncstorestage"
                :model="routed_stage" />

            <div class="text-h4">{{routed_stage.stage.title}}</div>

            <p>{{routed_stage.stage.info}}</p>
        </div>

        <ComponentContentTree label="Offene Diskussion" />
    </q-page>
</template>


<script>
import ContentTreeMixin from "src/mixins/contenttree"
import ComponentStageEditor from "./components/StageEditor";
import ComponentContentTree  from "./components/ContentTree";

export default {
    name: 'UserContentDefault',
    components: {
        ComponentStageEditor,
        ComponentContentTree
    },
    // inject: ['CTREE'],
    mixins: [ContentTreeMixin]
}
</script>
