<script setup lang="ts">
/** Demo: SnHighlight — case-sensitive matching. */
import { SnHighlight } from '@snui/vue-web';

const text = 'Snail AUI 全量使用 TypeScript 编写，和你的 TypeScript 项目无缝衔接';
const patterns = ['Snail AUI', 'typeScript'];
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__hint">
      <SnHighlight :text="text" :patterns="patterns" :case-sensitive="true" />
    </p>
    <p class="sn-demo__hint sn-demo__hint--muted">
      对照：不区分大小写时 <SnHighlight :text="text" :patterns="patterns" /> 会同时命中两种写法。
    </p>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sn-demo__hint {
  margin: 0;
  color: var(--sn-web-color-text-primary);
  line-height: 1.8;
}

.sn-demo__hint--muted {
  color: var(--sn-web-color-text-tertiary);
  font-size: 13px;
}
</style>
