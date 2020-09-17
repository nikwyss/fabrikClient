<template>
<div class="justify-center center" style="max-width:350px">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="1" 
        amGroup='publicassemblyPage'
        v-if="oauth_authenticated"
        :ongoing="assembly===null">

        <!-- First Time Entering -->
        <!-- <template v-else-if="assembly_acls.includes('observe')"> -->
        <template v-if="assembly !== null && assembly.is_public === true">
        {{$t('content.showcase.am.there_are_assemblies_in_public_state')}}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip size="md" icon="mdi-forward" outline color="primary" text-color="primary" class="bg-white cursor-pointer" clickable @click="clickAssemblyLink">
            {{$t('content.showcase.am.chip_please_enter')}}
        </q-chip>
        </template>

    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import AssemblyMixin from 'src/mixins/assembly'

export default{
    name: "ArtificialModeratorAssemblyListShowcaseSelection",
    components: {ArtificialModerator},
    mixins: [AssemblyMixin],
    props: ['public_assembly'],


    methods: {
        clickAssemblyLink: function () {
            var route = {name: 'assembly_home', params: {assemblyIdentifier: this.public_assembly.identifier}}
            console.assert(this.public_assembly)
            this.$router.push(route)
        }
    }
}
</script>
