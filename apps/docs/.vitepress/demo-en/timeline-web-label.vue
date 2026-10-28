<script setup lang="ts">
/** Demo: SnTimeline — vertical alternate + label (relative default: labels across the axis). */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web';
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline mode="alternate">
      <SnTimelineItem label="2012-08" title="Toutiao" content="Founded in 2012" />
      <SnTimelineItem label="2017-05" title="Xigua Video" content="Founded in 2017" />
      <SnTimelineItem label="2018-07" title="Pipidance" content="Founded in 2018" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
  max-width: 640px;
}
</style>
