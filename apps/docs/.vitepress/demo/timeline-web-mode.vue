<script setup lang="ts">
/** Demo: SnTimeline — mode 展示类型（alternate / right）。 */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web';
</script>

<template>
  <div class="mode-row">
    <SnTimeline mode="alternate" class="mode-half">
      <SnTimelineItem title="The first milestone" time="2017-03-10" />
      <SnTimelineItem title="The second milestone" time="2018-05-12" />
      <SnTimelineItem title="The third milestone" time="2020-09-30" position="left" />
    </SnTimeline>
    <SnTimeline mode="right" class="mode-half">
      <SnTimelineItem title="The first milestone" time="2017-03-10" />
      <SnTimelineItem title="The second milestone" time="2018-05-12" />
      <SnTimelineItem title="The third milestone" time="2020-09-30" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.mode-row {
  width: 100%;
  display: flex;
  gap: 48px;
}

.mode-half {
  flex: 1 1 0;
  min-width: 0;
}
</style>
