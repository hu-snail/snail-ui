<script setup lang="ts">
/** Demo: SnCode — basic usage (json tokenized + plain languages). */
import { SnCode } from '@snui/vue-web'

const jsonCode = `{
  "name": "snail-aui",
  "version": "3.0.0",
  "keywords": ["ui", "tokens"],
  "stable": true,
  "deps": 0
}`

const jsCode = `function sleep (ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}`

const cppCode = `int main () {
  std::cout << "Hello Snail AUI";
  return 0;
}`
</script>

<template>
  <div class="sn-demo sn-code-demo">
    <SnCode :code="jsonCode" language="json" />
    <SnCode :code="jsCode" language="javascript" />
    <SnCode :code="cppCode" language="cpp" />
  </div>
</template>

<style scoped>
.sn-code-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: var(--sn-web-color-text-primary);
}
</style>
