<script setup lang="ts">
/**
 * collapse-web-basic — SnCollapse + SnCollapseItem 默认 multi-expand
 */
import { ref } from 'vue'
import { SnCollapse, SnCollapseItem } from '@snui/vue-web'

const open = ref<Array<string | number>>(['1'])
</script>

<template>
  <SnCollapse v-model:expanded-names="open" arrow-placement="left">
    <SnCollapseItem title="Overview" name="1">
      Cross-platform and cloud features, component list, and token usage.
    </SnCollapseItem>
    <SnCollapseItem title="Architecture" name="2">
      pnpm workspace + dual-platform alias packages (@snui/vue-web / @snui/uni).
    </SnCollapseItem>
    <SnCollapseItem title="FAQ" name="3">
      FAQs and troubleshooting.
    </SnCollapseItem>
    <SnCollapseItem title="Changelog" name="4" disabled>
      Future plans / Roadmap (disabled demo).
    </SnCollapseItem>
  </SnCollapse>
</template>