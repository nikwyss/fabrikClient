<template>
<div class="justify-center center" >
    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1" amGroup='ongoingassemblyPage' :ongoing="ongoing">
        <template v-if="assembly_scheduled_stages.length==assembly_sorted_stages.length">
            {{$tc('stages.am.welcome_full_schedule', assembly_sorted_stages.length, {'numberOfStages': assembly_sorted_stages.length}) }}
        </template>
        <template v-if="assembly_scheduled_stages.length && assembly_scheduled_stages.length < assembly_sorted_stages.length">
            {{$tc('stages.am.welcome_partial_schedule', assembly_sorted_stages.length, {
                'numberOfStages': assembly_sorted_stages.length,
                'numberOfScheduledStages': assembly_scheduled_stages.length})
            }}
        </template>
        <template v-if="assembly_scheduled_stages.length==0">
            {{$t('stages.am.welcome_empty_schedule', {'numberOfStages': assembly_sorted_stages.length}) }}
        </template>
    </ArtificialModerator>
    </div>

</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import { mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorAssemblyHome",
    components: {ArtificialModerator},
    computed: {
        
        ongoing: function() {
            return !this.assembly_sorted_stages || !this.oauth.authorized
        },

        ...mapGetters(
        'assemblystore', ['assembly_scheduled_stages',  'assembly_sorted_stages']
        )
    } // see provide attribute in the antecedents
}
</script>
