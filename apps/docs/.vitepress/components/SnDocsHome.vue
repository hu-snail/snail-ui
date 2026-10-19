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
 * Visual intent: neutral marketing chrome. A compact centred hero (heavy
 * display title, muted body copy, one filled brand button + one outline
 * button) over a 4-up card grid. Cards are flat surfaces: 1px hairline,
 * 8px radius, generous interior padding, no shadows. Colour is reserved for
 * the brand accent on the primary action and the brand mark; everything else
 * stays on the neutral text/border scale. Toggle Style Pack → the hero +
 * features all follow the active skin via CSS variables.
 */

import { ArrowRight } from 'lucide-vue-next'
import { SnButton, SnCard, SnConfigProvider, SnGrid, SnIcon, SnInput } from '@snui/vue-web'

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
          <SnIcon class="sn-home__pill-icon" :icon="ArrowRight" />
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
            <SnIcon class="sn-home__cta-icon" :icon="ArrowRight" />
          </SnButton>
          <SnButton variant="tertiary" size="large" @click="openGithub">
            GitHub
          </SnButton>
        </div>
      </section>

      <!-- ─────────── Preview grid ─────────── -->
      <section class="sn-home__previews">
        <SnGrid :cols="4" :x-gap="20" :y-gap="20">

          <!-- Card 1 — Components -->
          <SnCard variant="outlined" size="large">
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
          <SnCard variant="outlined" size="large">
            <h3 class="sn-home-card__title">Style Pack</h3>
            <p class="sn-home-card__sub">跨端共用风格包系统</p>
            <div class="sn-home-card__packs">
              <span class="pack-tag">Default</span>
              <span class="pack-tag">Doodle</span>
              <span class="pack-tag">iOS</span>
              <span class="pack-tag">mp-taobao</span>
            </div>
            <p class="sn-home-card__foot">
              Token + 皮肤 CSS + 资源三层，每包独立 npm 包（end: web / mp / both）。
            </p>
          </SnCard>

          <!-- Card 3 — AI Native -->
          <SnCard variant="outlined" size="large">
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
          <SnCard variant="outlined" size="large">
            <h3 class="sn-home-card__title">End-aware</h3>
            <p class="sn-home-card__sub">两端独立源代码 / 构建 / npm 包</p>
            <div class="sn-home-card__ends">
              <div class="end-row">
                <span class="end-tag">Web</span>
                <code class="end-cmd">@snui/vue-web</code>
              </div>
              <div class="end-row">
                <span class="end-tag">uni</span>
                <code class="end-cmd">@snui/uni</code>
              </div>
              <div class="end-row">
                <span class="end-tag">React</span>
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
  padding: 32px 24px 48px;
}

/* ─────────── Hero ─────────── */
.sn-home__hero {
  text-align: center;
  padding: 32px 0 48px;
}

/* Pill announcement — hairline only, one brand-toned dot as the accent. */
.sn-home__pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 999px;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 24px;
  transition: background-color 0.2s, color 0.2s;
}
.sn-home__pill:hover {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
.sn-home__pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sn-web-color-action-primary);
  flex-shrink: 0;
}
.sn-home__pill-icon {
  width: var(--sn-web-icon-size-small);
  height: var(--sn-web-icon-size-small);
}
.sn-home__pill-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* Title */
.sn-home__title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 20px;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--sn-web-color-text-primary);
}

/* Subtitle */
.sn-home__subtitle {
  font-size: 15px;
  line-height: 1.75;
  max-width: 640px;
  margin: 0 auto 32px;
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
/* Secondary action reads as an outline control: hairline border, transparent
 * fill, neutral hover wash. */
.sn-home__actions :deep(.sn-button--tertiary) {
  background: transparent;
  border-color: var(--sn-web-color-border-default);
  color: var(--sn-web-color-text-primary);
}
.sn-home__actions :deep(.sn-button--tertiary:hover:not(.sn-button--disabled):not(.sn-button--loading)) {
  background: var(--sn-web-color-background-subtle);
  border-color: var(--sn-web-color-border-default);
  color: var(--sn-web-color-text-primary);
}
.sn-home__cta-icon {
  width: var(--sn-web-icon-size-small);
  height: var(--sn-web-icon-size-small);
  margin-left: 2px;
}
.sn-home__cta-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* ─────────── Preview grid ─────────── */
.sn-home__previews {
  margin: 0;
}

/* Card heading */
.sn-home-card__title {
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.sn-home-card__sub {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--sn-web-color-text-secondary);
}
.sn-home-card__foot {
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--sn-web-color-text-tertiary);
}

/* Card 1 — buttons preview */
.sn-home-card__buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

/* Card 2 — pack tags. Neutral chips: the pack identity is carried by the
 * label + the live skin applied elsewhere on the page, not by a swatch. */
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
  line-height: 1.4;
  border: 1px solid var(--sn-web-color-border-default);
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-secondary);
}

/* Card 3 — code preview */
.sn-home-card__code {
  background: var(--sn-web-color-background-subtle);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: 6px;
  padding: 12px 14px;
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, Menlo, Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.7;
}
.sn-home-card__line {
  display: block;
  color: var(--sn-web-color-text-secondary);
  word-break: break-all;
}
.sn-home-card__prompt {
  color: var(--sn-web-color-text-tertiary);
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
  padding: 6px 10px;
  border-radius: 6px;
  background: var(--sn-web-color-background-subtle);
}
.end-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: 1px solid var(--sn-web-color-border-default);
  color: var(--sn-web-color-text-secondary);
}
.end-cmd {
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, Menlo, Consolas, monospace;
  font-size: 12px;
  color: var(--sn-web-color-text-secondary);
}
.end-cmd--plan {
  color: var(--sn-web-color-text-tertiary);
}

/* ─────────── Mobile adaptations ─────────── */
@media (max-width: 960px) {
  /* Page shell */
  .sn-home {
    padding: 24px 20px 40px;
  }
  .sn-home__hero {
    padding: 24px 0 40px;
  }
  /* Pill — keep on one line, trim text */
  .sn-home__pill {
    font-size: 12px;
    padding: 4px 10px;
    margin-bottom: 20px;
    gap: 6px;
  }
  /* Title — one step down, still display-weight */
  .sn-home__title {
    font-size: 32px;
    letter-spacing: -0.02em;
    margin: 0 0 16px;
  }
  /* Subtitle — less bottom margin, tighter measure */
  .sn-home__subtitle {
    margin: 0 auto 24px;
  }
  /* Actions — keep them on the row */
  .sn-home__actions {
    gap: 10px;
  }
  /* Preview grid: 4 → 2 columns on tablet.
     Use :deep() to pierce SnGrid's scoped inline grid-template-columns. */
  .sn-home__previews :deep(.sn-grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    row-gap: 16px !important;
  }
}

@media (max-width: 640px) {
  /* Page shell — even tighter */
  .sn-home {
    padding: 16px 16px 32px;
  }
  .sn-home__hero {
    padding: 20px 0 32px;
  }
  /* Subtitle — tighter line-height */
  .sn-home__subtitle {
    line-height: 1.7;
    margin: 0 auto 20px;
  }
  /* Pill — drop the arrow on phone to save space */
  .sn-home__pill-icon {
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
    row-gap: 16px !important;
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
