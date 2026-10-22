<script setup lang="ts">
/** Demo: SnTimeline — item-placement：轨道在左 / 在右。 */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web'
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline>
      <SnTimelineItem type="success" title="Success" content="What went well" time="2018-04-03 20:46" />
      <SnTimelineItem type="error" content="What went wrong" time="2018-04-03 20:46" />
    </SnTimeline>

    <SnTimeline item-placement="right">
      <SnTimelineItem type="success" title="Success" content="What went well" time="2018-04-03 20:46" />
      <SnTimelineItem type="error" content="What went wrong" time="2018-04-03 20:46" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  display: flex;
  gap: 48px;
  width: 100%;
  max-width: 640px;
}
.timeline-demo > * {
  flex: 1;
}
</style>
