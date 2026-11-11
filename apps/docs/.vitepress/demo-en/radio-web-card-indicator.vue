<script setup lang="ts">
/** Demo: SnRadio — Inline card indicator layouts (left / left inverted / right check)。 */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';

const left = ref('a');
const leftInverted = ref('a');
const right = ref('a');
</script>

<template>
  <div class="demo-col">
    <section>
      <h4>1. Left, vertically centred (indicatorPlacement="leading")</h4>
      <SnRadioGroup v-model="left" variant="card" indicator-placement="leading" class="demo-list">
        <SnRadio checked-value="a" label="Card with a left marker" />
        <SnRadio checked-value="b" label="Second option" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>1b. Left + inverted marker (markerShape="inverted")</h4>
      <SnRadioGroup
        v-model="leftInverted"
        variant="card"
        indicator-placement="leading"
        marker-shape="inverted"
        class="demo-list"
      >
        <SnRadio checked-value="a" label="Inverted marker" />
        <SnRadio checked-value="b" label="Second option" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>2. Right, check glyph (indicatorPlacement="trailing")</h4>
      <SnRadioGroup v-model="right" variant="card" indicator-placement="trailing" class="demo-list">
        <SnRadio checked-value="a" label="Card with a right check" />
        <SnRadio checked-value="b" label="Second option" />
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
