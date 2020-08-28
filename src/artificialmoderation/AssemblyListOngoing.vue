<template>
<div class="justify-center center" style="max-width:350px">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1" :amGroup="'ongoingassemblyPage'"
            :ongoing="IsThereAnAssemblyOngoing===null">

        <!-- Not authenticated && assembly is ONGOING => Assuming that visitor is a delegate -->
        <template v-if="!$root.authenticated && IsThereAnAssemblyOngoing === true">
        {{$t('content.assemblies.am.invitation_to_authenticate')}}
        </template>

        <!-- Already authenticated delegate -->
        <template  v-if="IsUserDelegateOfOngoingAssembly === true">
        {{$t('content.assemblies.am.there_are_assemblies_ongoing')}}
        </template>

        <!-- No ongoing and accesible assembly ongoing -->
        <template  v-if="IsThereAnAssemblyOngoing === false || IsUserDelegateOfOngoingAssembly === false">
        {{$t('content.assemblies.am.no_assemblies_accessible')}}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip size="md" icon="mdi-key-outline" v-if="!$root.authenticated && IsThereNothingGoingOn === false" outline  color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickAuthLink">
            {{ $t('auth.goto_authentication_form') }}
        </q-chip>
        </template>
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
            IsThereAnAssemblyOngoing: 'assemblystore/IsThereAnAssemblyOngoing',
            IsThereNothingGoingOn: 'assemblystore/IsThereNothingGoingOn',
            IsUserDelegateOfOngoingAssembly: 'assemblystore/IsUserDelegateOfOngoingAssembly',
        })
    },

    methods: {
        clickAssemblyLink: function (assembly) {
            var route = {name: 'assembly_home', params: {assemblyIdentifier: assembly.identifier}}
            console.assert(assembly)
            this.$router.push(route)
        },
        clickInitLink: function () {
            var route = { name: 'assemblies' }
            this.$router.push(route)
        },
        clickAuthLink: function () {
            var route = {name: 'assemblies'}
            route = this.$router.resolve(route)
            this.$session.redirect_to_provider(route.href)
        }
    }
}
</script>
