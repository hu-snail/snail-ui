<script setup lang="ts">
/** Demo: SnTimeline — horizontal 水平时间线。 */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web'
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline horizontal>
      <SnTimelineItem type="success" title="成功" content="哪里成功" time="2018-04-03 20:46" />
      <SnTimelineItem type="error" content="哪里错误" time="2018-04-03 20:46" />
      <SnTimelineItem type="warning" title="警告" content="哪里警告" time="2018-04-03 20:46" line-type="dashed" />
      <SnTimelineItem type="info" title="信息" content="是的" time="2018-04-03 20:46" />
      <SnTimelineItem content="啊" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
}
</style>
