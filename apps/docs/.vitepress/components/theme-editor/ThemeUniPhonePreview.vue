<script setup lang="ts">
/**
 * ThemeUniPhonePreview — 主题编辑器的 uni-app 端手机模拟预览。
 *
 * ## 尺寸：真实手机比例
 *
 * 屏幕是 iPhone 的逻辑视口 `390 × 844`（14 / 15 标准机型），按比例缩放适配
 * 可用高度：`transform: scale()` 缩放整台设备，**不**改变内部布局像素，
 * 因此组件仍按真实 390px 宽排版，只是整体看起来小一些。这样：
 *
 *   - 屏幕宽高比永远是 390:844（真机比例），不会被拉扁；
 *   - 内容超出时**在屏幕内部滚动**（`.sn-mp-preview__scroll` 是唯一的滚动容器），
 *     不会把整台设备撑高、也不会让页面出现第二个滚动条。
 *
 * ## rpx 的两种处理
 *
 * 1. **编译期**：`apps/docs/.vitepress/utils/rpx-transform.ts` 把
 *    `packages/uni/src/**` 里 SFC 的 `rpx` 全量换算成 px（1rpx = 0.5px，
 *    750 设计宽 → 375px）。这是组件样式能显示出来的前提 —— 浏览器不认识
 *    `rpx`，含 `rpx` 的声明会被整条丢弃（按钮塌成纯文字就是这么来的）。
 * 2. **运行时**：`--sn-mp-*` 变量由 `buildMpVars()` 输出为 rpx，这里再换算成
 *    与屏幕宽度匹配的 px（`1rpx = SCREEN_WIDTH / 750`）。因为屏幕按 390 逻辑
 *    宽渲染，`1rpx = 0.52px`，与真机一致。
 *
 * ## 为什么不是直接嵌 uni-demo 的 iframe
 *
 * 文档站其它 uni 预览走部署站 iframe（ADR-0005），但跨文档无法注入主题变量；
 * 主题编辑器需要「改一次立刻两端同时变」，因此这里用同名组件的 DOM 复刻。
 * 复刻的组件清单与 uni-demo 首页一致，并补上了表单/数据展示分区。
 */

import { computed, ref } from 'vue';
import SnAvatar from '@snui/uni-src/components/sn-avatar/sn-avatar.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCard from '@snui/uni-src/components/sn-card/sn-card.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnDivider from '@snui/uni-src/components/sn-divider/sn-divider.vue';
import SnGap from '@snui/uni-src/components/sn-gap/sn-gap.vue';
import SnInput from '@snui/uni-src/components/sn-input/sn-input.vue';
import SnProgress from '@snui/uni-src/components/sn-progress/sn-progress.vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';
import SnSlider from '@snui/uni-src/components/sn-slider/sn-slider.vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';
import type { SemanticColors, ThemeEditorConfig, VarMap } from '../../utils/theme-editor/vars';

interface Props {
  config: ThemeEditorConfig;
  colors: SemanticColors;
  vars: VarMap;
  english?: boolean;
}
const props = withDefaults(defineProps<Props>(), { english: false });

const t = (zh: string, en: string): string => (props.english ? en : zh);

/** 屏幕逻辑尺寸 —— iPhone 14 / 15 的视口（390 × 844）。 */
const SCREEN_WIDTH = 390;
const SCREEN_HEIGHT = 844;

/** 750rpx 设计宽 → 屏幕宽。1rpx = 390 / 750 = 0.52px。 */
const RPX_RATIO = SCREEN_WIDTH / 750;

/** rpx → px（运行时兜底：组件内联样式里的 rpx 也一并换算）。 */
function rpxToPx(value: string): string {
  return value.replace(/(-?\d*\.?\d+)rpx/g, (_match, num: string) => {
    const px = Number(num) * RPX_RATIO;
    return `${Number(px.toFixed(3))}px`;
  });
}

/** 换算后的变量映射（同一组 --sn-mp-*，单位从 rpx 变成 px）。 */
const screenVars = computed<Record<string, string>>(() => {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(props.vars)) {
    out[name] = rpxToPx(value);
  }
  // `--sn-mp-radius-full` 在真机是 9999rpx ≈ 半个屏宽，用来表达「胶囊」。
  // 换算成 px 后是 5200px，超过元素 box 会让圆角变成椭圆弧，所以钳到半宽。
  if ('--sn-mp-radius-full' in out) out['--sn-mp-radius-full'] = `${SCREEN_WIDTH / 2}px`;
  return out;
});

