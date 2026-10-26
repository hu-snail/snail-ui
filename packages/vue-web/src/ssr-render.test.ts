// @vitest-environment node
/**
 * SSR (server-side rendering) smoke tests — run in a real Node environment
 * (the `@vitest-environment node` docblock overrides the package-level
 * happy-dom environment, so `window` / `document` / `navigator` / observers
 * do not exist here).
 *
 * What is covered (per the SSR compatibility spec):
 *   1. Every component exported from the package index must survive
 *      `renderToString` without touching browser globals.
 *   2. `SnConfigProvider` wrapping `SnButton` (slot content propagates).
 *   3. `SnDrawer` in its default closed state (closed overlays must not
 *      touch `document` during server rendering).
 *   4. `SnButton` with slot content (slot text reaches the SSR output).
 *
 * The package-level happy-dom tests keep covering client-side behaviour;
 * this file only asserts that *server* rendering does not crash.
 */

import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import * as SnUI from './index';

/* ────────────────────────── environment guard ────────────────────────── */

it('should run without browser globals (node environment is really applied)', () => {
  // Note: Node 21+ ships a global `navigator`, so it can no longer signal
  // "no DOM here" — window / document are the reliable markers.
  expect(typeof window).toBe('undefined');
  expect(typeof document).toBe('undefined');
});

/* ────────────────────────── export collection ────────────────────────── */

interface ComponentLike {
  name?: unknown;
  __name?: unknown;
  setup?: unknown;
  render?: unknown;
  install?: unknown;
}

/**
 * A component export is an object that looks like a Vue component definition
 * (compiled SFCs carry `__name` / `render` / `setup`). Non-component exports
 * (`useNotification`, `useLoadingBar`, `snCssVars`, ... are functions; `SnUI`
 * is the install plugin) are filtered out.
 */
function isComponentExport(value: unknown): boolean {
  if (value === null || typeof value !== 'object') return false;
  const candidate = value as ComponentLike;
  if (typeof candidate.install === 'function') return false;
  // Compiled SFCs carry `__name` (+ `render` / `setup`). A bare `name`
  // string is NOT enough — locale objects (zhCN / enUS) also have one.
  return (
    typeof candidate.setup === 'function' ||
    typeof candidate.render === 'function' ||
    typeof candidate.__name === 'string'
  );
}

/**
 * Minimum props a component needs to produce markup under SSR. Everything
 * not listed here renders with default props (all props are optional).
 */
const MINIMAL_PROPS: Record<string, Record<string, unknown>> = {
  SnSelect: { options: ['Beijing', 'Shanghai'] },
  SnAutoComplete: { options: ['Beijing', 'Shanghai'] },
  SnMention: { options: ['alice', 'bob'] },
  SnPopselect: { options: ['daily', 'weekly'] },
  SnDropdown: { options: [{ label: 'Edit', key: 'edit' }] },
  SnMenu: { options: [{ label: 'Home', key: 'home' }] },
  SnCascader: { options: [{ label: 'Asia', value: 'asia' }] },
  SnTreeSelect: { options: [{ label: 'Node', key: 'node' }] },
  SnVirtualList: { items: ['a', 'b', 'c'], itemSize: 24, visibleHeight: 96 },
  SnCarousel: { defaultIndex: 0 },
  SnDataTable: {
    columns: [{ title: 'Name', key: 'name' }],
    data: [{ name: 'Ada' }],
  },
  SnTable: { columns: [{ title: 'Name', key: 'name' }], data: [{ name: 'Ada' }] },
  SnWaterfall: { items: [{ id: 'a' }, { id: 'b' }] },
  SnHeatmap: { data: [] },
  SnPagination: { itemCount: 100 },
  SnCode: { code: 'const answer = 42' },
  SnLog: { lines: ['boot ok'] },
  SnTree: { data: [{ label: 'root', key: 'root' }] },
  SnTransfer: { options: [{ label: 'A', value: 'a' }] },
  SnImage: { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' },
  SnAvatar: { src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=' },
  SnVideoPreview: { src: 'movie.mp4' },
  SnQrCode: { value: 'https://aui.dev' },
  SnCountdown: { duration: 60_000 },
  SnTime: { value: 1_700_000_000_000 },
  SnEquation: { value: 'E=mc^2' },
  SnStatistic: { value: 42 },
};
/**
 * Child-only components that require an ancestor's provide/inject context
 * (they throw a helpful error when mounted standalone). Under SSR they must
 * render inside their parent, so the sweep wraps them.
 */
const WRAPPERS: Record<string, () => ReturnType<typeof h>> = {
  SnAnchorLink: () => h(SnUI.SnAnchor, null, { default: () => h(SnUI.SnAnchorLink as never) }),
  SnStep: () => h(SnUI.SnSteps as never, null, { default: () => h(SnUI.SnStep as never) }),
  SnCarouselItem: () =>
    h(SnUI.SnCarousel as never, null, { default: () => h(SnUI.SnCarouselItem as never) }),
};

const componentEntries = Object.entries(SnUI as Record<string, unknown>).filter(
  (entry): entry is [string, ComponentLike] => isComponentExport(entry[1]),
);

describe('SSR renderToString (node, no DOM globals)', () => {
  it('should server-render every exported component without touching browser globals', async () => {
    expect(componentEntries.length).toBeGreaterThan(50);

    const failures: Array<{ name: string; error: unknown }> = [];
    for (const [name, component] of componentEntries) {
      try {
        const wrapper = WRAPPERS[name];
        await renderToString(
          wrapper ? wrapper() : h(component as never, MINIMAL_PROPS[name] ?? {}),
        );
      } catch (error) {
        failures.push({ name, error });
      }
    }

    expect(
      failures.map(({ name, error }) => `${name}: ${String(error)}`),
      `${failures.length} component(s) crashed during SSR`,
    ).toEqual([]);
  });

  it('should server-render SnConfigProvider wrapping SnButton with slot content', async () => {
    const html = await renderToString(
      h(SnUI.SnConfigProvider, null, {
        default: () => h(SnUI.SnButton, null, { default: () => '确定' }),
      }),
    );
    expect(html).toContain('确定');
    expect(html).toContain('button');
  });

  it('should server-render SnDrawer closed without touching document', async () => {
    // Default `show: false`. Any setup-time / render-time `document` access
    // would throw here (no `document` global in the node environment).
    const html = await renderToString(h(SnUI.SnDrawer));
    expect(typeof html).toBe('string');
  });

  it('should server-render SnButton with slot text', async () => {
    const html = await renderToString(h(SnUI.SnButton, null, { default: () => '提交订单' }));
    expect(html).toContain('提交订单');
    expect(html).toContain('button');
  });
});
