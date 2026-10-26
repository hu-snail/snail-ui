<script setup lang="ts">
/**
 * alert-web-no-icon — `showIcon=false` with and without a title.
 *
 * Shows: the alert collapsing to a pure text block when the icon is off,
 * and how the text region reclaims the freed horizontal space.
 */
import { SnAlert } from '@snui/vue-web';
</script>

<template>
  <div class="alert-noicon">
    <SnAlert type="info" title="无图标（带标题）" :show-icon="false">
      图标位被移除后，标题与正文整体左移。
    </SnAlert>

    <SnAlert type="success" :show-icon="false">
      无标题、无图标：只剩一行正文，适合最轻量的状态提示。
    </SnAlert>

    <SnAlert type="warning" :show-icon="false" :bordered="false">
      无图标 + 无边框，视觉上接近一段带底色的说明文字。
    </SnAlert>
  </div>
</template>

<style scoped>
.alert-noicon {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
</style>
