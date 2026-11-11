<script setup lang="ts">
/** Demo: SnRadio — inline forms: 标记形态（inverted / check）+ 标题在前（labelPlacement）。 */
import { ref } from 'vue';
import { SnRadio, SnRadioGroup } from '@snui/vue-web';

const inverted = ref('a');
const check = ref('a');
const labelFirst = ref('a');
const invertedLabelFirst = ref('a');
</script>

<template>
  <div class="demo-col">
    <section>
      <h4>markerShape="inverted"(checked = solid theme fill + white dot)</h4>
      <SnRadioGroup v-model="inverted" marker-shape="inverted">
        <SnRadio checked-value="a" label="Option" />
        <SnRadio checked-value="b" label="Option B" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>markerShape="check"(checked = solid theme fill + white check glyph)</h4>
      <SnRadioGroup v-model="check" marker-shape="check">
        <SnRadio checked-value="a" label="Option" />
        <SnRadio checked-value="b" label="Option B" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>labelPlacement="label-first"(label first, marker last)</h4>
      <SnRadioGroup v-model="labelFirst" label-placement="label-first" class="demo-rows">
        <SnRadio checked-value="a" label="Push notifications" />
        <SnRadio checked-value="b" label="Marketing emails" />
      </SnRadioGroup>
    </section>

    <section>
      <h4>Both combined (inverted + label-first)</h4>
      <SnRadioGroup
        v-model="invertedLabelFirst"
        marker-shape="inverted"
        label-placement="label-first"
        class="demo-rows"
      >
        <SnRadio checked-value="a" label="Push notifications" />
        <SnRadio checked-value="b" label="Marketing emails" />
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
  gap: 16px;
  flex-wrap: wrap;
}
/* label-first rows stack and stretch so the marker sits at the far edge. */
.demo-col :deep(.demo-rows) {
  flex-direction: column;
  align-items: stretch;
  max-width: 320px;
}
</style>
