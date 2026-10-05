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
 * components". Toggle Style Pack → the hero + features + next links all
 * follow the active skin via CSS variables.
 */

import { SnButton, SnCard, SnConfigProvider, SnGrid } from '@snui/vue-web'

const features = [
  { title: '端独立（End-aware）', details: 'Web 端（PC）和 uni 端（移动）从开发到打包完全独立 —— 独立源代码、独立构建、独立 npm 包、独立 Token 别名（--sn-web-* / --sn-mp-*）。未来 React 端按相同模式扩展，0 行跨端复用。' },
  { title: 'Component First', details: 'Web 端 SnButton / SnTable / SnTree 等 PC 端组件。uni 端 sn-button / sn-list 等移动端组件。各端按场景独立设计 API，不追求跨端同名同形。' },
  { title: 'Token First', details: '统一底层 @snui/tokens 输出 --aui-* 原始层；每端通过独立别名包 (@snui/tokens-web / @snui/tokens-mp) 映射到 --sn-{end}-*。组件消费端独立 Token。' },
  { title: 'Style Pack First', details: '跨端共用风格包系统。Token + 皮肤 CSS + 资源三层。每个 Pack 标注 end 字段（取值 web / mp / both）。Web 端有 web 品牌主题；uni 端有 mp-taobao / mp-douyin 等移动品牌主题。' },
  { title: 'AI Native', details: 'AI 能读懂每个端组件、产出原型、修改 UI。snail-ui.skill.md 写 AI 行为契约；MCP Server 4 工具按 end 过滤；ai-meta.json 按端分组。' },
]

const actions = [
  { kind: 'primary', text: 'Web（PC 端）', link: '/guide/web/intro', external: false },
  { kind: 'default', text: 'uni-app（移动端）', link: '/guide/uni/quick-start', external: false },
  { kind: 'default', text: '风格包', link: '/style-packs/overview', external: false },
  { kind: 'default', text: 'AI 生态', link: '/ai/overview', external: false },
  { kind: 'default', text: 'GitHub', link: 'https://github.com/hu-snail/snail-ui', external: true },
]

function handleAction(action: { external: boolean; link: string }): void {
  if (action.external && typeof window !== 'undefined') {
    window.open(action.link, '_blank', 'noopener')
  }
}
</script>

<template>
  <SnConfigProvider>
    <div class="sn-home">
      <section class="sn-home__hero">
        <h1 class="sn-home__brand">snail-aui</h1>
        <h2 class="sn-home__title">Component First · Style Pack First · AI Native · End-aware</h2>
        <p class="sn-home__tagline">
          面向 Vue 3（PC Web）+ uni-app（移动）的 AI-Native UI 框架生态。<strong>Web 端面向桌面</strong>，<strong>uni 端面向移动</strong>——两端从开发到打包完全独立，0 行源代码复用。未来 React 端按相同模式扩展。
        </p>
        <div class="sn-home__actions">
          <SnButton
            v-for="act in actions"
            :key="act.link"
            :variant="act.kind"
            :href="act.external ? undefined : act.link"
            @click="act.external ? handleAction(act) : undefined"
          >
            {{ act.text }}
          </SnButton>
        </div>
      </section>

      <section class="sn-home__features">
        <SnGrid :cols="3" :x-gap="16" :y-gap="16">
          <SnCard
            v-for="f in features"
            :key="f.title"
            :padding="'md'"
          >
            <h3 class="sn-home-card__title">{{ f.title }}</h3>
            <p class="sn-home-card__details">{{ f.details }}</p>
          </SnCard>
        </SnGrid>
      </section>

      <section class="sn-home__next">
        <h2 class="sn-home__next-title">下一步</h2>
        <ul class="sn-home__next-list">
          <li><a href="/guide/web/intro">Web 端介绍</a> — 30 秒看懂 Web 端</li>
          <li><a href="/guide/web/architecture">架构</a> — 双端包结构</li>
          <li><a href="/style-packs/overview">风格包</a> — 跨端共用风格包</li>
          <li><a href="/ai/overview">AI 生态</a> — Skill + MCP + 高保真原型</li>
        </ul>
      </section>
    </div>
  </SnConfigProvider>
</template>

<style scoped>
.sn-home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
}
.sn-home__hero {
  text-align: center;
  padding: 64px 0 48px;
}
.sn-home__brand {
  font-size: 56px;
  font-weight: 700;
  margin: 0;
  color: var(--sn-web-color-action-primary);
  letter-spacing: -0.02em;
}
.sn-home__title {
  font-size: 32px;
  font-weight: 600;
  margin: 12px 0 24px;
  color: var(--sn-web-color-text-primary);
}
.sn-home__tagline {
  font-size: 16px;
  line-height: 1.6;
  max-width: 720px;
  margin: 0 auto 32px;
  color: var(--sn-web-color-text-secondary);
}
.sn-home__actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}
.sn-home__features {
  margin: 48px 0;
}
.sn-home-card__title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}
.sn-home-card__details {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--sn-web-color-text-secondary);
}
.sn-home__next {
  margin: 48px 0 24px;
}
.sn-home__next-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
  border-top: 1px solid var(--sn-web-color-border-default);
  padding-top: 24px;
}
.sn-home__next-list {
  list-style: disc;
  padding-left: 24px;
  color: var(--sn-web-color-text-primary);
}
.sn-home__next-list a {
  color: var(--sn-web-color-action-primary);
  text-decoration: none;
}

/* Doodle skin */
.snui-skin-doodle .sn-home__brand {
  font-family: 'Comic Sans MS', 'Marker Felt', sans-serif;
  color: #1a1a1a;
}
.snui-skin-doodle .sn-home-card__title {
  font-weight: 700;
}
</style>