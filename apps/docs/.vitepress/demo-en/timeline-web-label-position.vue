<script setup lang="ts">
/** Demo: SnTimeline — labelPosition (same / relative). */
import { ref } from 'vue';
import { SnRadioGroup, SnTimeline, SnTimelineItem } from '@snui/vue-web';

const labelPosition = ref<'same' | 'relative'>('relative');
const mode = ref<'left' | 'right' | 'alternate'>('left');

const labelPositionOptions = [
  { label: 'same', value: 'same' },
  { label: 'relative', value: 'relative' },
];

const modeOptions = [
  { label: 'left', value: 'left' },
  { label: 'right', value: 'right' },
  { label: 'alternate', value: 'alternate' },
];
</script>

<template>
  <div class="timeline-demo">
    <div class="controls">
      <span class="ctl-name">labelPosition:</span>
      <SnRadioGroup v-model="labelPosition" name="label-position" :options="labelPositionOptions" />
    </div>
    <div class="controls">
      <span class="ctl-name">mode:</span>
      <SnRadioGroup v-model="mode" name="mode" :options="modeOptions" />
    </div>
    <SnTimeline :mode="mode" :label-position="labelPosition">
      <SnTimelineItem dot-color="#00b42a" label="2017-03-10" title="The first milestone" time="2017-03-10" />
      <SnTimelineItem dot-color="#f53f3f" label="2018-05-12" title="The second milestone" time="2018-05-12" />
      <SnTimelineItem label="2020-09-30" title="The third milestone" time="2020-09-30" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
  max-width: 720px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.ctl-name {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
