<template>
<div class="justify-center center" style="max-width:350px">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1" :amGroup="'ongoingassemblyPage'"
            :ongoing="IsThereAnAssemblyOngoing===null">

        <!-- Not authenticated && assembly is ONGOING => Assuming that visitor is a delegate -->
        <!-- <template v-if="!oauth_authenticated && IsThereAnAssemblyOngoing === true">
        {{$t('assemblies.am.invitation_to_authenticate')}}
        </template> -->

        <!-- Already authenticated delegate -->
        <!-- <template  v-if="IsUserDelegateOfOngoingAssembly === true">
        {{$t('assemblies.am.there_are_assemblies_ongoing')}}
        </template> -->

        <!-- No ongoing and accesible assembly ongoing -->
        <template  v-if="oauth_authenticated && IsUserDelegateOfOngoingAssembly === false">
        {{$t('assemblies.am.no_assemblies_accessible')}}
        </template>

        <!-- No ongoing and accesible assembly ongoing -->
        <template  v-if="!oauth_authenticated && IsThereAnAssemblyOngoing === false">
        {{$t('assemblies.am.no_assemblies_accessible')}}
        </template>

        <!-- ACTION CHIPS -->
        <!-- <template  v-slot:actions>
        <q-chip size="md" icon="mdi-key-outline" v-if="!oauth_authenticated && IsThereNothingGoingOn === false" outline  color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickAuthLink">
            {{ $t('auth.goto_authentication_form') }}
        </q-chip>
        </template> -->
    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import {mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorAssemblyListOngoing",
    components: {ArtificialModerator},

    computed: {

        ...mapGetters({
            IsThereAnAssemblyOngoing: 'publicindexstore/IsThereAnAssemblyOngoing',
            IsThereNothingGoingOn: 'publicindexstore/IsThereNothingGoingOn',
            IsUserDelegateOfOngoingAssembly: 'publicindexstore/IsUserDelegateOfOngoingAssembly',
        })
    }
}
</script>
