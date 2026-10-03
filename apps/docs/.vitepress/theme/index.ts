import DefaultTheme from 'vitepress/theme';
import './custom.css';
import StyleSwitcher from '../components/StyleSwitcher.vue';
import ThemeCopier from '../components/ThemeCopier.vue';
import Demo from '../components/Demo.vue';

/**
 * Register all docs-site components as VitePress global components.
 * Per AUI-PRD-v3.1 + ADR-0002 + Spec-05 §5 + AUI-DOCS-016:
 *   - StyleSwitcher: global Style Pack switcher (按 end 过滤, AUI-DOCS-010)
 *   - ThemeCopier:   paste-ready snCssVars() snippet (按 end, AUI-DOCS-011)
 *   - Demo:          per-component live render via demo/<name>.vue
 *
 * Note: ComponentPreview.vue placeholder was removed in this iteration. Each
 * component page now references <Demo name="button-web" /> (or similar),
 * which dynamically loads the corresponding demo .vue file. VitePress compiles
 * .vue files via @vue/compiler-sfc, so compile-time macros (defineOptions etc.)
 * work correctly — this bypasses the raw-ESM pitfall that BLOCKED the v3.0
 * top-level `<script setup>` approach.
 */

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: { component: (name: string, c: unknown) => void } }) {
    app.component('StyleSwitcher', StyleSwitcher)
    app.component('ThemeCopier', ThemeCopier)
    app.component('Demo', Demo)
  },
}