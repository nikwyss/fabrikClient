<template>
<div class="items-center" style="display: inline-flex;">
  <q-avatar
      icon="mdi-image-filter-hdr"
      :style="{ 'background-color': profile ? profile.CO: 'inherit'}"
      :text-color="profile ? 'white' : 'primary'"
      class="q-ma-sm"
    >
      <!-- {{letters}} -->
    </q-avatar>
    <!-- <div
      class="text-center"
      v-if="profile"
    > -->
      <q-item-section>
        <q-item-label
          v-if="menu"
          caption
        >{{ $t('auth.registered_as') }}</q-item-label>
        <q-item-label>{{profile ? profile.U: 'Anonymous'}}  <slot name="extrainfos"></slot>
        </q-item-label>
      </q-item-section>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: ["profile", "menu"]
};
</script>
