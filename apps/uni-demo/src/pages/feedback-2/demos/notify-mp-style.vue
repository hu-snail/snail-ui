<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — 自定义能力：图标 / 底色 / 圆角 / 关闭文案 /
 * 常驻时长 / card 插槽全自定义（独立容器承载插槽）。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';
import { Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import type { SnNotifyInstance } from '@snui/uni-src/components/sn-notify/sn-notify-types';

const notify = ref<SnNotifyInstance | null>(null);
const slotted = ref<SnNotifyInstance | null>(null);

/** 自定义图标 + 暖色底 + 图标型关闭钮（closeText 留空 → X 图标胶囊）。 */
function showAchievement(): void {
  notify.value?.show({
    title: '新成就达成！',
    description: '你已连续学习 1 天',
    type: 'warning',
    icon: Star,
    background: 'var(--sn-mp-color-feedback-warning-soft)',
    radius: 24,
    closeText: '',
    duration: 0,
  });
}

/** card 插槽完全接管卡片内容（眉行 + 粗标题 + 自绘关闭钮）。 */
function showSlotted(): void {
  slotted.value?.show({
    title: '备份完成',
    description: '共 1234 个文件（2.5 GB）已全部备份',
    type: 'success',
    duration: 0,
  });
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="warning" variant="soft" block @tap="showAchievement">
      自定义图标 / 底色 / 圆角 / X 关闭
    </SnButton>
    <SnButton block variant="soft" @tap="notify?.show({ title: '常驻通知', description: 'duration = 0，点关闭才消失', closeText: '知道了', duration: 0 })">
      常驻 + 中文关闭文案
    </SnButton>
    <SnButton type="success" variant="soft" block @tap="showSlotted">
      card 插槽全自定义
    </SnButton>
    <SnButton type="danger" variant="soft" block @tap="notify?.hideAll(); slotted?.hideAll()">
      清空全部通知
    </SnButton>

    <text class="sn-demo__meta">
      card 插槽作用域为 { id, title, description, type }，替换整卡内容后可自行调用
      hide(id) 关闭；swipe-to-dismiss 仍由容器处理。
    </text>

    <SnNotify ref="notify" custom-class="sn-demo-contained" />
    <SnNotify ref="slotted" custom-class="sn-demo-contained">
      <template #card="{ item }">
        <view class="slot-card">
          <view class="slot-card__texts">
            <text class="slot-card__eyebrow">{{ item.description }}</text>
            <text class="slot-card__title">{{ item.title }}</text>
          </view>
          <view
            class="slot-card__close"
            role="button"
            aria-label="close"
            @tap.stop="slotted?.hide(item.id)"
          >
            <text class="slot-card__close-text">Close</text>
          </view>
        </view>
      </template>
    </SnNotify>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-notify.sn-demo-contained {
  position: absolute;
}

.slot-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-mp-spacing-4);
  width: 100%;
}

.slot-card__texts {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
}

.slot-card__eyebrow {
  font-size: var(--sn-mp-font-size-sm);
  line-height: 34rpx;
  color: var(--sn-mp-color-text-tertiary);
}

.slot-card__title {
  margin-top: var(--sn-mp-spacing-1);
  font-size: var(--sn-mp-font-size-lg);
  font-weight: 600;
  line-height: 44rpx;
  color: var(--sn-mp-color-text-primary);
}

.slot-card__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  height: 64rpx;
  padding: 0 var(--sn-mp-spacing-5);
  border-radius: var(--sn-mp-radius-xl);
  background-color: var(--sn-mp-color-feedback-success);
}

.slot-card__close-text {
  font-size: var(--sn-mp-font-size-md);
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
</style>
