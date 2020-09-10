<template>

<Fragment>
 <q-dialog v-model="peerreview_small"  position="bottom" seamless  >
   <q-card style="width: 350px" @click="peerreview_small=false; peerreview_large=true;">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-h5 text-black"><q-icon name="mdi-scale-balance" /> Schiedsgericht</div>
            <div class="text-grey">Wir brauchen Ihr Urteil als Staatsbürger.</div>
          </div>

          <q-space />

        </q-card-section>
      </q-card>
    </q-dialog> 

   <q-dialog v-model="peerreview_large" persistent position="top" class="q-ma-lg">
    <!-- position="bottom" seamless-->

   <!-- <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-white">
          <!-- <q-toolbar>
            <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar> -->
        <!-- </q-header> --> -->

        <!-- <q-footer class="bg-black text-white">
          <q-toolbar inset>
            <q-toolbar-title>Footer</q-toolbar-title>
          </q-toolbar>
        </q-footer> -->

    <!-- <q-page-container>
          <q-page padding>  -->

         
            <q-card class="my-card q-pa-lg q-ma-lg" flat >
        
              <!-- <q-card-se ction> -->
              <div class="text-h5 text-black"><q-icon name="mdi-scale-balance" /> Schiedsgericht</div>

            <p>Wir brauchen Ihr Urteil als Staatsbürger.<br /></p>
                <p>Kommissionsmitglied XYZ möchte ein neues Pro-Argument einfügen</p>

                <div class="text-h5 q-mt-sm q-mb-xs text-orange-9">Title</div>
                <div class="text-caption  text-orange-9">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </div>
              
                <p>
                  Was halten Sie von diesem Vorschlag: 
                  <!-- Halten Sie ihn für nachvollziebar und zweckdienlich? -->
                  Hilft er möglicherweise anderen Leute ein umfassendes Bild über das Thema zu machen?
                </p>
              
              <!-- </q-card-section> -->

              <b>Entscheidungskriterien:</b>

              <div>
                <q-list bordered class="rounded-borders">

                    <q-expansion-item
                    expand-separator
                    group="somegroup"
                    icon="mdi-format-text-rotation-none"
                    label="Gehaltvoll."
                    caption="Ist der Vorschlag für eine breite Öffentlichkeit von Belang?"
                  >
                    <q-card>
                      <q-card-section  horizontal>
                        Lehnen Sie den Vorschlag ab, wenn er keine sachdienlichen Informationen enthält.
                        <q-card-section>
                              <q-toggle label="Gehaltvoll" class="q-mb-md" />
                        </q-card-section>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>


                  <q-expansion-item
                    expand-separator
                    group="somegroup"
                    icon="mdi-format-text-rotation-none"
                    label="Sprachliche Qualität."
                    caption="Ist der Vorschlag verständlich und höflich geschrieben?"
                  >
                    <q-card>
                      <q-card-section  horizontal>
                        Lehnen Sie den Vorschlag ab, wenn er unverständlich ist sowie wenn er beleidigende Äusserungen enthält.
                        <q-card-section>
                              <q-toggle label="Unhöflich" class="q-mb-md" />
                              <q-toggle label="Unverständlich" class="q-mb-md" />
                        </q-card-section>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <q-expansion-item
                    expand-separator
                    group="somegroup"
                    icon="mdi-content-duplicate"
                    label="Duplikat"
                    caption="Ist der Vorschlag bereits in einer ähnlichen Form vorhanden?"
                  >
                    <q-card>
                      <q-card-section>
                      Lehnen Sie den Vorschlag ab, wenn er sich inhaltlich mit den folgenden bereits bestehenden Argumenten stark überschneidet.

                            <q-item>
                              <q-item-section avatar top>
                                <q-item-label lines="1" class="q-mt-sm">Pro-Argument</q-item-label>
                              </q-item-section>
                              <q-item-section top>
                                <q-item-label lines="1">
                                  <span class="text-grey-8"> Irgendwas...</span>
                                </q-item-label>
                              </q-item-section>
                            </q-item>
                            <q-item>
                              <q-item-section avatar top>
                                <q-item-label lines="1" class="q-mt-sm">Pro-Argument</q-item-label>
                              </q-item-section>
                              <q-item-section top>
                                <q-item-label lines="1">
                                  <span class="text-grey-8"> Irgendwas anderes...</span>
                                </q-item-label>
                              </q-item-section>
                            </q-item>

                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <q-expansion-item
                    expand-separator
                    icon="mdi-map-marker"
                    group="somegroup"
                    label="Kontext"
                    caption="Ist der Beitrag am richtigen Ort?"
                    header-class="text-purple"
                  >
                    <q-card>
                      <q-card-section>
                      Lehnen Sie den Vorschlag ab, wenn dieser Beitrag an diesem Ort nicht wirklich Sinn macht.
                            
                            <q-item>
                              <q-item-section avatar top>
                                <q-item-label lines="1" class="q-mt-sm">Container</q-item-label>
                              </q-item-section>
                              <q-item-section top>
                                <q-item-label lines="1">
                                  <span class="text-grey-8"> Pro und Kontra.</span>
                                </q-item-label>
                              </q-item-section>
                            </q-item>

                            <q-item>
                              <q-item-section avatar top>
                                <q-item-label lines="1" class="q-mt-sm">Beitrag</q-item-label>
                              </q-item-section>
                              <q-item-section top>
                                <q-item-label lines="1">
                                  <span class="text-grey-8"> Pro-Argument XCZ.</span>
                                </q-item-label>
                              </q-item-section>
                            </q-item>

                      </q-card-section>
                    </q-card>
                  </q-expansion-item>

                  <q-expansion-item 
                      icon="mdi-toy-brick-outline" 
                      group="somegroup"
                      label="Weitere Überlegungen"
                      caption="Gibt es weitere Überlegungen, die die anderen SchiedsrichterInnen interessieren könnten?">

                    <q-card>
                      <q-card-section>
                      Teilen Sie die Überlegungen bitte hier mit?

                          <q-input outlined v-model="text" label="Warum lehnen Sie den Vorschlag ab oder warum stimmen Sie ihm zu. Bitte begründen Sie!" />

                          Die Kommentare der anderen Kommissionsmitgliedern:<br>
                              <q-item>
                                <q-item-section avatar top>
                                  <q-icon name="mdi-chat" color="black" size="34px" />
                                </q-item-section>

                                <q-item-section top>
                                  <q-item-label class="q-mt-sm">Kommissionsmitglied 1CVS</q-item-label>
                                  <q-item-label lines="1">
                                    <span class="text-grey-8"> - So ein Beitrag ist schon vorhanden.</span>
                                  </q-item-label>
                                </q-item-section>
                              </q-item>

                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </q-list>
              </div> 
              

              <q-card-actions>

                <q-space />
                <q-btn class="q-pa-sm" color="red" label="Ablehnen" />
                <q-btn class="q-pa-sm" color="brown" label="Überarbeitung nötig" />
                <q-btn class="q-pa-sm" color="green" label="Annehmen" />
              </q-card-actions>

            </q-card>

        <!-- </q-page>  
        </q-page-container>
    </q-layout> -->

    </q-dialog>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'

export default {
  name: "ContainerPeerReview",
  props: ["containerID"],
  components: {Fragment},
  
  computed: {
    contentSize () {
      return this.moreContent ? 150 : 5
    }
  },

  data () {
    return {
      peerreview_small: false,
      peerreview_large: false,
      slide: 'style',
      lorem: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.'
    }
  },

  mounted: function() {
    this.peerreview_small = true;
  }
}
</script>
