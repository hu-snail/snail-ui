<script setup lang="ts">
/**
 * tooltip-web-appearance — 外观控制。
 *
 * 每个用例一张卡片：顶部写清用到的 prop，中间是触发器，底部补一句
 * 说明。所有卡片共用同一套 stage 内边距，避免「有的气泡能展开、
 * 有的被裁掉」。
 */
import { SnTooltip } from '@snui/vue-web';
</script>

<template>
  <div class="tt-appear">
    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">默认</code>
        <span class="tt-appear__name">带箭头</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="带箭头的气泡" placement="top">
          <button class="tt-appear__btn" type="button">悬停</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">箭头默认开启，指向触发器中心。</p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">:arrow="false"</code>
        <span class="tt-appear__name">无箭头</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="没有箭头" placement="top" :arrow="false">
          <button class="tt-appear__btn" type="button">悬停</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">关闭箭头后气泡保留同样的间距。</p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">arrow-point-to-center</code>
        <span class="tt-appear__name">箭头指中心</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="箭头指向气泡中心" placement="top" arrow-point-to-center>
          <button class="tt-appear__btn" type="button">悬停</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">默认指向触发器，开启后改为指向气泡自身中心。</p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">arrow-class</code>
        <span class="tt-appear__name">自定义箭头</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="箭头被放大并染色" placement="bottom" arrow-class="tt-appear__big-arrow">
          <button class="tt-appear__btn" type="button">悬停</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">通过 <code>arrowClass</code> 覆盖箭头尺寸与颜色。</p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">content-style</code>
        <span class="tt-appear__name">内容样式</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip
          content="正文用了自定义样式"
          placement="top"
          :content-style="{ color: 'var(--vp-c-brand-1)', fontWeight: '600' }"
        >
          <button class="tt-appear__btn" type="button">悬停</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">只影响气泡正文，不改变气泡外框。</p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">width="trigger"</code>
        <span class="tt-appear__name">等宽气泡</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="宽度与触发器一致" placement="bottom" width="trigger">
          <button class="tt-appear__btn tt-appear__btn--wide" type="button">
            这是一个很宽的触发器
          </button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">气泡宽度跟随触发器，适合列内对齐的提示。</p>
    </article>

    <article class="tt-appear__card">
      <header class="tt-appear__head">
        <code class="tt-appear__prop">:animated="false"</code>
        <span class="tt-appear__name">无动画</span>
      </header>
      <div class="tt-appear__stage">
        <SnTooltip content="无进出场动画" placement="top" :animated="false">
          <button class="tt-appear__btn" type="button">悬停</button>
        </SnTooltip>
      </div>
      <p class="tt-appear__desc">关闭进出场动画，适合高频或截图场景。</p>
    </article>
  </div>
</template>

<style scoped>
.tt-appear {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  width: 100%;
}
.tt-appear__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  padding: 14px;
}
.tt-appear__head {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tt-appear__prop {
  font-size: 11px;
  color: var(--vp-c-text-3);
}
.tt-appear__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.tt-appear__stage {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
.tt-appear__btn {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  padding: 6px 14px;
  border-radius: 6px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  transition:
    border-color 0.15s,
    color 0.15s;
}
.tt-appear__btn--wide {
  min-width: 200px;
}
.tt-appear__btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tt-appear__desc {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}
.tt-appear__desc code {
  font-size: 11px;
  padding: 1px 4px;
  border-radius: 3px;
  background: var(--vp-c-bg-alt);
}
/* Applied through the arrowClass prop; needs :deep to reach teleported DOM. */
:deep(.tt-appear__big-arrow) {
  border-width: 12px 12px 0 12px;
}
</style>
