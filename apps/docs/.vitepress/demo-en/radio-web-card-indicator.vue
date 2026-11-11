<script setup lang="ts">
/** Demo: SnRadio — Three card indicator layouts (left / right / corner)。 */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';

const left = ref('a');
const leftInverted = ref('a');
const right = ref('a');
const corner = ref('a');
const bottomCorner = ref('a');
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

    <section>
      <h4>3. Top-right corner (indicatorPlacement="top-right")</h4>
      <SnRadioGroup v-model="corner" variant="card" class="demo-row">
        <SnRadio checked-value="a">
          <template #card>
            <span class="c__title">Basic</span>
            <span class="c__price">¥0</span>
          </template>
        </SnRadio>
        <SnRadio checked-value="b">
          <template #card>
            <span class="c__title">Pro</span>
            <span class="c__price">¥99</span>
          </template>
        </SnRadio>
      </SnRadioGroup>
    </section>

    <section>
      <h4>3b. Bottom-right corner (indicatorPlacement="bottom-right")</h4>
      <SnRadioGroup
        v-model="bottomCorner"
        variant="card"
        indicator-placement="bottom-right"
        class="demo-row"
      >
        <SnRadio checked-value="a">
          <template #card>
            <span class="c__title">Basic</span>
            <span class="c__price">¥0</span>
          </template>
        </SnRadio>
        <SnRadio checked-value="b">
          <template #card>
            <span class="c__title">Pro</span>
            <span class="c__price">¥99</span>
          </template>
        </SnRadio>
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
.demo-col :deep(.demo-row) {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.demo-col :deep(.demo-row .sn-radio--variant-card) {
  flex: 1 1 160px;
  min-width: 160px;
}
.c__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.c__price {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 700;
  color: var(--sn-web-color-action-primary);
}
</style>
