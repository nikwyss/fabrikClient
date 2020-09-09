<template>
<div class="justify-center center" >

    <!-- RIGHT SIDE:  -->
    <ArtificialModerator alignment="left" role="2" amGroup='ongoingassemblyPage'
            :ongoing="$root.authenticated!==undefined && ongoing_assembly===null">
        <template>
            {{$t('content.assemblies.item.home', {'max_steps': max_steps}) }}
        </template>
    </ArtificialModerator>

                <!-- <div class="text-h6 q-mt-sm q-mb-xs">Ihre heutige Agenda umfasst {{assembly_containers.length}} Punkte:</div>
                <div class="text-caption" v-if="!assembly_containers">
                    Heute stehen für Sie keine Aufgaben an.
                </div>
                <div class="text-caption" v-if="assembly_containers">
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
    props: ['ongoing_assembly'],

    computed: {
        'max_steps': function() { return(2) }
    }
}
</script>
