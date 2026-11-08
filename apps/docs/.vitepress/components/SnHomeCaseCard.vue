<script setup lang="ts">
/**
 * SnHomeCaseCard — 首页「场景案例」的单张案例卡（磨砂悬浮卡体系）。
 *
 * 骨架对齐首页设计稿：卡头（标题 + 能力标签 + 编号）→ 内容 → 底部状态行。
 *
 * **取色全部走 token**：卡面 / 描边 / 文字 / 状态条都用 `--sn-web-*` 语义层
 * （`--aui-*` 的别名），因此：
 *   - 切换 Style Pack（Default / iOS / Doodle / Dark）整卡即时换肤；
 *   - 站点暗色模式（`html.dark`）自动翻转，卡内不用「恒亮窗」黑科技 ——
 *     卡里的 @snui/vue-web 组件读同一套 token，天然一致。
 *
 * 卡面是半透磨砂玻璃：内容面用 `--sn-web-color-background-surface` 的
 * 半透明混合 + backdrop blur，深色下同一表达式落在暗色 token 上。
 *
 * 卡片根节点是 SnWaterfall 的直接子节点（会被包进瀑布流 item box），
 * 因此根上不写任何 margin —— 列间距 / 行距由瀑布流的 gap 负责。
 */
import type { HomeCaseAccent } from '../utils/home-cases';

withDefaults(
  defineProps<{
    /** 案例标题。 */
    title: string;
    /** 案例副标题（一句话场景描述，显示在标题下方）。 */
    desc?: string;
    /** 内容区高度档位（sm / md / lg）。 */
    size?: 'sm' | 'md' | 'lg';
    /** 卡头能力标签（语言中立的技术 tag）。 */
    badge?: string;
    /** 卡头编号（`AI #01` / `#01`）。 */
    index?: string;
    /** 强调色档（badge / 编号 / 状态条取色）。 */
    accent?: HomeCaseAccent;
    /** 底部左：组件 / 协议签名。 */
    api?: string;
    /** 底部右：状态文案；缺省 `● Live`。 */
    status?: string;
    /** AI 原生场景卡：编号做成胶囊，卡面加一层强调色描边。 */
    featured?: boolean;
  }>(),
  {
    desc: undefined,
    size: undefined,
    badge: undefined,
    index: undefined,
    accent: 'blue',
    api: undefined,
    status: undefined,
    featured: false,
  },
);
</script>

<template>
  <article
    class="sn-case"
    :class="[
      size ? `sn-case--${size}` : '',
      `sn-case--${accent}`,
      { 'sn-case--featured': featured },
    ]"
  >
    <header class="sn-case__head">
      <div class="sn-case__head-text">
        <h3 class="sn-case__title">
          <span class="sn-case__name">{{ title }}</span>
          <span v-if="badge" class="sn-case__tag">{{ badge }}</span>
        </h3>
        <p v-if="desc" class="sn-case__subtitle">{{ desc }}</p>
      </div>
      <span v-if="index" class="sn-case__index">{{ index }}</span>
    </header>

    <div class="sn-case__body">
      <slot />
    </div>

    <footer v-if="api || status" class="sn-case__foot">
      <span class="sn-case__api">{{ api }}</span>
      <span class="sn-case__status">{{ status ?? '● Live' }}</span>
    </footer>
  </article>
</template>

<style scoped>
/* ── 强调色档（badge / 编号 / 状态条共用） ──
 * 只有「强调」这一维是文案色板（设计稿里 AI 卡/组件卡的颜色区分），
 * 其余全部走 token，因此换肤不会破坏卡片的可读性。 */
