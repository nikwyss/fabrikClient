<template>
<span>
      <q-chip clickable @click="showDisclaimer = !showDisclaimer" align="right" icon="mdi-monitor-clean">
          {{ $t('disclaimer.btnLabel') }}
      </q-chip>
      <q-banner align="justify" v-if="showDisclaimer" class="bg-grey-3">
        <span class="text-weight-thin">{{ text }}</span>
      </q-banner> 
</span>
</template>

<script>
export default {
  data() {
    return {
      showDisclaimer: false
    }
  },
  props: ['text'],
}
</script>