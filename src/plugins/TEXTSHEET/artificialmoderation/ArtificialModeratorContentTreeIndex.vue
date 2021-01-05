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
            v-if="startingContentNode.children.length < 2 && ABLY.assembly_acls.includes('contribute')"
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
export default{
    name: "ArtificialModeratorContentTreeIndex",
    // inject: ['ABLY', 'assemblyIdentifier', 'gotoAssemblyHome', 'clickGotoIndexAndMoveOn',
    //     'isSkippable', 'isNew', 'isLastStage', 'isCompleted', 'isAlert', 'isFirstStage'
    // ], // see provide attribute in the antecedents
    components: {ArtificialModerator},
    props: ['ongoing', 'startingContentNode'],
    inject: ['ABLY', 'popup_content_form'],
    methods: {
        popup_create () {
            this.popup_content_form('create', {parent_id: this.startingContentNode.id})
        }
    }
}
</script>
