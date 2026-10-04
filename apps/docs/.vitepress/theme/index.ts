import DefaultTheme from 'vitepress/theme';
import './custom.css';
import '@snui/vue-web/styles';
import '@snui/uni/styles';
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
 * Per-component demo files import from the package main entry
 * (`import { SnButton } from '@snui/vue-web'`), which resolves to the
 * vite-built dist/index.js. This end-to-end exercises the published dist —
 * if a demo renders, the dist is verified to be consumable.
 *
 * @snui/tokens + @snui/style-packs are statically imported by StyleSwitcher +
 * ThemeCopier, so vite auto-discovers them for optimizeDeps.
 */

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: { component: (name: string, c: unknown) => void } }) {
    app.component('StyleSwitcher', StyleSwitcher)
    app.component('ThemeCopier', ThemeCopier)
    app.component('Demo', Demo)
  },
}