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

  it('should rewrite bare scroll-x to direction="horizontal"', () => {
    const r = transformTemplate(
      '<scroll-view class="chips" scroll-x :show-scrollbar="false"><view class="inner" /></scroll-view>',
      FILE,
    );
    expect(r.code).toContain('direction="horizontal"');
    expect(r.code).not.toContain('scroll-x');
    expect(r.code).toContain(':show-scrollbar="false"');
    expect(r.issues.some((i) => i.kind === 'template-attr' && i.detail.includes('direction'))).toBe(
      true,
    );
  });

  it('should rewrite :scroll-x="true" to direction="horizontal"', () => {
    const r = transformTemplate('<scroll-view :scroll-x="true"><view /></scroll-view>', FILE);
    expect(r.code).toContain('direction="horizontal"');
    expect(r.code).not.toContain(':scroll-x');
  });

  it('should rewrite scroll-x combined with scroll-y to direction="all"', () => {
    const r = transformTemplate(
      '<scroll-view scroll-x :scroll-y="scrollsVertically"><view /></scroll-view>',
      FILE,
    );
    expect(r.code).toContain('direction="all"');
    expect(r.code).not.toContain('scroll-x');
    expect(r.code).not.toContain(':scroll-y');
  });

  it('should keep scroll-y-only scroll-views untouched (uni-app x defaults to vertical)', () => {
    const src = '<scroll-view scroll-y><view /></scroll-view>';
    const r = transformTemplate(src, FILE);
    expect(r.code).toBe(src);
    expect(r.issues.some((i) => i.detail.includes('direction'))).toBe(false);
  });

  it('should flag non-literal :scroll-x bindings for manual attention', () => {
    const r = transformTemplate('<scroll-view :scroll-x="canPan"><view /></scroll-view>', FILE);
    expect(r.code).toContain(':scroll-x="canPan"');
    expect(r.issues.some((i) => i.detail.includes('dynamic :scroll-x'))).toBe(true);
  });

  it('should not rewrite scroll-x appearing inside other attribute names or values', () => {
    const r = transformTemplate(
      '<scroll-view scroll-x :scroll-into-view="targetId" scroll-with-animation />',
      FILE,
    );
    expect(r.code).toContain('direction="horizontal"');
    expect(r.code).toContain(':scroll-into-view="targetId"');
    expect(r.code).toContain('scroll-with-animation');
    expect(r.code).not.toContain('scroll-x');
  });
});