/** 屏幕样式：底色跟随主题的表面色（深色模式下整机变暗）。 */
const screenStyle = computed(() => ({
  ...screenVars.value,
  width: `${SCREEN_WIDTH}px`,
  height: `${SCREEN_HEIGHT}px`,
  background: props.colors.background.sunken,
}));

// ─── 交互状态（纯 UI） ────────────────────────────────────────────────────
const switchOn = ref(true);
const checkboxOn = ref(true);
const rateValue = ref(4);
const sliderValue = ref(40);
const inputValue = ref('');
const progressValue = ref(68);

/** 色阶档位（与 Web 端一致）。 */
const scaleSteps = computed(() =>
  Object.entries(props.colors.primary).map(([step, color]) => ({ step, color })),
);

/** 单元格内容。 */
const cells = computed(() => [
  { label: t('主题色阶', 'Theme ramp'), value: t('11 档', '11 steps') },
  { label: t('圆角', 'Radius'), value: `${props.config.radius}rem` },
  { label: t('尺寸', 'Size'), value: props.config.size },
  { label: t('间距', 'Spacing'), value: props.config.spacing },
]);
</script>

<template>
  <div class="sn-mp-preview-wrap">
    <!-- 设备外框：按真实屏幕尺寸渲染，再用 scale 适配可用高度 -->
    <div class="sn-mp-preview" :style="screenStyle">
      <!-- 状态栏 + 灵动岛 -->
      <div class="sn-mp-preview__statusbar" aria-hidden="true">
        <span class="sn-mp-preview__time">9:41</span>
        <span class="sn-mp-preview__island" />
        <span class="sn-mp-preview__indicators">
          <span class="sn-mp-preview__signal" />
          <span class="sn-mp-preview__battery" />
        </span>
      </div>

      <!-- 导航栏（小程序胶囊） -->
      <div class="sn-mp-preview__navbar">
        <span class="sn-mp-preview__navbar-back" aria-hidden="true">‹</span>
        <span class="sn-mp-preview__navbar-title">{{ t('主题预览', 'Theme preview') }}</span>
        <span class="sn-mp-preview__capsule" aria-hidden="true">
          <span class="sn-mp-preview__capsule-dots">•••</span>
          <span class="sn-mp-preview__capsule-divider" />
          <span class="sn-mp-preview__capsule-target" />
        </span>
      </div>

      <!-- 页面内容（唯一滚动容器） -->
      <div class="sn-mp-preview__scroll">
        <div class="sn-mp-preview__hero">
          <div class="sn-mp-preview__hero-title">{{ t('主题编辑器', 'Theme editor') }}</div>
          <div class="sn-mp-preview__hero-sub">
            {{ t('实时预览 uni 端 token', 'Live uni-end token preview') }}
          </div>
        </div>

        <SnSearch :model-value="''" :placeholder="t('搜索组件', 'Search components')" />

        <div class="sn-mp-preview__scale" aria-hidden="true">
          <span
            v-for="item in scaleSteps"
            :key="item.step"
            class="sn-mp-preview__scale-chip"
            :style="{ background: item.color }"
          />
        </div>

        <!-- 按钮 -->
        <SnCard :title="t('按钮', 'Buttons')">
          <div class="sn-mp-preview__buttons">
            <SnButton type="primary">{{ t('主要', 'Primary') }}</SnButton>
            <SnButton type="primary" variant="plain">{{ t('朴素', 'Plain') }}</SnButton>
            <SnButton type="primary" variant="soft">{{ t('柔和', 'Soft') }}</SnButton>
            <SnButton>{{ t('默认', 'Default') }}</SnButton>
            <SnButton type="danger">{{ t('危险', 'Danger') }}</SnButton>
            <SnButton type="primary" disabled>{{ t('禁用', 'Disabled') }}</SnButton>
          </div>
          <SnButton type="primary" block size="large">{{ t('通栏按钮', 'Block button') }}</SnButton>
        </SnCard>

        <!-- 标签 / 头像 -->
        <SnCard :title="t('标签与头像', 'Tags & avatars')">
          <div class="sn-mp-preview__row">
            <SnTag type="primary" variant="dark">{{ t('主要', 'Primary') }}</SnTag>
            <SnTag type="success" variant="light">{{ t('成功', 'Success') }}</SnTag>
            <SnTag type="warning" variant="light">{{ t('警告', 'Warning') }}</SnTag>
            <SnTag type="danger" variant="plain">{{ t('危险', 'Danger') }}</SnTag>
          </div>
          <div class="sn-mp-preview__row sn-mp-preview__row--avatars">
            <SnAvatar size="40" text="A" />
            <SnAvatar size="40" text="B" />
            <SnAvatar size="40" text="C" />
            <SnAvatar size="40" text="D" />
          </div>
        </SnCard>

        <!-- 表单控件 -->
        <SnCard :title="t('控件', 'Controls')">
          <div class="sn-mp-preview__control-row">
            <span class="sn-mp-preview__control-label">{{ t('开关', 'Switch') }}</span>
            <SnSwitch v-model:model-value="switchOn" />
          </div>
          <div class="sn-mp-preview__control-row">
            <span class="sn-mp-preview__control-label">{{ t('勾选', 'Checkbox') }}</span>
            <SnCheckbox v-model:model-value="checkboxOn">{{ t('我已阅读', 'I agree') }}</SnCheckbox>
          </div>
          <div class="sn-mp-preview__control-row">
            <span class="sn-mp-preview__control-label">{{ t('评分', 'Rate') }}</span>
            <SnRate v-model:model-value="rateValue" :num="5" />
          </div>
          <div class="sn-mp-preview__control-block">
            <span class="sn-mp-preview__control-label">{{ t('滑块', 'Slider') }}</span>
            <SnSlider v-model:model-value="sliderValue" />
          </div>
          <div class="sn-mp-preview__control-block">
            <span class="sn-mp-preview__control-label">{{ t('进度', 'Progress') }}</span>
            <SnProgress :percentage="progressValue" />
          </div>
          <SnInput
            v-model:model-value="inputValue"
            :placeholder="t('请输入内容', 'Type something')"
          />
        </SnCard>

        <!-- 单元格组 -->
        <SnCellGroup>
          <SnCell
            v-for="cell in cells"
            :key="cell.label"
            :title="cell.label"
            :value="cell.value"
            is-link
          />
        </SnCellGroup>

        <SnDivider>{{ t('uni-app 端预览', 'uni-app end preview') }}</SnDivider>
        <SnGap :height="12" />
      </div>

      <!-- Home indicator -->
      <div class="sn-mp-preview__home" aria-hidden="true"><span /></div>
    </div>
  </div>
