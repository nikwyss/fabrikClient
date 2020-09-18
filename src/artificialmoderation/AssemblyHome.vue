<template>
<div class="justify-center center" >

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1" amGroup='ongoingassemblyPage'
            :ongoing="ongoing">
        <template v-if="injects.numberOfScheduledStages==injects.numberOfStages">
            {{$tc('stages.am.welcome_full_schedule', injects.numberOfStages, {'numberOfStages': injects.numberOfStages}) }}
        </template>
        <template v-if="injects.numberOfScheduledStages>0 && injects.numberOfScheduledStages<injects.numberOfStages">
            {{$tc('stages.am.welcome_partial_schedule', injects.numberOfStages, {
                'numberOfStages': injects.numberOfStages,
                'numberOfScheduledStages': injects.numberOfScheduledStages})
            }}
        </template>
        <template v-if="injects.numberOfScheduledStages==0">
            {{$t('stages.am.welcome_empty_schedule', {'numberOfStages': injects.numberOfStages}) }}
        </template>
    </ArtificialModerator>
    </div>

</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'

export default{
    name: "ArtificialModeratorAssemblyHome",
    components: {ArtificialModerator},
    inject: ['injects'], // see provide attribute in the antecedents
    props: ['ongoing']
}
</script>
