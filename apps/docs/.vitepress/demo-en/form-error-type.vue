<script setup lang="ts">
/** Demo: SnForm — errorType display strategy. */
import { reactive } from 'vue';
import { SnForm, SnFormItem, SnInput } from '@snui/vue-web';
import type { FormRule } from '@snui/vue-web';

const silent = reactive({ a: '' });

const silentRules: Record<string, FormRule[]> = {
  a: [{ required: true, message: 'Silent — errorType=none' }],
};
</script>

<template>
  <div class="sn-demo-grid">
    <section>
      <h4>errorType="none" (silent)</h4>
      <SnForm :model="silent" :rules="silentRules" error-type="none">
        <SnFormItem prop="a" label="Email">
          <SnInput v-model="silent.a" />
        </SnFormItem>
      </SnForm>
      <p class="sn-demo__hint">Validation runs, message not shown (consume via @validate).</p>
    </section>
  </div>
</template>

<style scoped>
.sn-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}
.sn-demo-grid section h4 {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.sn-demo__hint {
  margin-top: 12px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
