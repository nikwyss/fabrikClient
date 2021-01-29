<template>
<div class="justify-center center" style="max-width:350px">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="1" 
        amGroup='publicassemblyPage'
        :ongoing="assembly===null || oauth.authorized===null">

        <!-- First Time Entering -->
        <template v-if="assembly !== null && assembly.is_public === true">
        {{$t('showcase.am.there_are_assemblies_in_public_state')}}
        </template>

        <!-- ACTION CHIPS -->
        <template  v-slot:actions>
        <q-chip size="md" icon="mdi-forward" outline color="primary" text-color="primary" 
                class="bg-white cursor-pointer" clickable 
                @click="clickAssemblyLink(assembly)">
            {{$t('showcase.am.chip_please_enter')}}
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
    props: ['assembly']

}
</script>
