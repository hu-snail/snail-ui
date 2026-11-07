<script setup lang="ts">
/**
 * SnHomeCaseCard — 首页「场景案例」的单张案例卡。
 *
 * 视觉：中性预览卡 —— 灰白渐变卡面 + 细描边（无投影，与卡面自然衔接）；
 * 上半部是透明预览画布（stage，本身不落色），画布内嵌一块白色窗（window）
 * @snui/vue-web 组件演示（可交互）；下半部一行 footer：案例名称居左，
 * 右侧两枚装饰性平台徽标（Web / Mobile）。深浅主题各一套卡面配方，
 * 窗体恒为亮色 —— 组件以亮色 token 渲染，深色页面上作为「亮窗」呈现。
 *
 * 兼容说明：demo（SnHomeCaseDemo）取色的 `--sn-case-*` 变量语义保留，
 * 但改为「窗内恒亮语境」—— 不随主题翻转（窗体总是白色）；卡片自身的
 * 主题相关配色走独立变量，两套互不干扰。
 *
 * 卡片根节点是 SnWaterfall 的直接子节点（会被包进瀑布流 item box），
 * 因此根上不写任何 margin —— 列间距 / 行距由瀑布流的 gap 负责。
 */
import { Globe, Smartphone } from 'lucide-vue-next';

defineProps<{
  /** 案例标题。 */
  title: string;
  /** 案例副标题（一句话场景描述；不占版面，悬停以 tooltip 呈现）。 */
  desc?: string;
  /** 预览画布高度档位（sm / md / lg）。 */
  size?: 'sm' | 'md' | 'lg';
}>();
</script>

<template>
  <article class="sn-case" :class="size ? `sn-case--${size}` : undefined" :title="desc">
    <div class="sn-case__stage">
      <div class="sn-case__window">
        <slot />
      </div>
    </div>

    <footer class="sn-case__foot">
      <h3 class="sn-case__title">{{ title }}</h3>
      <span class="sn-case__badges" aria-hidden="true">
        <Globe class="sn-case__badge" />
        <Smartphone class="sn-case__badge" />
      </span>
    </footer>
  </article>
</template>

<style scoped>
/* ── 中性预览卡 ──
 * 卡面 / 画布 / 窗 / footer 全部随主题翻转（浅色 = 白卡白窗，深色 = 深卡深窗）；
 * --sn-case-* 是窗内语境变量，深浅两套（见下方 html.dark），窗内的
 * SnHomeCaseDemo 与 @snui 组件因此始终落在同一套配色里。 */