</template>

<style scoped>
/*
 * 外层：给设备一个居中的舞台，并把「真实尺寸 → 可用高度」的缩放放在这里。
 * 缩放用 CSS 变量驱动，默认按舞台高度自适应（下方 @media 逐步收紧）。
 */
.sn-mp-preview-wrap {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  /* 设备按 390 逻辑宽渲染；缩放后视觉宽度约为 --sn-mp-scale × 390 */
  --sn-mp-scale: 0.82;
  height: calc(844px * var(--sn-mp-scale));
}

/*
 * 屏幕本体：**真实** 390 × 844 逻辑尺寸（比例就是真机比例），
 * 通过 transform 缩放来适配舞台，内部布局像素不受影响。
 */
.sn-mp-preview {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  overflow: hidden;
  border-radius: 44px;
  border: 1px solid var(--sn-mp-color-border-default);
  box-shadow:
    0 24px 60px -20px rgba(15, 23, 42, 0.28),
    0 2px 6px rgba(15, 23, 42, 0.06);
  color: var(--sn-mp-color-text-primary);
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei',
    sans-serif;
  /* 以左上角为原点缩放，再居中 */
  transform: scale(var(--sn-mp-scale));
  transform-origin: top center;
  isolation: isolate;
}

/* 视口较矮时进一步收紧（保持真机比例，只是更小） */
@media (max-height: 900px) {
  .sn-mp-preview-wrap {
    --sn-mp-scale: 0.68;
  }
}
@media (max-height: 760px) {
  .sn-mp-preview-wrap {
    --sn-mp-scale: 0.56;
  }
}

