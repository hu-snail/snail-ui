<script setup lang="ts">
/** Demo: SnTimeline — size 大号标题 + icon-size 放大节点。 */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web'
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline size="large" :icon-size="18">
      <SnTimelineItem type="success" title="Success" content="Deploy complete" time="10:20" />
      <SnTimelineItem type="info" title="Info" content="Callback triggered" time="10:24" />
      <SnTimelineItem title="End" content="Finalize" time="10:30" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
  max-width: 480px;
}
</style>
