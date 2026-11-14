<script setup lang="ts">
/** Demo: SnRadio — 卡片选中按钮的行内形态（左 / 左反转 / 右勾）。 */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';

const left = ref('a');
const leftInverted = ref('a');
const right = ref('a');
</script>

<template>
  <div class="demo-col">
    <section>
      <h4>1. 左侧垂直居中（indicatorPlacement="leading"）</h4>
      <SnRadioGroup v-model="left" variant="card" indicator-placement="leading" class="demo-list">
        <SnRadio checked-value="a" label="标准卡片 · 左侧单选" />
        <SnRadio checked-value="b" label="第二项" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>1b. 左侧 + 反转（markerShape="inverted"）</h4>
      <SnRadioGroup
        v-model="leftInverted"
        variant="card"
        indicator-placement="leading"
        marker-shape="inverted"
        class="demo-list"
      >
        <SnRadio checked-value="a" label="反转选中态" />
        <SnRadio checked-value="b" label="第二项" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>2. 右侧垂直居中打勾（indicatorPlacement="trailing"）</h4>
      <SnRadioGroup v-model="right" variant="card" indicator-placement="trailing" class="demo-list">
        <SnRadio checked-value="a" label="标准卡片 · 右侧勾选" />
        <SnRadio checked-value="b" label="第二项" />
      </SnRadioGroup>
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
.demo-col :deep(.demo-list) {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
}
</style>
