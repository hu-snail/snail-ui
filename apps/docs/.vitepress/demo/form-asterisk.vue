<script setup lang="ts">
/** Demo: SnForm — asteriskPosition + hideAsterisk. */
import { reactive } from 'vue';
import { SnForm, SnFormItem, SnInput } from '@snui/vue-web';

const d = reactive({ a: '', b: '' });
</script>

<template>
  <div class="sn-demo-grid">
    <section>
      <h4>asteriskPosition="right" + hideAsterisk</h4>
      <SnForm :model="d" asterisk-position="right" hide-asterisk>
        <SnFormItem prop="a" label="Email" required>
          <SnInput v-model="d.a" />
        </SnFormItem>
        <SnFormItem prop="b" label="Nickname" required>
          <SnInput v-model="d.b" />
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
