<template>
  <div class="row items-center no-wrap">
    <q-avatar
      icon="mdi-image-filter-hdr"
      :style="{ 'background-color': profile ? profile.color: 'inherit'}"
      :text-color="profile ? 'white' : 'primary'"
      class="q-ma-sm"
    >
      <!-- {{letters}} -->
    </q-avatar>
    <div
      class="text-center"
      v-if="profile"
    >
      <q-item-section>
        <q-item-label
          v-if="menu"
          caption
        >{{ $t('auth.registered_as') }}</q-item-label>
        <q-item-label>{{profile.username}}</q-item-label>
      </q-item-section>
    </div>
  </div>
</template>

<script>
export default {
  // name: 'ComponentName',
  props: ["profile", "menu"],
  computed: {
    letters() {
      var matches = this.profile.username.match(/\b(\w)/g);
      return matches.join("");
    },
  },
};
</script>
