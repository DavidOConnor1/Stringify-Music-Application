<script setup>
import { defineProps } from "vue";

defineProps({
  bg: {
    type: String,
    default: "bg-black/30",
  },
});
</script>

<template>
  <div
    :class="`${bg} backdrop-blur-sm rounded-lg p-3 hover:bg-black/50 transition `"
  >
    <slot> </slot>
  </div>
</template>
