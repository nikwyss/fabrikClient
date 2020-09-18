<template>
<div class="justify-center center" style="max-width:350px">

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1"
        i18n_path_prefix="showcase"
        amGroup='publicassemblyPage'
        :ongoing="ongoing">


        <!-- assembly is PUBLIC => Assuming that visitor likes to see the results -->
        <template v-if="nLength(published_assemblies)">
        {{$t('showcase.am.there_are_assemblies_in_public_state')}}
        </template>

        <!-- assembly is PUBLIC => Assuming that visitor likes to see the results -->
        <template v-if="!nLength(published_assemblies)">
        {{$t('showcase.am.no_assemblies_in_public_state')}}
        </template>

    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
import {mapGetters} from 'vuex'

export default{
    name: "ArtificialModeratorAssemblyListShowcase",
    props: ['ongoing', 'published_assemblies'],
    inject: ['clickAssemblyLink'],
    components: {ArtificialModerator},
}
</script>
