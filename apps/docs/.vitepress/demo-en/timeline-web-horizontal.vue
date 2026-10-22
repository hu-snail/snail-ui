<script setup lang="ts">
/** Demo: SnTimeline — horizontal 水平时间线。 */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web'
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline horizontal>
      <SnTimelineItem type="success" title="Success" content="What went well" time="2018-04-03 20:46" />
      <SnTimelineItem type="error" content="What went wrong" time="2018-04-03 20:46" />
      <SnTimelineItem type="warning" title="Warning" content="What needs attention" time="2018-04-03 20:46" line-type="dashed" />
      <SnTimelineItem type="info" title="Info" content="Yes" time="2018-04-03 20:46" />
      <SnTimelineItem content="Ah" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
}
</style>
