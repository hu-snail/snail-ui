<script setup lang="ts">
/** Demo: SnTimeline — line-type axis styles. */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web';
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline>
      <SnTimelineItem
        dot-color="#165dff"
        line-type="dotted"
        title="The first milestone"
        content="line-type=dotted axis"
        time="2017-03-10"
      />
      <SnTimelineItem
        dot-color="#165dff"
        line-type="dashed"
        title="The second milestone"
        content="line-type=dashed axis"
        time="2018-05-12"
      />
      <SnTimelineItem
        dot-color="#165dff"
        title="The third milestone"
        content="solid axis (default)"
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
