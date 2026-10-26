<script setup lang="ts">
/** Demo: SnMention — custom delimiter. */
import { ref } from 'vue'
import { SnMention } from '@snui/vue-web'
const value = ref('')
const options = ['Frontend', 'Vue', 'Component library', 'Design system']
</script>

<template>
  <SnMention v-model="value" delimiter="#" :options="options" placeholder="Type # to pick a topic" style="width: 300px;" />
</template>
