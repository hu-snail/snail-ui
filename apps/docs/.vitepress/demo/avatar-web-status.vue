<script setup lang="ts">
/**
 * Demo: SnAvatar — 在线状态与角标（additive 能力）。
 *
 * `status` 在角上绘制在线/离线状态点，`status-position` 选择右上/右下；
 * `badge-icon` 在角上绘制徽标（会员等级皇冠）。两者均为角标装饰，
 * 状态会同时写进 aria-label 供读屏朗读。
 */
import { Crown } from 'lucide-vue-next';
import { registerSnIcons, SnAvatar } from '@snui/vue-web';

registerSnIcons({ Crown });
</script>

<template>
  <div class="demo-grid">
    <div class="demo-block">
      <h4>在线状态（默认右下）</h4>
      <div class="demo-row">
        <SnAvatar src="/logo.svg" status="online" />
        <SnAvatar fallback-text="张" status="offline" />
        <SnAvatar fallback-text="李" status="online" circle color="var(--sn-web-color-action-primary)" />
      </div>
    </div>

    <div class="demo-block">
      <h4>状态点位置（右上 / 右下）</h4>
      <div class="demo-row">
        <SnAvatar fallback-text="王" status="online" status-position="top-right" />
        <SnAvatar fallback-text="赵" status="online" status-position="bottom-right" size="large" />
      </div>
    </div>

    <div class="demo-block">
      <h4>徽标图标（会员等级）</h4>
      <div class="demo-row">
        <SnAvatar fallback-text="SVIP" color="var(--sn-web-color-text-primary)" badge-icon="Crown" />
        <SnAvatar
          fallback-text="VIP"
          circle
          color="var(--sn-web-color-feedback-info)"
          badge-icon="Crown"
          size="large"
        />
        <SnAvatar
          src="/logo.svg"
          status="online"
          badge-icon="Crown"
          badge-position="bottom-right"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-grid {
  display: grid;
  gap: 16px;
  justify-items: start;
}

.demo-block {
  display: grid;
  gap: 10px;
  justify-items: start;
}

.demo-block h4 {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--sn-web-color-text-tertiary);
}

.demo-row {
  display: flex;
  gap: 24px;
  align-items: center;
}
</style>
