<script setup lang="ts">
/** Demo: SnRadio — indicator placement (top-right / bottom-right / none) and
 *  checked paint (border / fill / border-fill). */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';

const topRight = ref('a');
const bottomRight = ref('a');
const none = ref('a');
const borderOnly = ref('a');
const fillOnly = ref('a');
</script>

<template>
  <div class="demo-col">
    <section>
      <h4>indicatorPlacement="top-right"(card default)</h4>
      <SnRadioGroup v-model="topRight" variant="card" indicator-placement="top-right">
        <SnRadio checked-value="a" label="Plan A" />
        <SnRadio checked-value="b" label="Plan B" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>indicatorPlacement="bottom-right"</h4>
      <SnRadioGroup v-model="bottomRight" variant="card" indicator-placement="bottom-right">
        <SnRadio checked-value="a" label="Plan A" />
        <SnRadio checked-value="b" label="Plan B" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>indicatorPlacement="none"(card state only)</h4>
      <SnRadioGroup v-model="none" variant="card" indicator-placement="none">
        <SnRadio checked-value="a" label="Plan A" />
        <SnRadio checked-value="b" label="Plan B" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>checkedStyle="border" / "fill"</h4>
      <SnRadioGroup v-model="borderOnly" variant="card" checked-style="border">
        <SnRadio checked-value="a" label="Border only" />
      </SnRadioGroup>
      <SnRadioGroup v-model="fillOnly" variant="card" checked-style="fill">
        <SnRadio checked-value="a" label="Fill only" />
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
.demo-col :deep(.sn-radio-group) {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
