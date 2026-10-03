import DefaultTheme from 'vitepress/theme';
import './custom.css';
import StyleSwitcher from '../components/StyleSwitcher.vue';
import ThemeCopier from '../components/ThemeCopier.vue';
import ComponentPreview from '../components/ComponentPreview.vue';

/**
 * Register all docs-site components as VitePress global components.
 * Per AUI-PRD-v3.0 §7.1 + §7.2 + §7.3, these are the three core docs components:
 *   - StyleSwitcher: global Style Pack switcher
 *   - ThemeCopier:   paste-ready snCssVars() snippet
 *   - ComponentPreview: real @snui/vue-web component mount
 */

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: { app: { component: (name: string, c: unknown) => void } }) {
    app.component('StyleSwitcher', StyleSwitcher)
    app.component('ThemeCopier', ThemeCopier)
    app.component('ComponentPreview', ComponentPreview)
  },
}