<script setup lang="ts">
/** Demo: SnMention — textarea variant. */
import { ref } from 'vue';
import { SnMention } from '@snui/vue-web';
const value = ref('');
const options = ['Requirement review', 'Tech review', 'Release plan'];
</script>

<template>
  <SnMention
    v-model="value"
    type="textarea"
    :rows="3"
    :options="options"
    placeholder="Type @ to mention in the comment (multi-line)"
    style="width: 320px"
  />
</template>
