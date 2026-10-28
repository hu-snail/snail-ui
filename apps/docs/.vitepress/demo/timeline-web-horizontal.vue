<script setup lang="ts">
/** Demo: SnTimeline — horizontal 水平时间线（含 mode=alternate）。 */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web';
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline horizontal>
      <SnTimelineItem type="success" title="成功" content="哪里成功" time="2018-04-03 20:46" />
      <SnTimelineItem type="error" content="哪里错误" time="2018-04-03 20:46" />
      <SnTimelineItem
        type="warning"
        title="警告"
        content="哪里警告"
        time="2018-04-03 20:46"
        line-type="dashed"
      />
      <SnTimelineItem type="info" title="信息" content="是的" time="2018-04-03 20:46" />
      <SnTimelineItem content="啊" />
    </SnTimeline>

    <SnTimeline direction="horizontal" mode="alternate" class="alternate-row">
      <SnTimelineItem label="2012-08" title="Toutiao" content="Founded in 2012" />
      <SnTimelineItem label="2017-05" title="Xigua Video" content="Founded in 2017" />
      <SnTimelineItem label="2018-07" title="Pipidance" content="Founded in 2018" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
}

.alternate-row {
  margin-top: 48px;
}
</style>
