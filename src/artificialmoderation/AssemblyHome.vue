<template>
<div class="justify-center center" >

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="right" role="1" amGroup='ongoingassemblyPage'
            :ongoing="$root.authenticated!==undefined && ongoing_assembly===null">
        <template>
            {{$t('content.assemblies.item.home', {'maxSteps': maxSteps}) }}
        </template>
    </ArtificialModerator>
                <!-- <div class="text-h6 q-mt-sm q-mb-xs">Ihre heutige Agenda umfasst {{assembly_stages.length}} Punkte:</div>
                <div class="text-caption" v-if="!assembly_stages">
                    Heute stehen für Sie keine Aufgaben an.
                </div>
                <div class="text-caption" v-if="assembly_stages">
                    Wie Sie wissen, gibt es in einer Fabrik viel zu tun. Das ist Ihre heutige Agenda:
                </div> -->

    </div>
</template>

<script>
import ArtificialModerator from './components/ArtificialModerator'
// import AssemblyMixin from 'src/pages/Assembly/mixins/assembly'

export default{
    name: "ArtificialModeratorAssemblyHome",
    components: {ArtificialModerator},
    // mixins: [AssemblyMixin],
    props: ['ongoing_assembly', 'maxSteps']
}
</script>
