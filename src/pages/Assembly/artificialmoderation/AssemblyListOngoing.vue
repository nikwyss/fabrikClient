<template>
<div class="justify-center center" style="max-width:350px">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1" :amGroup="'ongoingassemblyPage'"
            :ongoing="IsThereAnAssemblyOngoing===null">

        <!-- Not authenticated && assembly is ONGOING => Assuming that visitor is a delegate -->
        <!-- <template v-if="!oauth.authorized && IsThereAnAssemblyOngoing === true">
        {{$t('assemblies.am.invitation_to_authenticate')}}
        </template> -->

        <!-- Already authenticated delegate -->
        <!-- <template  v-if="IsUserDelegateOfOngoingAssembly === true">
        {{$t('assemblies.am.there_are_assemblies_ongoing')}}
        </template> -->

        <!-- No ongoing and accesible assembly ongoing -->
        <template  v-if="oauth.authorized && IsUserDelegateOfOngoingAssembly === false">
        {{$t('assemblies.am.no_assemblies_accessible')}}
        </template>

        <!-- No ongoing and accesible assembly ongoing -->
        <template  v-if="!oauth.authorized && IsThereAnAssemblyOngoing === false">
        {{$t('assemblies.am.no_assemblies_accessible')}}
        </template>

    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from 'src/components/ArtificialModerator'
import {mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorAssemblyListOngoing",
    components: {ArtificialModerator},

    computed: {

     ...mapGetters( 
         'publicindexstore', 
        ['IsUserDelegateOfOngoingAssembly', 'IsThereAnAssemblyOngoing', 'IsThereNothingGoingOn'])  
    }
}
</script>
