<script setup lang="ts">
/** Demo: SnCheckbox — indicator placement + checked paint on cards. */
import { ref } from 'vue';
import { SnCheckbox, SnCheckboxGroup } from '@snui/vue-web';

const topRight = ref<string[]>(['a']);
const bottomRight = ref<string[]>(['a']);
const none = ref<string[]>(['a']);
const borderOnly = ref<string[]>(['a']);
</script>

<template>
  <div class="demo-col">
    <section>
      <h4>indicatorPlacement="top-right"（card 默认）</h4>
      <SnCheckboxGroup v-model="topRight" variant="card" indicator-placement="top-right">
        <SnCheckbox value="a" label="选项 A" />
        <SnCheckbox value="b" label="选项 B" />
      </SnCheckboxGroup>
    </section>

    <section>
      <h4>indicatorPlacement="bottom-right"</h4>
      <SnCheckboxGroup v-model="bottomRight" variant="card" indicator-placement="bottom-right">
        <SnCheckbox value="a" label="选项 A" />
        <SnCheckbox value="b" label="选项 B" />
      </SnCheckboxGroup>
    </section>

    <section>
      <h4>indicatorPlacement="none"</h4>
      <SnCheckboxGroup v-model="none" variant="card" indicator-placement="none">
        <SnCheckbox value="a" label="选项 A" />
        <SnCheckbox value="b" label="选项 B" />
      </SnCheckboxGroup>
    </section>

    <section>
      <h4>checkedStyle="border"（仅主题色描边）</h4>
      <SnCheckboxGroup v-model="borderOnly" variant="card" checked-style="border">
        <SnCheckbox value="a" label="选项 A" />
      </SnCheckboxGroup>
    </section>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.demo-col section h4 {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.demo-col :deep(.sn-checkbox-group) {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