.sn-case,
.sn-case--blue {
  --sn-case-accent: #2563eb;
  --sn-case-accent-soft: rgb(37 99 235 / 0.1);
  --sn-case-accent-ring: rgb(37 99 235 / 0.26);
  --sn-case-accent-ink: #1d4ed8;
}
.sn-case--indigo {
  --sn-case-accent: #6366f1;
  --sn-case-accent-soft: rgb(99 102 241 / 0.12);
  --sn-case-accent-ring: rgb(99 102 241 / 0.3);
  --sn-case-accent-ink: #4338ca;
}
.sn-case--emerald {
  --sn-case-accent: #10b981;
  --sn-case-accent-soft: rgb(16 185 129 / 0.12);
  --sn-case-accent-ring: rgb(16 185 129 / 0.3);
  --sn-case-accent-ink: #047857;
}
.sn-case--fuchsia {
  --sn-case-accent: #d946ef;
  --sn-case-accent-soft: rgb(217 70 239 / 0.12);
  --sn-case-accent-ring: rgb(217 70 239 / 0.3);
  --sn-case-accent-ink: #a21caf;
}
.sn-case--amber {
  --sn-case-accent: #f59e0b;
  --sn-case-accent-soft: rgb(245 158 11 / 0.14);
  --sn-case-accent-ring: rgb(245 158 11 / 0.32);
  --sn-case-accent-ink: #b45309;
}
.sn-case--teal {
  --sn-case-accent: #14b8a6;
  --sn-case-accent-soft: rgb(20 184 166 / 0.12);
  --sn-case-accent-ring: rgb(20 184 166 / 0.3);
  --sn-case-accent-ink: #0f766e;
}
html.dark .sn-case--blue {
  --sn-case-accent-soft: rgb(96 165 250 / 0.16);
  --sn-case-accent-ring: rgb(96 165 250 / 0.38);
  --sn-case-accent-ink: #93c5fd;
}
html.dark .sn-case--indigo {
  --sn-case-accent-soft: rgb(129 140 248 / 0.16);
  --sn-case-accent-ring: rgb(129 140 248 / 0.38);
  --sn-case-accent-ink: #a5b4fc;
}
html.dark .sn-case--emerald {
  --sn-case-accent-soft: rgb(52 211 153 / 0.16);
  --sn-case-accent-ring: rgb(52 211 153 / 0.38);
  --sn-case-accent-ink: #6ee7b7;
}
html.dark .sn-case--fuchsia {
  --sn-case-accent-soft: rgb(232 121 249 / 0.16);
  --sn-case-accent-ring: rgb(232 121 249 / 0.38);
  --sn-case-accent-ink: #f0abfc;
}
html.dark .sn-case--amber {
  --sn-case-accent-soft: rgb(251 191 36 / 0.18);
  --sn-case-accent-ring: rgb(251 191 36 / 0.4);
  --sn-case-accent-ink: #fcd34d;
}
html.dark .sn-case--teal {
  --sn-case-accent-soft: rgb(45 212 191 / 0.16);
  --sn-case-accent-ring: rgb(45 212 191 / 0.38);
  --sn-case-accent-ink: #5eead4;
}

/* ── 灰白渐变 + 雾感磨砂卡面（沿用既有外观） ──
 * 渐变三档取自 token（background-subtle → surface）：默认皮肤就是「上灰下白」
 * 的柔和渐变，切 Style Pack / 暗色时同一段渐变跟着翻转，无需另写一套。 */
