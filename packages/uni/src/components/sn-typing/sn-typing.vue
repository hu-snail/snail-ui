<script setup lang="ts">
/**
 * SnTyping (uni-end) — 输入中指示（业务组件 AUI-BIZ-006）。
 *
 * Reference library: lime-ui `l-typing`
 *   (https://limeuix.qcoon.cn/components/typing)
 * 语义为聊天 / 生成场景的「输入中」跳动圆点 + 可选文案。圆点动画只有
 * opacity / transform（App 端安全），错峰延迟用显式修饰类而非 :nth-child
 * （AGENTS.md §116.2）。纯 CSS 动画，无定时器、无 dispose 负担。
 *
 * Not responsible for: 消息流状态 —— 由宿主按需挂载 / 卸载。
 */

import { computed } from 'vue';

defineOptions({ name: 'SnTyping' });

const props = withDefaults(
  defineProps<{
    /** 随圆点一起展示的文案（空字符串则只显示圆点）。 */
    text?: string;
    /** 圆点数量。 */
    dotCount?: number;
    /** 单个圆点脉动周期（ms）。 */
    speed?: number;
    /** 圆点颜色（非激活观感由低透明度表达）。 */
    activeDotColor?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: string;
  }>(),
  {
    text: '输入中',
    dotCount: 3,
    speed: 350,
    activeDotColor: 'var(--sn-mp-color-action-primary)',
    customClass: '',
    customStyle: '',
  },
);

const dotIndexes = computed(() =>
  Array.from({ length: Math.max(1, Math.min(5, props.dotCount)) }, (_, i) => i + 1),
);

const rootClass = computed(() => ['sn-typing', props.customClass]);
const rootStyle = computed(() => {
  const parts = [] as string[];
  if (props.customStyle !== '') parts.push(props.customStyle);
  return parts.join('; ');
});

function dotStyle(index: number): string {
  return `background-color: ${props.activeDotColor}; animation-duration: ${props.speed}ms; animation-delay: ${((index - 1) * props.speed) / 3}ms`;
}
</script>

<template>
  <view :class="rootClass" :style="rootStyle" role="status" aria-label="typing">
    <text v-if="text !== ''" class="sn-typing__text">{{ text }}</text>
    <view class="sn-typing__dots">
      <view
        v-for="index in dotIndexes"
        :key="index"
        class="sn-typing__dot"
        :class="`sn-typing__dot--${index}`"
        :style="dotStyle(index)"
      />
    </view>
  </view>
</template>

<style scoped>
.sn-typing {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}

.sn-typing__text {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}

.sn-typing__dots {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-1);
}

.sn-typing__dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  animation-name: sn-typing-pulse;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes sn-typing-pulse {
  0%,
  60%,
  100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  30% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
