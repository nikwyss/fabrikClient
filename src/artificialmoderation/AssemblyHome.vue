<template>
<div class="justify-center center" >

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1" amGroup='ongoingassemblyPage'
            :ongoing="oauth_authenticated!==undefined || ongoing">
        <template>
            {{$t('content.assemblies.item.home', {'maxSteps': maxSteps}) }}
        </template>
    </ArtificialModerator>

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
// import AssemblyMixin from 'src/mixins/assembly'

export default{
    name: "ArtificialModeratorAssemblyHome",
    components: {ArtificialModerator},
    // mixins: [AssemblyMixin],
    props: ['maxSteps']
}
</script>
