<template>
    <q-page class="doc_content">


        <div v-if="assembly">

            <!-- <h2>Die BürgerInnenversammlung zur {{assembly.title}}</h2> -->

            <div class="text-subtitle2">{{$t('content.assemblies.item.subtitle')}}</div>
            <h2>Bürger-Standpunkt zur {{assembly.title}}</h2>
            <span>{{assembly.info}}</span>

        </div>

        <ArtificialModeratorAssemblyHome :ongoing_assembly="assembly" align="right" />


        <q-stepper
            v-if="assembly && assembly_containers"
            v-model="step"
            vertical
            flat
            ref="stepper"
            active-color="accent"
            done-color="secondary"
            >
            <!-- alternative-labels
            :header-nav="true"
            color="primary" -->

            <q-step
                v-for="(item, key) in sorted_containers"
                :key="Number(key)"
                :icon="item.icon ? item.container.icon : 'mdi-folder'"
                :active-icon="item.icon ? item.container.icon : 'mdi-folder'"
                :done-icon="item.icon ? item.container.icon : 'mdi-folder'"
                :name="Number(key)"
                :title="getStepTitle(item, key)"
                :done="isDone(item, key)"
                :disabled="isDisabled(item)"
            >

                <ComponentContainerEditor :key="`AE${key}`"  v-if="assembly.acl.includes('manage') && step==key" :assembly="assembly" :model="item"/>

                <!-- AGENDA ITEM -->
                <q-card flat>


                    <q-card-section class="q-pa-sm" style="min-height:7em;" >

                        <q-btn
                        round
                        class="float-right"
                        external-label
                        v-if="step > 1"
                        icon="mdi-chevron-up"
                        @click.prevent="$refs.stepper.previous()">
                        </q-btn>

                        <span  class="col text-h6">{{item.container.title}}</span>
                        <div class="text-subtitle1" v-html="item.container.info" />
                    
                    </q-card-section>

                    <!-- <q-separator class="q-mr-lg" /> -->
                    
                    <q-card-section>
                    <q-btn
                        @click.prevent="clickPluginLink(item)"
                        color="positive"
                        flat
                        size='lg'
                        icon="mdi-door-open"
                        label="Enter"
                        class="absolute q-ma-lg q-pa-lg"
                        style="top: 0; right: 0px; "
                    />
                        <!-- transform: translateY(-50%); -->
                    
                    <div class="row no-wrap items-center">
                        <div class="col ">

                                    <!-- name="Moderatorin Sophie" -->
                             <q-chat-message
                                    class="artificddddialmoderation"
                                    size=4
                                    avatar="~assets/actor2.png"
                                    :text="[item.container.am_instruction]"
                                />
                        </div>
                    </div>

                    </q-card-section>


                    <q-card-section class="q-pt-none">
                        <div class="text-caption text-grey">
                            Bisher haben sich 400 Teilnehmende hier beteiligt.
                        </div>
                    </q-card-section>

                </q-card>
            </q-step>
        </q-stepper>

    </div>

    <ComponentContainerEditor v-if="assembly && assembly.acl.includes('manage')" :assembly="assembly" />
</q-page>
</template>


  <script>
import AssemblyMixin from "./mixins/assembly"
import ComponentContainerEditor from "src/pages/UserContent/components/ContainerEditor";
import { mapGetters, mapActions } from 'vuex'
import ArtificialModeratorAssemblyHome from 'src/artificialmoderation/AssemblyHome'

export default {
    name: 'PageAssemblyHome',
    components: {ComponentContainerEditor, ArtificialModeratorAssemblyHome },
    mixins: [AssemblyMixin],
    computed: {
        max_steps: function() {
            return(Object.keys(this.assembly_containers).length)
        },

        sorted_containers: function() {
            // Object.values(assembly_containers).sort((a, b) => a.container.order_position.localeCompare(b.container.order_position))
            console.log(this.assembly_containers)
            let sorted = Object.values(this.assembly_containers).sort((a, b) => a.container.order_position < b.container.order_position ? -1 : a.container.order_position > b.container.order_position ? 1 : 0)
            return(sorted)
        },
        step: {
            get: function() {
                return(this.get_current_containerID(this.assembly.identifier))
            },
            set: function(step) {
                this.set_current_containerID({assembly: this.assembly, containerID: step})
            },
        },
        ...mapGetters({get_current_containerID: 'assemblystore/get_current_containerID'})
    },

    methods: {
     
        clickBackToAssemblyListButton: function () {
            this.set_current_assemblyIdentifier(null)
            this.$router.push ({ name: 'assemblies' })
        },
        
        getStepTitle: function (item, key) {
            var title = item.container.title

            if(item.container.disabled) {
                title +=  ' [DISABLED]'
            }

            if("deleted" in item.container && item.container.deleted) {
                title +=  ' [DELETED]'
            }

            // PREFIX
            title = `${key+1}/${this.max_steps} ${title}`

            return(title)
        },
        isDone: function (item, key) {
            return(this.step >=key)
        },
        isDisabled: function (item) {
            // only admins see deleted attribute.
            return(("disabled" in item.container && item.container.disabled) || ("deleted" in item.container && item.container.deleted))
        },

        clickPluginLink: function (item) {
            console.log("clickPluginLink")
            var assemblyIdentifier = this.$route.params.assemblyIdentifier
            var params = {assemblyIdentifier: assemblyIdentifier}
            params["containerID"] = item.container.id
            this.$router.push({name: item.container.type, params: params})
        },
        ...mapActions({set_current_containerID: 'assemblystore/set_current_containerID'})
    }
}
</script>
