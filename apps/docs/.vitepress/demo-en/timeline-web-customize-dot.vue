<script setup lang="ts">
/** Demo: SnTimeline — dot-color / dot-type / dot slot custom nodes. */
import { SnTimeline, SnTimelineItem } from '@snui/vue-web';
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline>
      <SnTimelineItem
        dot-color="#00b42a"
        title="The first milestone"
        content="Node color via dot-color"
        time="2020-04-12"
      />
      <SnTimelineItem
        dot-color="#165dff"
        title="The second milestone"
        content="solid dot (default)"
        time="2020-05-17"
      />
      <SnTimelineItem title="The third milestone" content="dot slot: wins over dot-color / dot-type" time="2020-06-22">
        <template #dot>
          <span class="ring-dot" />
        </template>
      </SnTimelineItem>
      <SnTimelineItem
        dot-type="hollow"
        dot-color="#86909c"
        title="The fourth milestone"
        content="hollow ring node"
        time="2020-06-22"
      />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
  max-width: 520px;
}

.ring-dot {
  display: block;
  width: 12px;
  height: 12px;
  border: 2px dashed #f53f3f;
  border-radius: 50%;
  animation: ring-spin 1.4s linear infinite;
}

@keyframes ring-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
