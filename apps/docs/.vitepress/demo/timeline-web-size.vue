<script setup lang="ts">
/** Demo: SnTimeline — size 大号标题 + icon-size 放大节点。 */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web';
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline size="large" :icon-size="18">
      <SnTimelineItem type="success" title="成功" content="部署完成" time="10:20" />
      <SnTimelineItem type="info" title="信息" content="触发回调" time="10:24" />
      <SnTimelineItem title="结束" content="收尾" time="10:30" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
  max-width: 480px;
}
</style>
