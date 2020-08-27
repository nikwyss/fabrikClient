<template>
    <q-page class="doc_content">

        <div v-if="contenttree">

            <!-- DISABLED WARNING -->
            <q-banner dense inline-actions class="text-white bg-red" v-if="container.disabled" style="padding:2em; margin-bottom:1em;">
            This UserContent Container is disabled and, therefore, not visible for users.
            </q-banner>

            <!-- EDIT CONTENT -->
            <ComponentContainerEditor 
                v-if="acl.includes('manage')" 
                @syncstorecontainer="syncstorecontainer"
                :model="container" />

            <div class="text-h4">{{container.title}}</div>
            <!-- <div class="text-h4 q-mt-sm q-mb-xs">{{container.title}}</div> -->

            <p>{{container.info}}</p>
        </div>


        <!-- <component 
            v-bind:is="ComponentContentTree"  -->
            <!-- @syncstorecontent="syncstorecontent" -->

        <ComponentContentTree 
            :acl="acl"
            label="Offene Diskussion"
            :container="container" 
            :contenttree="contenttree" 
            :starting_content_id="starting_content_id" />
            
    </q-page>
</template>


<script>
import ContentTreeMixin from "./mixins/contenttree"
// import ComponentLoading from "@/layouts/components/Loading";
// import ComponentError from "@/layouts/components/Error";
import ComponentContainerEditor from "./components/ContainerEditor";
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
        ComponentContainerEditor,
        ComponentContentTree
        // 'AsyncComponent': () => import('./components/ContentTree.vue')
    },
    mixins: [ContentTreeMixin]
}
</script>
