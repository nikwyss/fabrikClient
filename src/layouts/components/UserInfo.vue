<template>
  <div>

    <q-card-section>
      <q-list>

        <q-item>

          <q-item-section avatar>
            <q-avatar
              icon="mdi-image-filter-hdr"
              :style="{ 'background-color': profile ? profile.CO: 'inherit'}"
              :text-color="profile ? 'white' : 'primary'"
              class="q-mr-sm"
            >
            </q-avatar>
          </q-item-section>
          <div style="width:80%"><span class="text-bold">{{username}}</span>, {{ username_derivation }}</div>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>
              Plattform-Besuche
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>
              An {{S.DAYS}} {{S.DAYS===1 ? 'Tag' : 'Tagen'}}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>
              Letzte Aktivität
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>
              vor {{S.DLI}} {{S.DLI===1 ? 'Tag' : 'Tagen'}}
            </q-item-label>
          </q-item-section>

        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label>
              Bewertungen
            </q-item-label>
            <q-item-label caption>
              (Relevanz und Zustimmung)
            </q-item-label>
          </q-item-section>

          <q-item-section
            side
            top
          >
            <q-item-label>
              {{S.CRC}} {{S.CRC===1 ? 'Bewertung' : 'Bewertungen'}}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>

          <q-item-section>
            <q-item-label>
              Eigene Beiträge
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>
              {{S.CCC}} {{S.CCC===1 ? 'Eigenen Beitrag' : 'Eigene Beiträge'}}
            </q-item-label>
          </q-item-section>

        </q-item>

        <q-item>
          <q-item-section top>
            <q-item-label>
              Durchschnittlich erhaltene Zustimmung
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-item-label>{{S.RSC && Number.isInteger(S.RSA) ? Math.round(S.RSA) + '%' : '-'}}</q-item-label>
            <q-item-label caption>{{S.RSC && Number.isInteger(S.RSA) ? `(${S.RSC} Voten)`: ''}}</q-item-label>
          </q-item-section>

        </q-item>

      </q-list>
    </q-card-section>
  </div>
</template>

<script>
export default {
  name: "UserInfo",
  props: ["profile"],

  data() {
    return {
      toolbar: false,
      S: this.profile.S,
    };
  },

  computed: {
    username() {
      return this.$root.username(this.profile);
    },

    username_derivation: function () {
      return this.$root.username_derivation(this.profile, true);
    },
  },
};
</script>
