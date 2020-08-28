<template>
    <q-page class="doc_content">

        <div v-if="assembly">

                <q-btn align="around" 
                    class="btn-fixed-width" color="brown-5" 
                    label="Back to the list of assemblies"
                    icon="mdi-arrow-left" 
                    @click="clickBackToAssemblyListButton"/>

            <q-card class="my-card" flat>
            <q-card-section >
                <!-- <div class="text-overline">Der Bürgerkonvent</div> -->
                <div class="text-h4 q-mt-sm q-mb-xs">Der Bürgerkonvent zur {{assembly.title}}</div>
            </q-card-section>
            </q-card>

                <!-- <div class="text-h6 q-mt-sm q-mb-xs">Ihre heutige Agenda umfasst {{assembly_containers.length}} Punkte:</div>
                <div class="text-caption" v-if="!assembly_containers">
                    Heute stehen für Sie keine Aufgaben an.
                </div>
                <div class="text-caption" v-if="assembly_containers">
                    Wie Sie wissen, gibt es in einer Fabrik viel zu tun. Das ist Ihre heutige Agenda:
                </div> -->

                <!-- v-if="!step" -->
            <q-chat-message
                class="artificialmoderation"
                size=8
                avatar="~assets/actor1.png"
                :text="[`Heute sind ${max_steps} Punkte auf Ihrer Agenda.`]"
            />

        </div>


        <q-stepper
            v-if="assembly && assembly_containers"
            v-model="step"
            vertical
            flat
            ref="stepper"
            alternative-labels
            :header-nav="true"
            color="primary"
            active-color="deep-orange"
            done-color="secondary"
            >

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

                <ComponentContainerEditor :key="'AE' + key"  v-if="assembly.acl.includes('manage') && step==key" :assembly="assembly" :model="item"/>

                <!-- AGENDA ITEM -->
                <q-card flat>

                    <q-separator />

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
                                    class="artificialmoderation"
                                    size=4
                                    avatar="~assets/actor2.png"
                                    :text="[item.container.am_instruction]"
                                />
                        </div>
                    </div>

                    </q-card-section>

                    <q-separator />

                    <q-card-actions>
                    <q-card-section class="q-pt-none">
                    <!-- <div class="text-subtitle1">
                        Bis am 23.07.2020 zugänglich.
                    </div> -->
                    <div class="text-caption text-grey">
                        Bisher haben sich 400 Teilnehmende hier beteiligt.
                    </div>
                    </q-card-section>
                    <q-space />
                        <!-- <q-btn color="" 
                            size="1em" icon="mdi-chevron-down" round  
                            @click="$refs.stepper.next()"
                            v-if="step < Object.keys(assembly_containers).length"
                            class="text-black"/> -->
                    </q-card-actions>
                    <q-separator />
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

export default {
    name: 'PageAssemblyHome',
    components: {ComponentContainerEditor},
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
