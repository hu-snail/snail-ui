import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnHighlight from './SnHighlight.vue';

/** Mount SnHighlight through a wrapper component, mirroring real usage. */
function mountHighlight(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnHighlight },
      setup() {
        return () => h(SnHighlight, props as never);
      },
    }),
  );
}

describe('SnHighlight (AUI-WEB-DD-009)', () => {
  describe('rendering', () => {
    it('renders plain text with no mark when patterns is empty', () => {
      const w = mountHighlight({ text: 'Hello world' });
      const root = w.find('.sn-highlight');
      expect(root.attributes('data-snui-component')).toBe('highlight');
      expect(root.text()).toBe('Hello world');
      expect(w.find('.sn-highlight__mark').exists()).toBe(false);
    });

    it('renders nothing when text is undefined', () => {
      const w = mountHighlight({ patterns: ['hello'] });
      expect(w.find('.sn-highlight').text()).toBe('');
    });

    it('renders matched fragments inside mark elements and keeps the rest plain', () => {
      const w = mountHighlight({
        text: 'Hello world, hello again',
        patterns: ['hello'],
      });
      const marks = w.findAll('.sn-highlight__mark');
      // Case-insensitive by default → "Hello" and "hello" both match.
      expect(marks).toHaveLength(2);
      expect(marks[0].text()).toBe('Hello');
      expect(marks[1].text()).toBe('hello');
      expect(w.find('.sn-highlight').text()).toBe('Hello world, hello again');
    });

    it('matches multiple patterns from a single pass', () => {
      const w = mountHighlight({
        text: 'The quick brown fox',
        patterns: ['quick', 'fox'],
      });
      const marks = w.findAll('.sn-highlight__mark');
      expect(marks).toHaveLength(2);
      expect(marks[0].text()).toBe('quick');
      expect(marks[1].text()).toBe('fox');
    });
  });

  describe('case-sensitive', () => {
    it('is case-insensitive by default', () => {
      const w = mountHighlight({ text: 'TypeScript typescript', patterns: ['typescript'] });
      expect(w.findAll('.sn-highlight__mark')).toHaveLength(2);
    });

    it('matches exact case only when case-sensitive is set', () => {
      const w = mountHighlight({
        text: 'TypeScript typescript',
        patterns: ['TypeScript'],
        caseSensitive: true,
      });
      const marks = w.findAll('.sn-highlight__mark');
      expect(marks).toHaveLength(1);
      expect(marks[0].text()).toBe('TypeScript');
    });
  });

  describe('auto-escape', () => {
    it('escapes regex metacharacters in patterns by default', () => {
      const w = mountHighlight({ text: 'a.b axb', patterns: ['a.b'] });
      const marks = w.findAll('.sn-highlight__mark');
      expect(marks).toHaveLength(1);
      expect(marks[0].text()).toBe('a.b');
    });

    it('treats patterns as regex fragments when auto-escape is false', () => {
      const w = mountHighlight({ text: 'a.b axb', patterns: ['a.b'], autoEscape: false });
      const marks = w.findAll('.sn-highlight__mark');
      // "a.b" now means "a" + any char + "b" → matches both fragments.
      expect(marks).toHaveLength(2);
    });
  });

  describe('highlight-tag', () => {
    it('uses mark by default', () => {
      const w = mountHighlight({ text: 'hello', patterns: ['hello'] });
      expect(w.find('mark.sn-highlight__mark').exists()).toBe(true);
    });

    it('renders a custom element when highlight-tag is set', () => {
      const w = mountHighlight({
        text: 'hello world',
        patterns: ['hello'],
        highlightTag: 'span',
      });
      expect(w.find('span.sn-highlight__mark').exists()).toBe(true);
      expect(w.find('mark').exists()).toBe(false);
    });
  });

  describe('highlight-class / highlight-style', () => {
    it('merges highlight-class onto matched fragments only', () => {
      const w = mountHighlight({
        text: 'hello world',
        patterns: ['hello'],
        highlightClass: 'my-mark',
      });
      const mark = w.find('.sn-highlight__mark');
      expect(mark.classes()).toContain('my-mark');
      // Plain fragments must not receive the custom class.
      expect(w.find('.my-mark').text()).toBe('hello');
    });

    it('applies highlight-style given as an object', () => {
      const w = mountHighlight({
        text: 'hello world',
        patterns: ['hello'],
        highlightStyle: { padding: '0 6px' },
      });
      expect(w.find('.sn-highlight__mark').attributes('style')).toContain('padding');
    });

    it('applies highlight-style given as a string', () => {
      const w = mountHighlight({
        text: 'hello world',
        patterns: ['hello'],
        highlightStyle: 'text-decoration: underline',
      });
      expect(w.find('.sn-highlight__mark').attributes('style')).toContain('underline');
    });
  });
});