.sn-case {
  position: relative;
  box-sizing: border-box;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--sn-web-color-border-default, #e4e4e7) 60%, transparent);
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    var(--sn-web-color-background-subtle, #eef1f5) 0%,
    color-mix(
        in srgb,
        var(--sn-web-color-background-subtle, #f7f9fb) 52%,
        var(--sn-web-color-background-surface, #ffffff)
      )
      46%,
    var(--sn-web-color-background-surface, #ffffff) 100%
  );
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  box-shadow:
    0 16px 36px -14px rgb(15 23 42 / 0.1),
    0 2px 6px -1px rgb(15 23 42 / 0.04),
    inset 0 1px 1px 0 color-mix(in srgb, #fff 70%, transparent);
  color: var(--sn-web-color-text-primary, #09090b);
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s;
}
.sn-case:hover {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--sn-web-color-border-default, #e4e4e7) 100%, transparent);
  box-shadow:
    0 24px 48px -14px rgb(15 23 42 / 0.14),
    0 4px 12px -2px rgb(15 23 42 / 0.05),
    inset 0 1px 1px 0 color-mix(in srgb, #fff 85%, transparent);
}
html.dark .sn-case {
  box-shadow:
    0 16px 36px -14px rgb(0 0 0 / 0.5),
    0 2px 6px -1px rgb(0 0 0 / 0.35),
    inset 0 1px 1px 0 rgb(255 255 255 / 0.06);
}
html.dark .sn-case:hover {
  box-shadow:
    0 24px 48px -14px rgb(0 0 0 / 0.6),
    0 4px 12px -2px rgb(0 0 0 / 0.4),
    inset 0 1px 1px 0 rgb(255 255 255 / 0.1);
}
/* AI 原生场景卡：一圈强调色描边 */
.sn-case--featured {
  border-color: var(--sn-case-accent-ring);
}

/* ── 卡头：标题 + badge 居左，编号居右 ── */
.sn-case__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding-bottom: 12px;
  margin-bottom: 14px;
  border-bottom: 1px solid
    color-mix(in srgb, var(--sn-web-color-border-subtle, #e4e4e7) 78%, transparent);
}
.sn-case__head-text {
  min-width: 0;
}
.sn-case__title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--sn-web-color-text-primary, #09090b);
}
.sn-case__tag {
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--sn-case-accent-ink);
  background: var(--sn-case-accent-soft);
}
.sn-case__subtitle {
  margin: 3px 0 0;
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}
.sn-case__index {
  flex-shrink: 0;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 12px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}
.sn-case--featured .sn-case__index {
  padding: 3px 10px;
  border-radius: 999px;
  color: var(--sn-case-accent-ink);
  background: var(--sn-case-accent-soft);
}

/* ── 内容窗：白净底 + 底缘薄雾 ──
 * 窗底取 token surface；「雾」是「surface 0% → surface 100%」的渐隐 + 轻微
 * backdrop-blur，过渡带长、无平台段，所以是自然衔接而不是一条硬边；遮罩让
 * 模糊一起渐入，pointer-events: none 保证雾下的组件照旧可点。
 *
 * 高度由档位类 `--sn-case-body-min` 提供（min-height，不是固定高度）：
 * 同档卡等高 → 瀑布流三列齐平；内容更高的卡自然增高，不会被裁掉。 */
.sn-case__body {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
  min-height: var(--sn-case-body-min, 148px);
  padding: 12px 12px 22px;
  border: 1px solid color-mix(in srgb, var(--sn-web-color-border-subtle, #e4e4e7) 70%, transparent);
  border-radius: 13px;
  background: var(--sn-web-color-background-surface, #ffffff);
  color: var(--sn-web-color-text-primary, #09090b);
}
/* 档位 → 内容窗最小高度（取值见 home-cases.ts `HomeCaseSize`）。 */
.sn-case--c188 {
  --sn-case-body-min: 188px;
}
.sn-case--c208 {
  --sn-case-body-min: 208px;
}
.sn-case--c228 {
  --sn-case-body-min: 228px;
}
.sn-case--c248 {
  --sn-case-body-min: 248px;
}
.sn-case--c288 {
  --sn-case-body-min: 288px;
}
.sn-case--c308 {
  --sn-case-body-min: 308px;
}
.sn-case--c338 {
  --sn-case-body-min: 338px;
}
.sn-case--c378 {
  --sn-case-body-min: 378px;
}
.sn-case--c388 {
  --sn-case-body-min: 388px;
}
.sn-case--c398 {
  --sn-case-body-min: 398px;
}
.sn-case--c418 {
  --sn-case-body-min: 418px;
}
.sn-case--c428 {
  --sn-case-body-min: 428px;
}
.sn-case__body::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: min(48%, 46px);
  border-radius: 0 0 12px 12px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--sn-web-color-background-surface, #ffffff) 0%, transparent) 0%,
    var(--sn-web-color-background-surface, #ffffff) 100%
  );
  backdrop-filter: blur(1.5px) saturate(1.02);
  -webkit-backdrop-filter: blur(1.5px) saturate(1.02);
  -webkit-mask-image: linear-gradient(180deg, rgb(0 0 0 / 0) 0%, #000 64%, #000 100%);
  mask-image: linear-gradient(180deg, rgb(0 0 0 / 0) 0%, #000 64%, #000 100%);
  pointer-events: none;
}

/* ── 底部：组件 / 协议签名居左，状态居右 ── */
.sn-case__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-top: 12px;
  margin-top: 14px;
  border-top: 1px solid
    color-mix(in srgb, var(--sn-web-color-border-subtle, #e4e4e7) 78%, transparent);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11px;
  line-height: 1.4;
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}
.sn-case__api {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sn-case__status {
  flex-shrink: 0;
  font-weight: 700;
  color: var(--sn-case-accent-ink);
}

/* 卡内组件拉伸到整宽（表单 / 表格 / 媒体类场景） */
.sn-case__body :deep(.sn-input),
.sn-case__body :deep(.sn-input-number),
.sn-case__body :deep(.sn-select),
.sn-case__body :deep(.sn-slider),
.sn-case__body :deep(.sn-pagination),
.sn-case__body :deep(.sn-progress),
.sn-case__body :deep(.sn-statistic),
.sn-case__body :deep(.sn-date-picker),
.sn-case__body :deep(.sn-data-table),
.sn-case__body :deep(.sn-video-player),
.sn-case__body :deep(.sn-image),
.sn-case__body :deep(.sn-calendar),
.sn-case__body :deep(.sn-color-picker) {
  width: 100%;
}
</style>
