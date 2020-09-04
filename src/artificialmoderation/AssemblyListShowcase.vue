<template>
<div class="justify-center center" style="max-width:350px">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1"
        i18n_path_prefix="content.showcase"
        amGroup='publicassemblyPage'
        :ongoing_request="IsThereAnAssemblyInPublicState === null">

        <!-- assembly is PUBLIC => Assuming that visitor likes to see the results -->
        <template v-if="IsThereAnAssemblyInPublicState === true">
        {{$t('content.showcase.am.there_are_assemblies_in_public_state')}}
        </template>

        <!-- assembly is PUBLIC => Assuming that visitor likes to see the results -->
        <template v-if="IsThereAnAssemblyInPublicState === false">
        {{$t('content.showcase.am.no_assemblies_in_public_state')}}
        </template>

    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import {mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorAssemblyListShowcase",
    components: {ArtificialModerator},
    computed: {
        ...mapGetters({
            IsThereAnAssemblyInPublicState: 'assemblystore/IsThereAnAssemblyInPublicState'
        })
    },
    methods: {
        clickAssemblyLink: function (assembly) {
            var route = {name: 'assembly_home', params: {assemblyIdentifier: assembly.identifier}}
            console.assert(assembly)
            this.$router.push(route)
        }
    }
}
</script>
