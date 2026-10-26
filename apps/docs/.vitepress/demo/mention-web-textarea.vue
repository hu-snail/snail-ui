<script setup lang="ts">
/** Demo: SnMention — textarea variant. */
import { ref } from 'vue'
import { SnMention } from '@snui/vue-web'
const value = ref('')
const options = ['需求评审', '技术评审', '发布计划']
</script>

<template>
  <SnMention v-model="value" type="textarea" :rows="3" :options="options" placeholder="评论中输入 @ 提及（多行）" style="width: 320px;" />
</template>
