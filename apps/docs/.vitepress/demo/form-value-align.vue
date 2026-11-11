<script setup lang="ts">
/** Demo: SnForm — valueAlign right alignment. */
import { reactive } from 'vue';
import { SnForm, SnFormItem, SnInput } from '@snui/vue-web';

const c = reactive({ a: '', b: '' });
</script>

<template>
  <div class="sn-demo-grid">
    <section>
      <h4>valueAlign="right"</h4>
      <SnForm :model="c" value-align="right">
        <SnFormItem prop="a" label="Amount" required>
          <SnInput v-model="c.a" align-right />
        </SnFormItem>
        <SnFormItem prop="b" label="Quantity" required>
          <SnInput v-model="c.b" align-right />
        </SnFormItem>
      </SnForm>
    </section>
  </div>
</template>

<style scoped>
.sn-demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}
.sn-demo-grid section h4 {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
</style>
