/**
 * Demo loader — resolves a demo name to code assets for the docs site.
 *
 * ## Two demo corpora, one per runtime
 *
 *   - **Web demos** live in `apps/docs/.vitepress/demo/` (docs-owned). They
 *     render live inside docs via the shared loader below.
 *   - **uni demos** live in `apps/uni-demo/src/demos/` — the single source of
 *     truth since ADR-0005. Their live preview is the *deployed* uni-demo H5
 *     site in an iframe (see `utils/uni-demo-base.ts`); docs only reads their
 *     raw source from here, for the usage-code panel.
 *
 * The cross-app read is a build-time glob of source text only — no uni SFC is
 * ever compiled by the docs pipeline (that was the old shim preview, now
 * retired).
 *
 * ## Who uses what
 *
 *   - `Demo.vue`    — web: live render + source panel; uni: iframe + usage panel
 *   - `DemoDock.vue` — the fixed device preview (iframe into uni-demo)
 *
 * ## Bilingual resolution
 *
 * The English site prefers the English shadow and falls back to the Chinese
 * demo. For uni demos the shadow lives next to the source as `<name>.en.vue`
 * in uni-demo; for web demos it stays in `demo-en/`.
 */

import { defineAsyncComponent, h, type Component } from 'vue';

const demoModules = {
  ...import.meta.glob('../demo/*.vue'),
  ...import.meta.glob('../demo-en/*.vue'),
};

/** `-mp` is the uni demo marker: `button-mp-basic` (mid) / `card-mp` (suffix). */
export function isMpDemoName(name: string): boolean {
  return /(^|-)mp(-|$)/.test(name);
}

/**
 * Resolve the live-render component for a **web** demo name.
 *
 * Returns `undefined` when the demo does not exist — the caller renders a
 * visible error instead of a blank frame. (uni demos resolve to `undefined`
 * by design: they are previewed through the deployed uni-demo site, never
 * rendered by docs.)
 */
export function loadDemoComponent(name: string, isEn: boolean): Component {
  return defineAsyncComponent({
    loader: () => {
      const mod = resolveModule(name, isEn);
      if (mod === undefined) {
        return Promise.resolve({
          render: () => h('div', { class: 'sn-demo-error' }, `demo not found: ${name}`),
        });
      }
      return mod()
        .then((m: { default: unknown }) => m as { default: Component })
        .catch((err: unknown) => {
          // eslint-disable-next-line no-console
          console.error(`[Demo] failed to load ${name}:`, err);
          return {
            render: () => h('div', { class: 'sn-demo-error' }, `demo failed to load: ${name}`),
          };
        });
    },
    delay: 0,
  });
}

function resolveModule(name: string, isEn: boolean): (() => Promise<unknown>) | undefined {
  const enKey = `../demo-en/${name}.vue`;
  const zhKey = `../demo/${name}.vue`;
  if (isEn && demoModules[enKey] !== undefined) return demoModules[enKey];
  return demoModules[zhKey];
}

/** Raw source of a demo file (for the code panel). */
type RawModule = string;

