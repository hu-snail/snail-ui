<script setup lang="ts">
/** Demo: SnTimeline — line-type 自定义轴线风格。 */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web';
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline>
      <SnTimelineItem
        dot-color="#165dff"
        line-type="dotted"
        title="The first milestone"
        content="line-type=dotted 点线轴线"
        time="2017-03-10"
      />
      <SnTimelineItem
        dot-color="#165dff"
        line-type="dashed"
        title="The second milestone"
        content="line-type=dashed 短划轴线"
        time="2018-05-12"
      />
      <SnTimelineItem
        dot-color="#165dff"
        title="The third milestone"
        content="默认实线轴线"
        time="2020-09-30"
      />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
  max-width: 520px;
}
</style>
