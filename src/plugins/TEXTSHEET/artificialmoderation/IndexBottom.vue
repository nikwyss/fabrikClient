<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='textsheetPage' :ongoing="ongoing">

        <template v-if="isLastStage(ABLY.routedStage)">
            {{$t('index.am.button_end_of_page_on_last_stage') }}
        </template>
        <template v-else>
            {{$t('index.am.button_end_of_page_on_early_stage') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="isLastStage(ABLY.routedStage)" icon="mdi-arrow-left" clickable 
                @click="clickGotoIndexAndMoveOn">
            {{ $t('index.button_end_of_page_on_last_stage') }}
        </q-chip>
        <q-chip v-else icon="mdi-arrow-left" clickable 
                @click="clickGotoIndexAndMoveOn">
            {{ $t('index.button_end_of_page_on_early_stage') }}
        </q-chip>
        </template>
    </ArtificialModerator>
      <!-- </div> -->
    </div>
</template>

<script>
import ArtificialModerator from 'src/artificialmoderation/components/ArtificialModerator'

export default{
    name: "ArtificialModeratorIndexBottom",
    inject: ['ABLY', 'clickGotoIndexAndMoveOn', 'isLastStage'], // see provide attribute in the antecedents
    components: {ArtificialModerator},
    props: ['ongoing'],
}
</script>
