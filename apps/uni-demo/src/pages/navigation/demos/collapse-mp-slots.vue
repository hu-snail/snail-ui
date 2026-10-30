<script setup lang="ts">
/**
 * Demo: sn-collapse — `more` 插槽、`custom-more-slot-class`、item 级 `border` 与 `before-expend`。
 *
 * - `more` 插槽在 viewmore 模式下替换底部展开 / 收起区域，作用域 `{ expanded }`
 *   （`use-more-slot` 只是契约位，模板里 `more` 插槽在 viewmore 模式下始终生效）
 * - `custom-more-slot-class` 给该区域追加类名
 * - `before-expend` 在展开前调用（收 `name`），返回 `false` 阻止展开
 * - item 的 `border=false` 去掉下边框；`custom-body-class` / `custom-body-style` 作用于内容容器
 * - `title` 插槽作用域 `{ expanded, disabled, isFirst }`
 */
import { ref } from 'vue';
import { ChevronDown, Truck } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import SnCollapse from '@snui/uni-src/components/sn-collapse/sn-collapse.vue';
import SnCollapseItem from '@snui/uni-src/components/sn-collapse/sn-collapse-item.vue';

const viewmore = ref(false);
const open = ref(['a']);
const attempts = ref(0);

/** 前两次展开被拦下。 */
function beforeExpend(): boolean {
  attempts.value += 1;
  return attempts.value > 2;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label">viewmore + more 插槽 + custom-more-slot-class</text>
    <SnCollapse v-model="viewmore" viewmore :line-num="2" custom-more-slot-class="sn-demo__more">
      <SnCollapseItem name="intro" title="框架介绍" :border="false">
        <text class="sn-demo__body">
          这一段用来验证 line-num 收起效果：展开前只显示两行，点击下方的自定义按钮才会完全展开。 AUI
          以 Schema 为唯一事实来源，Protocol、Runtime、Renderer 三层分离。
        </text>
      </SnCollapseItem>
      <template #more="{ expanded }">
        <view class="sn-demo__more-inner">
          <text class="sn-demo__more-text">{{ expanded ? '收起全部' : '展开全部' }}</text>
          <SnIcon class="sn-demo__more-icon" :icon="ChevronDown" size="var(--sn-mp-icon-size-small)" />
        </view>
      </template>
    </SnCollapse>

    <text class="sn-demo__label">before-expend 拦截 + title 插槽</text>
    <SnCollapse v-model="open">
      <SnCollapseItem
        name="a"
        title="配送方式"
        :before-expend="beforeExpend"
        custom-body-class="sn-demo__body"
      >
        <template #title="{ expanded }">
          <view class="sn-demo__title">
            <SnIcon
              class="sn-demo__title-icon"
              :icon="Truck"
              size="var(--sn-mp-icon-size-medium)"
            />
            <text class="sn-demo__title-text"
              >配送方式（title 插槽 · {{ expanded ? '已展开' : '已收起' }}）</text
            >
          </view>
        </template>
        <text class="sn-demo__body">顺丰速运，预计 2 天送达。</text>
      </SnCollapseItem>
      <SnCollapseItem name="b" title="支付方式">
        <text class="sn-demo__body">支持微信支付与支付宝。</text>
      </SnCollapseItem>
    </SnCollapse>

    <text class="sn-demo__meta"
      >before-expend 已拦截 {{ Math.min(attempts, 2) }} 次；已展开：{{
        open.join('、') || '无'
      }}</text
    >
  </view>
</template>

<style scoped>
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__body {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__more-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--sn-mp-spacing-1);
}
.sn-demo__more-text {
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__more-icon {
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__title {
  display: flex;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
}
.sn-demo__title-icon {
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__title-text {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
}
/* custom-more-slot-class 落在 sn-collapse 的底部区域上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__more) {
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}
/* custom-body-class 落在 item 的内容容器上。 */
.sn-demo :deep(.sn-demo__body) {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}
</style>
