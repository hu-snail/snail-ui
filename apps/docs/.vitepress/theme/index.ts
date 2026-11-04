import DefaultTheme from 'vitepress/theme';
import './custom.css';
import '@snui/vue-web/styles';
// @snui/admin-layout ships shell classes only — the token layer comes from
// @snui/vue-web/styles above, so this import must stay after it.
import '@snui/admin-layout/styles';
// @snui/echarts ships the DOM-tooltip styles only, all token-driven; the token
// layer still comes from @snui/vue-web/styles above, so this stays after it.
import '@snui/echarts/styles';
// Workbench 是 @snui/admin-layout 的独立入口（它牵 @snui/echarts），样式不在
// barrel 的 index.css 里 —— 布局 demo 都嵌了它，所以站点在这里补一次。
import '@snui/admin-layout/workbench/style.css';
import StyleSwitcher from '../components/StyleSwitcher.vue';
import ThemeCopier from '../components/ThemeCopier.vue';
import Demo from '../components/Demo.vue';
import DemoLabFab from '../components/DemoLabFab.vue';
import DialogStage from '../components/DialogStage.vue';
import MpHome from '../components/MpHome.vue';
import ChartCase from '../components/ChartCase.vue';
import ChartCard from '../components/ChartCard.vue';
import LayoutShowcase from '../components/LayoutShowcase.vue';
// 主题编辑器页面（/theme/editor）的宿主组件 —— 自带 H1 / 说明 / 双端预览，
// 所以页面 markdown 只需要一行 <ThemeEditor />（见 theme/editor.md）。
import ThemeEditor from '../components/theme-editor/ThemeEditor.vue';
import Layout from './Layout.vue';

/**
 * Register all docs-site components as VitePress global components.
 * Per AUI-PRD-v3.1 + ADR-0002 + Spec-05 §5 + AUI-DOCS-016/018:
 *   - StyleSwitcher: global Style Pack switcher (按 end 过滤, AUI-DOCS-010)
 *   - ThemeCopier:   paste-ready snCssVars() snippet (按 end, AUI-DOCS-011)
 *   - Demo:          web demos render live via demo/<name>.vue; uni demos
 *                    preview the deployed uni-demo site in an iframe (ADR-0005)
 *   - DemoLabFab:    global FAB → Style + Theme + Preview (AUI-DOCS-018)
 *   - DialogStage:   modal overlay shell for the dialog demos (docs-only;
 *                    the library's overlay belongs to the future provider)
 *   - ChartCase:     /echarts/<category> demo card — live chart + config panel
 *                    (properties / palette / rounded-smooth) + copy-config
 *
 * Custom Layout.vue mounts DemoLabFab into the doc-after slot; the FAB itself
 * only renders when route.path starts with `/components/`.
 *
 * Per-component web demo files import from the package main entry
 * (`import { SnButton } from '@snui/vue-web'`), which resolves to the
 * vite-built dist/index.js. This end-to-end exercises the published dist —
 * if a demo renders, the dist is verified to be consumable.
 *
 * @snui/tokens + @snui/style-packs are statically imported by StyleSwitcher +
 * ThemeCopier + DemoLabFab, so vite auto-discovers them for optimizeDeps.
 */
export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: { component: (name: string, c: unknown) => void } }) {
    app.component('StyleSwitcher', StyleSwitcher);
    app.component('ThemeCopier', ThemeCopier);
    app.component('Demo', Demo);
    app.component('DemoLabFab', DemoLabFab);
    app.component('DialogStage', DialogStage);
    app.component('MpHome', MpHome);
    app.component('ChartCase', ChartCase);
    app.component('ChartCard', ChartCard);
    app.component('LayoutShowcase', LayoutShowcase);
    app.component('ThemeEditor', ThemeEditor);
  },
};
