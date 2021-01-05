<template>
<div class="justify-center center" >

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1" amGroup='ongoingassemblyPage'
            :ongoing="ongoing">
        <template v-if="ABLY.numberOfScheduledStages==ABLY.numberOfStages">
            {{$tc('stages.am.welcome_full_schedule', ABLY.numberOfStages, {'numberOfStages': ABLY.numberOfStages}) }}
        </template>
        <template v-if="ABLY.numberOfScheduledStages>0 && ABLY.numberOfScheduledStages<ABLY.numberOfStages">
            {{$tc('stages.am.welcome_partial_schedule', ABLY.numberOfStages, {
                'numberOfStages': ABLY.numberOfStages,
                'numberOfScheduledStages': ABLY.numberOfScheduledStages})
            }}
        </template>
        <template v-if="ABLY.numberOfScheduledStages==0">
            {{$t('stages.am.welcome_empty_schedule', {'numberOfStages': ABLY.numberOfStages}) }}
        </template>
    </ArtificialModerator>
    </div>

</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'

export default{
    name: "ArtificialModeratorAssemblyHome",
    components: {ArtificialModerator},
    inject: ['ABLY'], // see provide attribute in the antecedents
    props: ['ongoing']
}
</script>
