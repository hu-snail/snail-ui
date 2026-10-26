<script setup lang="ts">
/**
 * tabs-web-line — SnTabs `type="line"` with an underline indicator.
 * The most common shape for detail-page section switching.
 */
import { ref } from 'vue';
import { SnTabs, SnTabPane } from '@snui/vue-web';

const active = ref<string>('detail');
</script>

<template>
  <div class="tabs-demo">
    <SnTabs v-model:value="active" type="line">
      <SnTabPane name="detail" tab="Basic info"> Name, slug, created time, and owner. </SnTabPane>
      <SnTabPane name="members" tab="Members"> 12 members, 3 admins. </SnTabPane>
      <SnTabPane name="logs" tab="Activity log"> 148 operations in the last 30 days. </SnTabPane>
      <SnTabPane name="archive" tab="Archive" disabled>
        Archiving is not enabled for this group.
      </SnTabPane>
    </SnTabs>
  </div>
</template>

<style scoped>
.tabs-demo {
  width: 100%;
}
</style>
