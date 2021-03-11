<template>

  <q-dialog v-model="toolbar">
    <q-card class="full-width">

      <q-toolbar>
        <q-toolbar-title>Hintergrund</q-toolbar-title>

        <q-btn
          flat
          round
          dense
          icon="mdi-close"
          v-close-popup
        />

      </q-toolbar>

      <q-tabs
        v-model="tab"
        dense
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          name="content"
          label="Beitrag"
        />
        <q-tab
          name="creator"
          label="Autor"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
      >

        <!-- AUTHOR -->
        <q-tab-panel name="creator">
          <UserInfo :profile="profile" />
        </q-tab-panel>

        <!-- CONTENT -->
        <q-tab-panel name="content">
          <q-card-section v-if="S">
            <!-- STATS -->
            <q-list>

              <q-item>
                <q-item-section top>
                  <q-item-label>
                    Art des Beitrags
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  {{ content_type }}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section top>
                  <q-item-label>
                    Besitz-verhältnisse
                  </q-item-label>
                </q-item-section>

                <q-item-section side>

                  <q-item-label
                    lines="3"
                    class="text-right"
                    style="width:70%"
                  >
                    <span v-if="obj.content.locked">
                      Der Beitrag wurde von den Organisatoren blockiert. Es können keine Änderungen mehr vorgenommen werden.
                    </span>
                    <span v-else-if="obj.content.common_property">Der Beitrag gehört allen.</span>
                    <span v-else="!obj.content.common_property">Der Beitrag ist in Privatbesitz. Nur der Eigentümer kann ihn ändern oder löschen. </span>
                  </q-item-label>

                  <q-item-label
                    caption
                    v-if="permissions"
                    style="width:60%"
                    lines="2"
                    class="text-right"
                  > Sie können den Beitrag
                    {{permissions.join(", ")}}

                  </q-item-label>

                </q-item-section>

              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>
                    Erstellung
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  {{ obj.content.date_created | formatDate}}
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  Reichweite
                </q-item-section>

                <q-item-section side>
                  <q-item-label>{{S.PC}} {{ S.PC == 1 ? 'Teilnehmer.in' : 'Teilnehmer.innen'}}</q-item-label>
                </q-item-section>

              </q-item>

              <q-item>
                <q-item-section top>
                  Durchschnittliche Zustimmung
                </q-item-section>

                <q-item-section side>
                  <q-item-label>{{S.RC ? Math.round(S.RA) + '%' : '-'}}</q-item-label>
                  <q-item-label caption>({{S.RC}} Voten)</q-item-label>
                </q-item-section>

              </q-item>

              <q-item>
                <q-item-section top>
                  Beigemesssene Relevanz
                </q-item-section>

                <q-item-section side>
                  <q-item-label>{{S.SC && Number.isInteger(S.SA) ? Math.round(S.SA) + '%' : '-'}}</q-item-label>
                  <q-item-label caption>{{S.SC && Number.isInteger(S.SA) ? `(${S.SC} Voten)` : ''}}</q-item-label>
                </q-item-section>

              </q-item>

            </q-list>
          </q-card-section>
        </q-tab-panel>
      </q-tab-panels>

    </q-card>
  </q-dialog>

  <!-- </div> -->
  <!-- 
<div class="col-7">Revisions</div>
<div class="col-5">
@APS202 20.02.2020<br>
@EPU111 20.02.2020</div>
                    </div>
</div>
<div class="q-pa-md doc-contenttree" width="400px">
    <q-badge color="blue">Peer Review</q-badge>
    <div class="row items-start">
      <div class="col-7">Acceptance:</div>
      <div class="col-5">70%</div>
    </div>
    <div class="row items-start">
      <div class="col-7">Reviewers:</div>
      <div class="col-5">3</div>
    </div>
  </div>
<div class="q-pa-md doc-contenttree" width="400px">
    <q-badge color="blue">Overall Interactions</q-badge>
</q-btn> -->
</template>

<script>
import UserInfo from "src/layouts/components/UserInfo";

export default {
  name: "ContentBackground",
  props: ["obj"],
  components: { UserInfo },
  data() {
    return {
      profile: this.obj?.creator,
      toolbar: false,
      S: this.obj?.content.S,
      permissions: [
        this.obj.content.rate_permission ? "Bewerten" : "",
        this.obj.content.edit_permission ? "Beabeiten" : "",
        this.obj.content.append_permission ? "Kommentieren" : "",
        this.obj.content.delete_permission ? "Löschen" : "",
      ],
      tab: "content",
    };
  },

  computed: {
    content_type() {
      const type = this.obj?.content.type;
      switch (this.obj?.content.type) {
        case "COMMENT":
          return "Kommentar";
        default:
          return "CONTENT TYPE NOT TRANSLATED";
      }
    },
  },
};
</script>
