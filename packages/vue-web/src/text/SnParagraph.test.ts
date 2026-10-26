import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnParagraph from './SnParagraph.vue';

describe('SnParagraph (AUI-WEB-TY-003)', () => {
  it('renders a paragraph with no outer margin by default', () => {
    const w = mount(SnParagraph, { slots: { default: '正文' } });
    expect(w.element.tagName).toBe('P');
    expect(w.classes()).toContain('sn-paragraph');
    expect(w.classes()).toContain('sn-paragraph--base');
    expect(w.text()).toBe('正文');
  });

  it('applies the spacing scale class', () => {
    for (const spacing of ['tight', 'base', 'loose'] as const) {
      const w = mount(SnParagraph, { props: { spacing } });
      expect(w.classes()).toContain(`sn-paragraph--${spacing}`);
    }
  });

  it('forwards the depth scale to SnText', () => {
    const w = mount(SnParagraph, { props: { depth: '3' } });
    expect(w.classes()).toContain('sn-text--depth-3');
  });

  it('forwards the semantic type to SnText', () => {
    const w = mount(SnParagraph, { props: { type: 'error' } });
    expect(w.classes()).toContain('sn-text--error');
  });

  it('pins the line-height scale in the component CSS', () => {
    // happy-dom has no layout engine, so the 档位 contract (tight 1.4 /
    // base 1.6 / loose 1.8) is asserted against the component's own CSS —
    // the same approach SnAlert.test.ts uses for geometry contracts.
    const source = readFileSync('src/text/SnParagraph.vue', 'utf-8');
    const styleBlock = /<style scoped>([\s\S]*?)<\/style>/.exec(source);
    if (!styleBlock) throw new Error('SnParagraph.vue lost its <style scoped> block');

    expect(styleBlock[1]).toContain('line-height: 1.6');
    expect(styleBlock[1]).toContain('.sn-paragraph--tight');
    expect(styleBlock[1]).toContain('line-height: 1.4');
    expect(styleBlock[1]).toContain('.sn-paragraph--loose');
    expect(styleBlock[1]).toContain('line-height: 1.8');
  });
});
