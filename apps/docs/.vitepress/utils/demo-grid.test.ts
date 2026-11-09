/**
 * Behaviour tests for the demo-grid markdown plugin.
 *
 * Covered behaviour:
 *   - a run of demo sections groups into one `.sn-demo-grid`, and a lone demo
 *     section stays a bare cell;
 *   - the plugin never injects a page-level wrapper (that would land inside the
 *     compiled VitePress template and break it).
 *
 * Every card now owns its own row (custom.css §13), so there is no per-route
 * layout switch to test any more.
 */

import { describe, expect, it } from 'vitest';
import { demoGrid } from './demo-grid';

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

describe('demoGrid · card wrapping', () => {
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
