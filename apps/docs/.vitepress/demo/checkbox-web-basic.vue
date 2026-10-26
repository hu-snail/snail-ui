<script setup lang="ts">
/** Demo: SnCheckbox — basic v-model + label. */
import { ref } from 'vue';
import { SnCheckbox } from '@snui/vue-web';

const checked = ref(true);
</script>

<template>
  <SnCheckbox v-model="checked" label="订阅周报">checked = {{ checked }}</SnCheckbox>
</template>