.sn-case {
  /* 窗内语境（亮色一套；深色主题里整组翻转，见下方 html.dark） */
  --sn-case-ink: #101828;
  --sn-case-ink-2: #475467;
  --sn-case-ink-3: #98a2b3;
  --sn-case-panel: #f2f4f7;
  --sn-case-panel-strong: #e6eaf0;
  --sn-case-panel-ink: #1d2939;
  --sn-case-panel-ink-2: #667085;
  /* 卡级配色（主题相关） */
  --sn-case-card-bg: linear-gradient(180deg, #eef1f5 0%, #f7f9fb 46%, #ffffff 100%);
  --sn-case-card-border: rgb(16 24 40 / 0.06);
  --sn-case-card-border-hover: rgb(16 24 40 / 0.14);
  --sn-case-window-border: rgb(16 24 40 / 0.06);
  --sn-case-window-bg: #ffffff;
  --sn-case-window-bg-0: rgb(255 255 255 / 0);
  --sn-case-foot-ink: #101828;
  --sn-case-foot-icon: #98a2b3;

  position: relative;
  box-sizing: border-box;
  padding: 8px;
  border: 1px solid var(--sn-case-card-border);
  border-radius: 16px;
  background: var(--sn-case-card-bg);
  transition: border-color 0.2s;
}
.sn-case:hover {
  border-color: var(--sn-case-card-border-hover);
}

/* 深色主题：卡面 / 窗 / 窗内语境一起翻转 */
html.dark .sn-case {
  /* 窗内语境（深色）：SnHomeCaseDemo 与窗内 @snui 组件共用这套取值 */
  --sn-case-ink: #f2f5fb;
  --sn-case-ink-2: #c7cfdd;
  --sn-case-ink-3: #8b95a7;
  --sn-case-panel: #232935;
  --sn-case-panel-strong: #2c3441;
  --sn-case-panel-ink: #e6ebf5;
  --sn-case-panel-ink-2: #a7b0c0;
  /* 卡级配色 */
  --sn-case-card-bg: linear-gradient(180deg, #1d212a 0%, #151920 55%, #101318 100%);
  --sn-case-card-border: rgb(255 255 255 / 0.08);
  --sn-case-card-border-hover: rgb(255 255 255 / 0.18);
  --sn-case-window-border: rgb(255 255 255 / 0.09);
  --sn-case-window-bg: #191e27;
  --sn-case-window-bg-0: rgb(25 30 39 / 0);
  --sn-case-foot-ink: #f2f5fb;
  --sn-case-foot-icon: rgb(226 232 244 / 0.42);
}

/* ── 预览画布：透明底 + 内嵌主题窗（真实组件演示；窗不着投影，自然衔接） ──
 * min-height 档位让瀑布流保持自然错落；内容超出时卡片自然增高。 */
.sn-case__stage {
  display: flex;
  box-sizing: border-box;
  min-height: 128px;
  padding: 12px 12px 0;
  background: none;
}
.sn-case--md .sn-case__stage {
  min-height: 184px;
}
.sn-case--lg .sn-case__stage {
  min-height: 256px;
}
.sn-case__window {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  box-sizing: border-box;
  padding: 12px;
  border: 1px solid var(--sn-case-window-border);
  border-radius: 12px;
  background: var(--sn-case-window-bg);
  /* 窗内语境同样接管继承色：首页 .sn-home 有一套固定 ink，不隔离的话
   * 深色下窗里任何「靠继承取色」的文字都会变成近黑。 */
  color: var(--sn-case-ink);
}

/* ── 雾 ──
 * 窗底盖一层薄雾：下层内容轻微模糊 + 一路渐隐到窗面色。三个细节让它是
 * 「自然衔接」而不是一条硬边：
 *   - 过渡带够长（54% 高度）；
 *   - 颜色是 0 → 1 的线性斜坡（不再「74% 起就是实色」的平台），任何位置
 *     都没有颜色跳变；
 *   - 模糊跟着一起遮罩渐入 —— backdrop-filter 作用于整个盒子，不遮罩的话
 *     雾的上沿就是一条突兀的「开始变糊」的直线（此前生硬的根因）。
 * pointer-events: none，雾下的组件照旧可点。 */
.sn-case__window::after {
  content: '';
  position: absolute;
  inset: auto 0 0;
  height: 54%;
  border-radius: 0 0 11px 11px;
  background: linear-gradient(180deg, var(--sn-case-window-bg-0) 0%, var(--sn-case-window-bg) 100%);
  backdrop-filter: blur(1.5px) saturate(1.02);
  -webkit-backdrop-filter: blur(1.5px) saturate(1.02);
  -webkit-mask-image: linear-gradient(180deg, rgb(0 0 0 / 0) 0%, #000 64%, #000 100%);
  mask-image: linear-gradient(180deg, rgb(0 0 0 / 0) 0%, #000 64%, #000 100%);
  pointer-events: none;
}

/* ── footer：名称居左 / 平台徽标居右 ── */
.sn-case__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 11px 8px 5px;
}
.sn-case__title {
  margin: 0;
  overflow: hidden;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--sn-case-foot-ink);
  white-space: nowrap;
  text-overflow: ellipsis;
}
.sn-case__badges {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}
.sn-case__badge {
  width: 15px;
  height: 15px;
  color: var(--sn-case-foot-icon);
}

/* Demo 里拉伸到整宽的控件 */
.sn-case__window :deep(.sn-input),
.sn-case__window :deep(.sn-input-number),
.sn-case__window :deep(.sn-select),
.sn-case__window :deep(.sn-slider),
.sn-case__window :deep(.sn-pagination),
.sn-case__window :deep(.sn-progress),
.sn-case__window :deep(.sn-statistic),
.sn-case__window :deep(.sn-date-picker),
.sn-case__window :deep(.sn-data-table),
.sn-case__window :deep(.sn-video-player),
.sn-case__window :deep(.sn-image),
.sn-case__window :deep(.sn-calendar) {
  width: 100%;
}

/* 卡片内按钮的通栏变体（场景里常见的主操作） */
.sn-case__window :deep(.sn-case-block) {
  width: 100%;
}
</style>
