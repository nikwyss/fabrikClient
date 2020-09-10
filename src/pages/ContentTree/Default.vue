<template>
    <q-page class="doc_content">

        <div v-if="contenttree">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="stage.disabled" style="padding:2em; margin-bottom:1em;">
            This ContentTree Stage is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentStageEditor 
                v-if="acl.includes('manage')" 
                @syncstorestage="syncstorestage"
                :model="stage" />

            <div class="text-h4">{{stage.title}}</div>
            <!-- <div class="text-h4 q-mt-sm q-mb-xs">{{stage.title}}</div> -->

            <p>{{stage.info}}</p>
        </div>


        <!-- <component 
            v-bind:is="ComponentContentTree"  -->
            <!-- @syncstorecontent="syncstorecontent" -->

        <ComponentContentTree 
            :acl="acl"
            label="Offene Diskussion"
            :stage="stage" 
            :contenttree="contenttree" 
            :startingContentID="startingContentID" />
            
    </q-page>
</template>


<script>
import ContentTreeMixin from "./mixins/contenttree"
// import ComponentLoading from "@/layouts/components/Loading";
// import ComponentError from "@/layouts/components/Error";
import ComponentStageEditor from "./components/StageEditor";
import ComponentContentTree  from "./components/ContentTree";

// import ApiService from "src/utils/xhr";
// import {mapGetters, mapActions} from 'vuex'

// const AsyncComponent = () => ({
//   // The component to load (should be a Promise)
//   component: import("./components/ComponentContentTree"),
//   // A component to use while the async component is loading
//   loading: ComponentLoading,
//   // A component to use if the load fails
//   error: ComponentError,
//   // Delay before showing the loading component. Default: 200ms.
//   delay: 20,
//   // The error component will be displayed if a timeout is
//   // provided and exceeded. Default: Infinity.
//   timeout: 3000
// })

export default {
    name: 'UserContentDefault',
    components: {
        // AsyncComponent,
        ComponentStageEditor,
        ComponentContentTree
        // 'AsyncComponent': () => import('./components/ContentTree.vue')
    },
    mixins: [ContentTreeMixin]
}
</script>
