<script setup lang="ts">
/**
 * SnDocsHome — custom home page chrome, fully built from real
 * @snui/vue-web components (SnCard + SnGrid + SnButton + SnConfigProvider).
 *
 * Replaces vitepress's `home` layout YAML. Wires into `apps/docs/index.md.txt`
 * (which is the bare front-matter; this component is rendered via the
 * SnDocsLayout route composition rather than markdown-Vue interpolation,
 * because vitepress markdown's template binding parser mangles vue
 * `{{ }}` / `:prop` syntax inside HTML blocks).
 *
 * Per AUI-DOCS-019, this is Phase-1 of "replace docs chrome with real Sn*
 * components". Toggle Style Pack → the hero + features all follow the
 * active skin via CSS variables.
 *
 * Visual pattern: Mantine-style marketing landing — pill announcement,
 * single huge h1, concise subtitle, primary CTA, and 4 visual preview
 * cards (not text-heavy feature blurbs).
 */

import { SnButton, SnCard, SnConfigProvider, SnGrid, SnInput } from '@snui/vue-web'

function openGithub(): void {
  if (typeof window !== 'undefined') {
    window.open('https://github.com/hu-snail/snail-ui', '_blank', 'noopener')
  }
}
</script>

<template>
  <SnConfigProvider>
    <div class="sn-home">
      <!-- ─────────── Hero ─────────── -->
      <section class="sn-home__hero">
        <a href="/ai/overview" class="sn-home__pill">
          <span class="sn-home__pill-dot" aria-hidden="true" />
          <span class="sn-home__pill-text">New: Style Pack · MCP Server · SnForm</span>
          <span class="sn-home__pill-arrow" aria-hidden="true">→</span>
        </a>

        <h1 class="sn-home__title">
          The Foundation for<br>
          your AI-Native Design System
        </h1>

        <p class="sn-home__subtitle">
          面向 Vue 3（PC Web）+ uni-app（移动）的 AI-Native UI 框架生态。
          <strong>Web 端面向桌面</strong>，<strong>uni 端面向移动</strong>——两端从开发到打包完全独立，0 行源代码复用。未来 React 端按相同模式扩展。
        </p>

        <div class="sn-home__actions">
          <SnButton variant="primary" size="large" href="/guide/web/intro">
            开始使用
            <span class="sn-home__cta-arrow" aria-hidden="true">→</span>
          </SnButton>
          <SnButton variant="tertiary" size="large" @click="openGithub">
            GitHub
          </SnButton>
        </div>
      </section>

      <!-- ─────────── Visual preview grid ─────────── -->
      <section class="sn-home__previews">
        <SnGrid :cols="4" :x-gap="20" :y-gap="20">

          <!-- Card 1 — Components -->
          <SnCard variant="outlined" size="large" hoverable>
            <h3 class="sn-home-card__title">Components</h3>
            <p class="sn-home-card__sub">6 语义类型 · 5 尺寸 · 3 变体</p>
            <div class="sn-home-card__buttons">
              <SnButton variant="default" size="tiny">默认</SnButton>
              <SnButton variant="primary" size="tiny">主要</SnButton>
              <SnButton variant="info" size="tiny">信息</SnButton>
              <SnButton variant="success" size="tiny">成功</SnButton>
              <SnButton variant="warning" size="tiny">警告</SnButton>
              <SnButton variant="error" size="tiny">危险</SnButton>
            </div>
            <SnInput model-value="" placeholder="SnInput 搜索组件" size="small" />
          </SnCard>

          <!-- Card 2 — Style Pack -->
          <SnCard variant="outlined" size="large" hoverable>
            <h3 class="sn-home-card__title">Style Pack</h3>
            <p class="sn-home-card__sub">跨端共用风格包系统</p>
            <div class="sn-home-card__packs">
              <span class="pack-tag pack-tag--default">Default</span>
              <span class="pack-tag pack-tag--doodle">Doodle</span>
              <span class="pack-tag pack-tag--ios">iOS</span>
              <span class="pack-tag pack-tag--mp">mp-taobao</span>
            </div>
            <p class="sn-home-card__foot">
              Token + 皮肤 CSS + 资源三层，每包独立 npm 包（end: web / mp / both）。
            </p>
          </SnCard>

          <!-- Card 3 — AI Native -->
          <SnCard variant="outlined" size="large" hoverable>
            <h3 class="sn-home-card__title">AI Native</h3>
            <p class="sn-home-card__sub">Skill + MCP + ai-meta.json</p>
            <div class="sn-home-card__code">
              <code class="sn-home-card__line">
                <span class="sn-home-card__prompt">$</span>
                claude "用 snail-ui 做登录页"
              </code>
              <code class="sn-home-card__line sn-home-card__line--out">
                → 6 步生成 Button + Input + Card
              </code>
              <code class="sn-home-card__line sn-home-card__line--out">
                → MCP Server 自动按 end 过滤
              </code>
            </div>
          </SnCard>

          <!-- Card 4 — End-aware -->
          <SnCard variant="outlined" size="large" hoverable>
            <h3 class="sn-home-card__title">End-aware</h3>
            <p class="sn-home-card__sub">两端独立源代码 / 构建 / npm 包</p>
            <div class="sn-home-card__ends">
              <div class="end-row">
                <span class="end-tag end-tag--web">Web</span>
                <code class="end-cmd">@snui/vue-web</code>
              </div>
              <div class="end-row">
                <span class="end-tag end-tag--mp">uni</span>
                <code class="end-cmd">@snui/uni</code>
              </div>
              <div class="end-row">
                <span class="end-tag end-tag--react">React</span>
                <code class="end-cmd end-cmd--plan">@snui/react*</code>
              </div>
            </div>
          </SnCard>

        </SnGrid>
      </section>
    </div>
  </SnConfigProvider>
