<script setup lang="ts">
/**
 * tooltip-web-placement — Arco 风格 12 方位全览。
 *
 * 布局对齐参考库的方位图：气泡围绕中心触发器展开——
 *   上边一排（tl / top / tr），中间左右两列（lt / left / lb、rt / right / rb），
 *   下边一排（bl / bottom / br）。
 * 悬停任意按钮即以对应 placement 弹出。
 */
import { SnTooltip } from '@snui/vue-web';

const top = ['tl', 'top', 'tr'] as const;
const left = ['lt', 'left', 'lb'] as const;
const right = ['rt', 'right', 'rb'] as const;
const bottom = ['bl', 'bottom', 'br'] as const;
</script>

<template>
  <div class="tt-place">
    <!-- 上边一排 -->
    <div class="tt-place__row">
      <SnTooltip v-for="p in top" :key="p" :content="p" :placement="p">
        <button class="tt-place__btn" type="button">{{ p.toUpperCase() }}</button>
      </SnTooltip>
    </div>

    <!-- 中间：左列 / 右列，中间留出触发器区域 -->
    <div class="tt-place__middle">
      <div class="tt-place__col">
        <SnTooltip v-for="p in left" :key="p" :content="p" :placement="p">
          <button class="tt-place__btn" type="button">{{ p.toUpperCase() }}</button>
        </SnTooltip>
      </div>
      <div class="tt-place__center" aria-hidden="true">触发元素</div>
      <div class="tt-place__col">
        <SnTooltip v-for="p in right" :key="p" :content="p" :placement="p">
          <button class="tt-place__btn" type="button">{{ p.toUpperCase() }}</button>
        </SnTooltip>
      </div>
    </div>

    <!-- 下边一排 -->
    <div class="tt-place__row">
      <SnTooltip v-for="p in bottom" :key="p" :content="p" :placement="p">
        <button class="tt-place__btn" type="button">{{ p.toUpperCase() }}</button>
      </SnTooltip>
    </div>
  </div>
</template>

<style scoped>
.tt-place {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 24px 0;
}
.tt-place__row {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.tt-place__middle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
}
.tt-place__col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.tt-place__center {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 88px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  user-select: none;
}
.tt-place__btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  min-width: 84px;
}
.tt-place__btn:hover {
  border-color: var(--vp-c-brand-1);
}
</style>
