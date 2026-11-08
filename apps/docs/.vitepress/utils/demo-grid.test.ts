/**
 * Behaviour tests for the demo-grid markdown plugin and its single-column rule.
 *
 * Covered behaviour:
 *   - a run of demo sections still groups into one `.sn-demo-grid` (the shared
 *     two-column waterfall), and a lone demo section stays a bare cell;
 *   - `usesSingleColumnLayout()` claims exactly the admin-layout routes (zh + en,
 *     hub + per-style pages, with or without a trailing `.html`) and nothing
 *     else, so every other docs page keeps the waterfall;
 *   - `SINGLE_COLUMN_CLASS` is the class `theme/Layout.vue` applies and
 *     custom.css §13 keys off.
 *
 * The plugin takes its page decision from the route (see `theme/Layout.vue`),
 * so the token-stream tests here only cover the grid grouping.
 */

import { describe, expect, it } from 'vitest';
import { demoGrid, SINGLE_COLUMN_CLASS, usesSingleColumnLayout } from './demo-grid';

interface Token {
  type: string;
  tag: string;
  nesting: number;
  content: string;
  children?: Token[] | null;
}

function makeToken(type: string, tag: string, nesting: number, content = ''): Token {
  return { type, tag, nesting, content, children: null };
}

/** `## 标题` + one `<Demo>` per section, the shape the plugin expects. */
function demoPage(sections: number): Token[] {
  const tokens: Token[] = [
    makeToken('heading_open', 'h1', 1),
    makeToken('inline', '', 0, 'Page'),
    makeToken('heading_close', 'h1', -1),
  ];
  for (let i = 0; i < sections; i += 1) {
    tokens.push(
      makeToken('heading_open', 'h2', 1),
      makeToken('inline', '', 0, `Section ${i}`),
      makeToken('heading_close', 'h2', -1),
      makeToken('html_block', '', 0, '<Demo name="d" />'),
    );
  }
  return tokens;
}

/** Run the registered core rule against a minimal markdown-it-like state. */
function run(tokens: Token[]): Token[] {
  class TokenImpl {
    type: string;
    tag: string;
    nesting: number;
    content = '';
    children: Token[] | null = null;
    constructor(type: string, tag: string, nesting: number) {
      this.type = type;
      this.tag = tag;
      this.nesting = nesting;
    }
  }
  const state = {
    Token: TokenImpl as unknown as new (type: string, tag: string, nesting: number) => Token,
    tokens,
  };
  const rules: Array<(s: unknown) => void> = [];
  const md = {
    core: { ruler: { push: (_name: string, rule: (s: unknown) => void) => rules.push(rule) } },
  };
  demoGrid(md);
  for (const rule of rules) rule(state);
  return state.tokens;
}

const wrapperCount = (tokens: Token[], needle: string): number =>
  tokens.filter((t) => t.type === 'html_block' && t.content.includes(needle)).length;

describe('demoGrid · shared waterfall', () => {
  it('should group consecutive demo sections into one grid', () => {
    const out = run(demoPage(3));
    expect(wrapperCount(out, 'class="sn-demo-grid"')).toBe(1);
    expect(wrapperCount(out, 'class="sn-demo-cell"')).toBe(3);
  });

  it('should leave a lone demo section as a bare full-width cell', () => {
    const out = run(demoPage(1));
    expect(wrapperCount(out, 'class="sn-demo-grid"')).toBe(0);
    expect(wrapperCount(out, 'class="sn-demo-cell"')).toBe(1);
  });

  it('should never inject a page-level wrapper (it would break the page template)', () => {
    const out = run(demoPage(2));
    expect(wrapperCount(out, SINGLE_COLUMN_CLASS)).toBe(0);
    expect(out[0]?.content).not.toContain('<div');
  });

  it('should leave a page without demos untouched', () => {
    const plain = [
      makeToken('paragraph_open', 'p', 1),
      makeToken('inline', '', 0, 'text'),
      makeToken('paragraph_close', 'p', -1),
    ];
    const out = run(plain);
    expect(out).toHaveLength(3);
    expect(wrapperCount(out, 'sn-demo')).toBe(0);
  });
});

describe('usesSingleColumnLayout · admin-layout pages', () => {
  const single = [
    '/ecosystem/plugins/admin-layout',
    '/ecosystem/plugins/admin-layout/',
    '/ecosystem/plugins/admin-layout.html',
    '/ecosystem/plugins/admin-layout/standard',
    '/ecosystem/plugins/admin-layout/classic',
    '/ecosystem/plugins/admin-layout/aurora',
    '/en/ecosystem/plugins/admin-layout',
    '/en/ecosystem/plugins/admin-layout.html',
    '/en/ecosystem/plugins/admin-layout/standard',
    '/en/ecosystem/plugins/admin-layout/classic',
    '/en/ecosystem/plugins/admin-layout/aurora',
  ];

  it.each(single)('should claim %s', (path) => {
    expect(usesSingleColumnLayout(path)).toBe(true);
  });
});

describe('usesSingleColumnLayout · everything else keeps the waterfall', () => {
  const others = [
    '/',
    '/components/web/button',
    '/ecosystem/overview',
    '/ecosystem/plugins',
    '/ecosystem/plugins/admin-layout-legacy',
    '/ecosystem/plugins/admin-layoutx',
    '/echarts/line',
    '/en/components/web/button',
    '/en/ecosystem/overview',
    '/en/ecosystem/plugins/admin-layout-legacy',
  ];

  it.each(others)('should not claim %s', (path) => {
    expect(usesSingleColumnLayout(path)).toBe(false);
  });

  it('should tolerate a missing route', () => {
    expect(usesSingleColumnLayout(undefined)).toBe(false);
    expect(usesSingleColumnLayout('')).toBe(false);
  });
});

describe('SINGLE_COLUMN_CLASS', () => {
  it('should be the class custom.css §13 scopes its one-per-row rule to', () => {
    expect(SINGLE_COLUMN_CLASS).toBe('sn-layout-single-column');
  });
});