</template>

<style scoped>
/* ─────────── Layout shell ─────────── */
.sn-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 48px;
}

/* ─────────── Hero ─────────── */
.sn-home__hero {
  text-align: center;
  padding: 56px 0 64px;
}

/* Pill announcement */
.sn-home__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 999px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 28px;
  transition: border-color 0.2s, color 0.2s, transform 0.2s;
}
.sn-home__pill:hover {
  border-color: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-primary);
}
.sn-home__pill-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--sn-web-color-success, #07c160);
  flex-shrink: 0;
  box-shadow: 0 0 0 4px rgba(7, 193, 96, 0.12);
}
.sn-home__pill-arrow {
  font-size: 14px;
  transition: transform 0.2s;
}
.sn-home__pill:hover .sn-home__pill-arrow {
  transform: translateX(3px);
}

/* Title */
.sn-home__title {
  font-size: 64px;
  font-weight: 700;
  margin: 0 0 24px;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--sn-web-color-text-primary);
}
@media (max-width: 768px) {
  .sn-home__title { font-size: 40px; }
}

/* Subtitle */
.sn-home__subtitle {
  font-size: 18px;
  line-height: 1.6;
  max-width: 720px;
  margin: 0 auto 40px;
  color: var(--sn-web-color-text-secondary);
}
.sn-home__subtitle strong {
  color: var(--sn-web-color-text-primary);
  font-weight: 600;
}

/* Actions */
.sn-home__actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}
.sn-home__cta-arrow {
  margin-left: 6px;
  display: inline-block;
  transition: transform 0.2s;
}
.sn-home__actions :deep(.sn-button:hover) .sn-home__cta-arrow {
  transform: translateX(4px);
}

/* ─────────── Preview grid ─────────── */
.sn-home__previews {
  margin: 0 0 24px;
}

/* Card heading */
.sn-home-card__title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.sn-home-card__sub {
  margin: 0 0 20px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-home-card__foot {
  margin: 16px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--sn-web-color-text-tertiary);
}

/* Card 1 — buttons preview */
.sn-home-card__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

/* Card 2 — pack tags */
.sn-home-card__packs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}
.pack-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid currentColor;
  line-height: 1.4;
}
.pack-tag--default {
  color: #6b7280;
  background: rgba(107, 114, 128, 0.08);
}
.pack-tag--doodle {
  color: #1a1a1a;
  background: #fff8b8;
  border-style: dashed;
  font-family: 'Comic Sans MS', 'Marker Felt', sans-serif;
}
.pack-tag--ios {
  color: #007aff;
  background: rgba(0, 122, 255, 0.08);
}
.pack-tag--mp {
  color: #ff5000;
  background: rgba(255, 80, 0, 0.08);
}