const sourceModules = {
  ...import.meta.glob<RawModule>('../demo/*.vue', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
  ...import.meta.glob<RawModule>('../demo-en/*.vue', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
  // uni demo 单一事实源（apps/uni-demo/src/pages/<group>/demos，含
  // `<name>.en.vue` 英文影子）。只取源码文本：跨 app 只读，不参与 docs 编译。
  ...import.meta.glob<RawModule>('../../../uni-demo/src/pages/*/demos/*.vue', {
    query: '?raw',
    import: 'default',
    eager: true,
  }),
};

/**
 * Match a source-module key by file path suffix. `import.meta.glob`'s key
 * shape is build-dependent (it may or may not carry the `?raw` suffix), so
 * match by suffix rather than a literal key.
 */
function pickSource(base: string): string | undefined {
  const keys = Object.keys(sourceModules);
  const key = keys.find((k) => k.endsWith(base) || k.endsWith(`${base}?raw`));
  const mod = key === undefined ? undefined : sourceModules[key];
  return typeof mod === 'string' ? mod : undefined;
}

/** Raw source of a demo, preferring the English shadow when `isEn`. */
export function loadDemoSource(name: string, isEn: boolean): string {
  if (isMpDemoName(name)) {
    const uniBase = `/uni-demo/src/pages`;
    const en = isEn ? pickSource(`${uniBase}/*/demos/${name}.en.vue`) : undefined;
    return (
      en ?? pickSource(`${uniBase}/*/demos/${name}.vue`) ?? `// Demo source not found: ${name}`
    );
  }
  const en = isEn ? pickSource(`/demo-en/${name}.vue`) : undefined;
  return en ?? pickSource(`/demo/${name}.vue`) ?? `// Demo source not found: ${name}`;
}

/** One copyable usage block: template usage (`vue`) or demo script (`ts`). */
export interface DemoUsageSection {
  lang: 'vue' | 'ts';
  code: string;
}

/**
 * uni demo 的「用法源码」—— 组件文档要的是可直接照抄的用法，不是整份 SFC：
 *
 *   - `vue`：template 内容，剥离演示根外壳（`class="sn-demo…"` 包裹节点）
 *   - `ts`：script 内容，剥离 import 行（组件来源由 easycom / 安装文档交代）
 *   - `css`：不展示（演示排版样式不是用法）
 *
 * 输入是 uni-demo 的单一事实源，因此用法代码与线上预览（部署站 iframe）永远
 * 同源，不存在第二份需要维护的示例。
 */
export function loadDemoUsage(name: string, isEn: boolean): DemoUsageSection[] {
  const source = loadDemoSource(name, isEn);
  const sections: DemoUsageSection[] = [];

  // `<template>` 贪婪匹配到最后一个闭合标签：demo 模板内会嵌套 `<template #slot>`。
  const template = source.match(/<template[^>]*>([\s\S]*)<\/template>/);
  if (template?.[1]?.trim() !== undefined && template[1].trim() !== '') {
    const stripped = stripDemoShell(dedent(template[1]));
    if (stripped !== '') sections.push({ lang: 'vue', code: stripped });
  }

  const script = [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)]
    .map((m) => m[1] ?? '')
    .join('\n');
  const ts = dedent(
    script
      .split('\n')
      .filter((line) => !/^\s*import\b/.test(line))
      .join('\n'),
  );
  if (ts.trim() !== '') sections.push({ lang: 'ts', code: ts });

  return sections;
}

/**
 * 剥离演示根外壳：单根模板的最外层 `<view|div class="sn-demo…">` 节点。
 * 多根模板或结构不匹配时原样返回（宁可多包一层，不误删内容）。
 */
function stripDemoShell(code: string): string {
  const m = code.match(/^<(?:view|div)\s+class="sn-demo[^"]*"[^>]*>([\s\S]*)<\/(?:view|div)>$/);
  return m === null ? code : dedent(m[1] ?? '');
}

/**
 * Strip the indentation a block body inherits from the SFC wrapper.
 *
 * Demo sources are written one level deep inside `<template>` / `<script>`, so
 * the raw body carries 2-4 leading spaces on every line. Shiki renders those
 * verbatim, which pushes every line right inside an already-narrow panel.
 */
export function dedent(input: string): string {
  const lines = input.replace(/^\n+/, '').replace(/\s+$/, '').split('\n');
  let min = Number.POSITIVE_INFINITY;
  for (const line of lines) {
    if (line.trim() === '') continue;
    const indent = line.match(/^ */)?.[0].length ?? 0;
    if (indent < min) min = indent;
  }
  if (!Number.isFinite(min) || min === 0) return lines.join('\n');
  return lines.map((line) => line.slice(min)).join('\n');
}