/* ── 状态栏 ── */
.sn-mp-preview__statusbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 22px;
  flex: 0 0 auto;
  font-size: 12px;
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}
.sn-mp-preview__time {
  font-variant-numeric: tabular-nums;
}
.sn-mp-preview__island {
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 92px;
  height: 24px;
  border-radius: 999px;
  background: #000;
}
.sn-mp-preview__indicators {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.sn-mp-preview__signal {
  width: 15px;
  height: 10px;
  background:
    linear-gradient(to right, currentColor 0 2px, transparent 2px 4px) no-repeat 0 100% / 2px 4px,
    linear-gradient(to right, currentColor 0 2px, transparent 2px 4px) no-repeat 5px 100% / 2px 6px,
    linear-gradient(to right, currentColor 0 2px, transparent 2px 4px) no-repeat 10px 100% / 2px
      10px;
  opacity: 0.85;
}
.sn-mp-preview__battery {
  position: relative;
  width: 20px;
  height: 10px;
  border: 1px solid currentColor;
  border-radius: 3px;
  opacity: 0.9;
}
.sn-mp-preview__battery::after {
  content: '';
  position: absolute;
  inset: 1.5px 4px 1.5px 1.5px;
  border-radius: 1px;
  background: currentColor;
}

/* ── 导航栏 ── */
.sn-mp-preview__navbar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  flex: 0 0 auto;
  border-bottom: 1px solid var(--sn-mp-color-border-subtle);
  background: var(--sn-mp-color-background-elevated);
}
.sn-mp-preview__navbar-back {
  position: absolute;
  left: 14px;
  font-size: 24px;
  line-height: 1;
  color: var(--sn-mp-color-text-primary);
  opacity: 0.7;
}
.sn-mp-preview__navbar-title {
  font-size: 15px;
  font-weight: 600;
}
.sn-mp-preview__capsule {
  position: absolute;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 24px;
  padding: 0 8px;
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: 999px;
  color: var(--sn-mp-color-text-secondary);
}
.sn-mp-preview__capsule-dots {
  font-size: 9px;
  letter-spacing: 0.5px;
}
.sn-mp-preview__capsule-divider {
  width: 1px;
  height: 11px;
  background: var(--sn-mp-color-border-default);
}
.sn-mp-preview__capsule-target {
  width: 11px;
  height: 11px;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  box-sizing: border-box;
}

/* ── 内容滚动区（唯一滚动容器） ── */
.sn-mp-preview__scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 12px 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scrollbar-width: none;
}
.sn-mp-preview__scroll::-webkit-scrollbar {
  display: none;
}

.sn-mp-preview__hero {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sn-mp-preview__hero-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--sn-mp-color-text-primary);
}
.sn-mp-preview__hero-sub {
  font-size: 12px;
  color: var(--sn-mp-color-text-tertiary);
}

.sn-mp-preview__scale {
  display: flex;
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid var(--sn-mp-color-border-subtle);
}
.sn-mp-preview__scale-chip {
  flex: 1 1 0;
}

.sn-mp-preview__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}
.sn-mp-preview__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.sn-mp-preview__row--avatars {
  margin-top: 10px;
}

.sn-mp-preview__control-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 6px 0;
}
.sn-mp-preview__control-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 6px 0;
}
.sn-mp-preview__control-label {
  font-size: 13px;
  color: var(--sn-mp-color-text-secondary);
}

/* ── Home indicator ── */
.sn-mp-preview__home {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 24px;
  flex: 0 0 auto;
  padding-bottom: 6px;
}
.sn-mp-preview__home span {
  width: 128px;
  height: 4px;
  border-radius: 999px;
  background: var(--sn-mp-color-text-primary);
  opacity: 0.28;
}

/*
 * 自定义元素补齐：uni 组件在浏览器里是 `<sn-button>` 等自定义元素，默认
 * `display: inline`，与真机 uni 运行时的盒模型不一致。这里只在模拟器内部
 * 修正根标签的 display，组件自身的 scoped CSS 照常作用在内部结构上。
 */
.sn-mp-preview :deep(sn-button),
.sn-mp-preview :deep(sn-card),
.sn-mp-preview :deep(sn-input),
.sn-mp-preview :deep(sn-search),
.sn-mp-preview :deep(sn-progress),
.sn-mp-preview :deep(sn-slider),
.sn-mp-preview :deep(sn-switch),
.sn-mp-preview :deep(sn-cell-group),
.sn-mp-preview :deep(sn-gap),
.sn-mp-preview :deep(sn-divider) {
  display: block;
}

.sn-mp-preview :deep(sn-tag),
.sn-mp-preview :deep(sn-rate),
.sn-mp-preview :deep(sn-checkbox),
.sn-mp-preview :deep(sn-avatar),
.sn-mp-preview :deep(sn-cell) {
  display: inline-block;
  vertical-align: middle;
}

/* 单元格组 / 卡片里的行内元素铺满宽度 */
.sn-mp-preview :deep(sn-cell) {
  display: block;
}
</style>
