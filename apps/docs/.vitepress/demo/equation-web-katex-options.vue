<script setup lang="ts">
/** Demo: SnEquation — katex options: displayMode + fleqn + custom macros
 * (mirrors n-equation katex-options). */
import { SnEquation } from '@snui/vue-web';

const equation = `\\f\\relax{x} = \\int_{-\\infty}^\\infty
    \\f\\hat\\xi\\,e^{2 \\pi i \\xi x}
    \\,d\\xi`;

const katexOptions = {
  displayMode: true,
  fleqn: true,
  macros: {
    '\\f': '#1f(#2)',
  },
};
</script>

<template>
  <div class="sn-demo">
    <SnEquation :value="equation" :katex-options="katexOptions" />
  </div>
</template>
