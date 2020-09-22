<template>
<div class="justify-center center">

    <!-- RIGHT SIDE:  -->
    <!-- <div align="right"> -->
    <ArtificialModerator alignment="right" role="1" amGroup='textsheetPage' :ongoing="ongoing">

        <template v-if="isNew(ABLY.routedStage) &&  !isCompleted(ABLY.routedStage)">
            {{ isFirstStage(ABLY.routedStage) ? $t('index.am.new_visit_first_stage') : $t('index.am.new_visit') }}
        </template>
        <template v-if="!isNew(ABLY.routedStage) &&  isCompleted(ABLY.routedStage)">
            {{$t('index.am.completed') }}
        </template>
        <template v-if="!isNew(ABLY.routedStage) &&  !isCompleted(ABLY.routedStage)">
            {{$t('index.am.already_seen') }}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip v-if="!isNew(ABLY.routedStage)" icon="mdi-arrow-left" clickable 
                @click="clickGotoIndexAndMoveOn(ABLY.routedStage)">
            {{ $t('index.leave_a_preliminary_completed_stage') }}
        </q-chip>
        </template>
    </ArtificialModerator>
      <!-- </div> -->
    </div>
</template>

<script>
import ArtificialModerator from 'src/artificialmoderation/components/ArtificialModerator'

export default{
    name: "ArtificialModeratorTEXTSHEETMain",
    inject: ['ABLY', 'assemblyIdentifier', 'gotoAssemblyHome', 'clickGotoIndexAndMoveOn',
        'isSkippable', 'isNew', 'isLastStage', 'isCompleted', 'isAlert', 'isFirstStage'
    ], // see provide attribute in the antecedents
    components: {ArtificialModerator},
    props: ['ongoing'],
}
</script>
