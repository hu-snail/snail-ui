<script setup lang="ts">
/** Demo: SnTimeline — icon 槽位自定义节点图标（color 联动）。 */
import { Coins } from 'lucide-vue-next'
import { registerSnIcons, SnIcon, SnTimeline, SnTimelineItem } from '@snui/vue-web'

registerSnIcons({ Coins })
</script>

<template>
  <div class="timeline-demo">
    <SnTimeline :icon-size="20">
      <SnTimelineItem color="grey" content="Ah">
        <template #icon>
          <SnIcon :icon="Coins" :size="20" />
        </template>
      </SnTimelineItem>
      <SnTimelineItem type="success" title="Success" content="What went well" time="2018-04-03 20:46">
        <template #icon>
          <SnIcon :icon="Coins" :size="20" />
        </template>
      </SnTimelineItem>
      <SnTimelineItem type="error" content="What went wrong" time="2018-04-03 20:46">
        <template #icon>
          <SnIcon :icon="Coins" :size="20" />
        </template>
      </SnTimelineItem>
      <SnTimelineItem type="warning" title="Warning" content="What needs attention" time="2018-04-03 20:46" />
      <SnTimelineItem type="info" title="Info" content="Yes" time="2018-04-03 20:46" />
    </SnTimeline>
  </div>
</template>

<style scoped>
.timeline-demo {
  width: 100%;
  max-width: 520px;
}
</style>