/* Card 3 — code preview */
.sn-home-card__code {
  background: var(--sn-web-color-background-code, rgba(0, 0, 0, 0.04));
  border-radius: 8px;
  padding: 12px 14px;
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, Menlo, Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.7;
  border: 1px solid var(--sn-web-color-border-default);
}
.sn-home-card__line {
  display: block;
  color: var(--sn-web-color-text-primary);
  word-break: break-all;
}
.sn-home-card__prompt {
  color: var(--sn-web-color-success, #07c160);
  margin-right: 6px;
  user-select: none;
}
.sn-home-card__line--out {
  color: var(--sn-web-color-text-tertiary);
}

/* Card 4 — end rows */
.sn-home-card__ends {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.end-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  background: var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.03));
}
.end-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: white;
}
.end-tag--web { background: #1677ff; }
.end-tag--mp { background: #07c160; }
.end-tag--react { background: #61dafb; color: #1a1a1a; }
.end-cmd {
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}
.end-cmd--plan {
  color: var(--sn-web-color-text-tertiary);
}

/* ─────────── Doodle skin ─────────── */
.snui-skin-doodle .sn-home__title {
  font-family: 'Comic Sans MS', 'Marker Felt', sans-serif;
  border-bottom: 2.5px solid #1a1a1a;
  display: inline-block;
  padding: 0 16px 8px;
}
.snui-skin-doodle .sn-home__pill {
  border: 2px dashed #1a1a1a;
  border-radius: 999px;
}
.snui-skin-doodle .sn-home-card__title {
  font-weight: 700;
  text-decoration: underline;
  text-decoration-style: wavy;
  text-decoration-color: #1a1a1a;
}
.snui-skin-doodle .end-tag {
  border: 1.5px solid #1a1a1a;
}
.snui-skin-doodle .pack-tag--default {
  color: #1a1a1a;
  background: #fff;
}

/* ─────────── Mobile adaptations ─────────── */
@media (max-width: 960px) {
  /* Page shell */
  .sn-home {
    padding: 16px 20px 32px;
  }
  .sn-home__hero {
    padding: 32px 0 40px;
  }
  /* Pill — keep on one line, trim text */
  .sn-home__pill {
    font-size: 12px;
    padding: 5px 12px;
    margin-bottom: 20px;
    gap: 6px;
  }
  .sn-home__pill-dot {
    width: 6px;
    height: 6px;
  }
  /* Title — bigger drop on tablet, still 2-line wrap */
  .sn-home__title {
    font-size: 44px;
    letter-spacing: -0.025em;
    margin: 0 0 18px;
  }
  /* Subtitle — tighter line-height, less bottom margin */
  .sn-home__subtitle {
    font-size: 16px;
    margin: 0 auto 28px;
  }
  /* Actions — keep them on the row, smaller */
  .sn-home__actions {
    gap: 10px;
  }
  /* Preview grid: 4 → 2 columns on tablet.
     Use :deep() to pierce SnGrid's scoped inline grid-template-columns. */
  .sn-home__previews :deep(.sn-grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    row-gap: 14px !important;
  }
}

@media (max-width: 640px) {
  /* Page shell — even tighter */
  .sn-home {
    padding: 12px 16px 24px;
  }
  .sn-home__hero {
    padding: 24px 0 28px;
  }
  /* Title — phone-sized */
  .sn-home__title {
    font-size: 32px;
    letter-spacing: -0.02em;
  }
  /* Subtitle */
  .sn-home__subtitle {
    font-size: 14px;
    line-height: 1.55;
    margin: 0 auto 24px;
  }
  /* Pill — drop arrow on phone to save space */
  .sn-home__pill-arrow {
    display: none;
  }
  /* CTAs — full width on phone, stacked */
  .sn-home__actions {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    max-width: 280px;
    margin: 0 auto;
    gap: 8px;
  }
  .sn-home__actions :deep(.sn-button) {
    width: 100%;
  }
  /* Preview grid: 2 → 1 column on phone */
  .sn-home__previews :deep(.sn-grid) {
    grid-template-columns: 1fr !important;
    row-gap: 12px !important;
  }
  /* Card internals — tighter padding via SmCard size='large' is too generous,
     shrink the content padding by overriding the inner sn-card__content. */
  .sn-home__previews :deep(.sn-card__content) {
    padding: 16px !important;
  }
  /* Card 1 buttons — collapse 2x3 to 3x2 to use less card height */
  .sn-home-card__buttons {
    grid-template-columns: repeat(3, 1fr);
  }
  /* Card 4 end-row — wrap tag + cmd line by line on phone */
  .end-row {
    flex-wrap: wrap;
  }
}
</style>