<script setup lang="ts">
/** Demo: sn-avatar (uni-end) — image / text / icon content layers. */
import { onBeforeUnmount } from 'vue';
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import { registerSnIcons, clearSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { User } from '@snui/uni-src/components/sn-icon/sn-icon-set';

registerSnIcons({ User });

onBeforeUnmount(() => clearSnIcons());
</script>

<template>
  <view class="sn-demo">
    <SnAvatar text="AU" />
    <SnAvatar text="Li" />
    <SnAvatar icon="User" />
    <SnAvatar text="JD" bg-color="var(--sn-mp-color-action-primary)" />
    <SnAvatar text="SN" bg-color="var(--sn-mp-color-feedback-success)" />
    <SnAvatar src="https://picsum.photos/seed/snui-a/120" alt="A" />
  </view>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
</style>
