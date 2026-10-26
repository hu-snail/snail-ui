import { describe, expect, it } from 'vitest';
import { transformTemplate } from './template.ts';

const FILE = 'test/sn-comp.vue';

describe('transformTemplate', () => {
  it('should wrap bare text in <text>', () => {
    const r = transformTemplate('<view>取消</view>', FILE);
    expect(r.code).toBe('<view><text>取消</text></view>');
    expect(r.issues.some((i) => i.kind === 'template-bare-text')).toBe(true);
  });

  it('should wrap mustache-only text', () => {
    const r = transformTemplate('<view>{{ label }}</view>', FILE);
    expect(r.code).toBe('<view><text>{{ label }}</text></view>');
  });

  it('should not wrap whitespace-only text nodes', () => {
    const r = transformTemplate('<view>\n  <text>x</text>\n</view>', FILE);
    expect(r.code).toBe('<view>\n  <text>x</text>\n</view>');
    expect(r.issues).toHaveLength(0);
  });

  it('should not wrap text already inside <text>', () => {
    const r = transformTemplate('<text>hello world</text>', FILE);
    expect(r.code).toBe('<text>hello world</text>');
  });

  it('should wrap each bare segment in mixed content', () => {
    const r = transformTemplate('<view>a <text>b</text> c</view>', FILE);
    expect(r.code).toBe('<view><text>a </text><text>b</text><text> c</text></view>');
  });

  it('should rename @tap to @click preserving modifiers', () => {
    const r = transformTemplate(
      '<view @tap="onTap" @tap.stop="onStop" @touchstart="onDown" />',
      FILE,
    );
    expect(r.code).toContain('@click="onTap"');
    expect(r.code).toContain('@click.stop="onStop"');
    expect(r.code).toContain('@touchstart="onDown"');
    expect(r.code).not.toContain('@tap');
  });

  it('should strip data-* and :data-* attributes', () => {
    const r = transformTemplate(
      '<view data-snui-component="button" :data-status="status" :aria-label="label" class="x" />',
      FILE,
    );
    expect(r.code).not.toContain('data-snui-component');
    expect(r.code).not.toContain(':data-status');
    expect(r.code).toContain(':aria-label="label"');
    expect(r.code).toContain('class="x"');
  });

  it('should leave comments untouched', () => {
    const r = transformTemplate('<view><!-- data-status="x" -->ok</view>', FILE);
    expect(r.code).toContain('<!-- data-status="x" -->');
    expect(r.code).toContain('<text>ok</text>');
  });

  it('should not treat > inside attribute values as tag end', () => {
    const r = transformTemplate("<view :class=\"a > b ? 'x' : 'y'\" />", FILE);
    expect(r.code).toBe("<view :class=\"a > b ? 'x' : 'y'\" />");
  });
});
