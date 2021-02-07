<template>
<div class="justify-center center">
    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="2" amGroup='textsheetPage' :ongoing="ongoing">

        <template>
            {{ $tc('contenttree.am.index', startingContentNode.children.length) }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip
            v-if="startingContentNode.children.length < 2 && IsContributor"
            icon="mdi-tooltip-plus-outline" clickable @click="popup_create">
            {{ $t('contenttree.add_comment_or_question') }}
        </q-chip>
        </template>
    </ArtificialModerator>
      <!-- </div> -->
    </div>
</template>

<script>
import ArtificialModerator from 'src/artificialmoderation/components/ArtificialModerator'
import { mapGetters } from "vuex";

export default{
    name: "ArtificialModeratorContentTreeIndex",
    components: {ArtificialModerator},
    props: ['ongoing', 'startingContentNode'],
    inject: ['popup_content_form'],
    computed: {
        // assemblyAcls: function () {
        //     return this.oauth.acls(assemblyIdentifier);
        // },
      ...mapGetters(
        'assemblystore', ['IsDelegate',  'IsExpert', 'IsContributor', 'IsObserver', 'IsManager']
      )
    },
    methods: {
        popup_create () {
            this.popup_content_form('create', {parent_id: this.startingContentNode.id})
        }
    }
}
</script>
