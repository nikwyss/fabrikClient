<template>
  <q-chip
    :size="size"
    :icon="icon"
    outline
    color="#EEE"
    clickable
    @click="$emit('click')"
  >
    {{ label }}
    <!--
    class="
    bg-white
    cursor-pointer"
    -->

  </q-chip>
</template>

<script>
export default {
  name: "Button",
  props: {
    // Basic type check (`null` and `undefined` values will pass any type validation)
    label: {
      type: String,
      required: true,
    },
    icon: [String],
    size: {
      type: String,
      // required: true
      default: "md",
    },
  },
};
</script>
