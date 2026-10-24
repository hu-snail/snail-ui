<script setup lang="ts">
/**
 * Demo: sn-root-portal — escape a clipped ancestor.
 *
 * The inner box is `overflow: hidden`, so content that overflows it would
 * normally be cut off. Wrapped in `sn-root-portal`, the badge stays visible
 * because the layer is fixed to the viewport.
 */
import { ref } from 'vue'
import SnRootPortal from '@snui/uni-src/components/sn-root-portal/sn-root-portal.vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'

const visible = ref(true)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-root-portal-demo__clipped">
      <text class="sn-root-portal-demo__note">这个容器是 overflow: hidden</text>

      <SnRootPortal v-if="visible">
        <view class="sn-root-portal-demo__badge">传送出去的内容</view>
      </SnRootPortal>
    </view>

    <view class="sn-root-portal-demo__actions">
      <SnButton size="small" @tap="visible = !visible">
        {{ visible ? '卸载传送层' : '挂载传送层' }}
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-root-portal-demo__clipped {
  position: relative;
  height: 72px;
  padding: 10px;
  overflow: hidden;
  border: 1px dashed var(--sn-mp-color-border-default);
  border-radius: 8px;
  background: var(--sn-mp-color-background-subtle);
}

.sn-root-portal-demo__note {
  font-size: 12px;
  color: var(--sn-mp-color-text-secondary);
}

.sn-root-portal-demo__badge {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 12px;
  white-space: nowrap;
}

.sn-root-portal-demo__actions {
  display: flex;
  gap: 8px;
}
</style>
