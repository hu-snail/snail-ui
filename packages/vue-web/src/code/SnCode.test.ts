import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnCode from './SnCode.vue';

/** Mount SnCode through a wrapper component, mirroring real usage. */
function mountCode(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnCode },
      setup() {
        return () => h(SnCode, props as never, slots as never);
      },
    }),
  );
}

/** Mount SnCode with a mutable `code` source to test reactivity. */
function mountCodeReactive(initial: string, extra: Record<string, unknown> = {}) {
  let setCode = (_value: string): void => {};
  const wrapper = mount(
    defineComponent({
      components: { SnCode },
      setup() {
        const code = ref(initial);
        setCode = (value: string) => {
          code.value = value;
        };
        return () => h(SnCode, { ...extra, code: code.value } as never);
      },
    }),
  );
  return { wrapper, setCode };
}

describe('SnCode (AUI-WEB-DD-002)', () => {
  describe('rendering', () => {
    it('renders the code prop as text on the code root', () => {
      const w = mountCode({ code: 'console.log(a)' });
      const root = w.find('.sn-code');
      expect(root.attributes('data-snui-component')).toBe('code');
      expect(root.text()).toBe('console.log(a)');
    });

    it('renders the plain path raw when no language is set (whitespace preserved)', () => {
      const raw = '  keep\n  raw  ';
      const w = mountCode({ code: raw });
      expect(w.find('.sn-code__code').element.textContent).toBe(raw);
    });

    it('renders plain text for non-json languages (built-in tokenizer is json-only)', () => {
      const w = mountCode({ code: 'const a = 1', language: 'javascript' });
      expect(w.find('.sn-code__tok').exists()).toBe(false);
      expect(w.find('.sn-code__code').element.textContent).toBe('const a = 1');
    });

    it('renders no pre wrapper in inline mode', () => {
      const w = mountCode({ code: 'const a = 1', inline: true });
      expect(w.find('.sn-code__code').exists()).toBe(false);
      expect(w.find('.sn-code').text()).toBe('const a = 1');
    });

    it('renders custom slot content instead of the code prop', () => {
      const w = mountCode({ code: 'ignored' }, { default: () => 'custom content' });
      expect(w.find('.sn-code').text()).toBe('custom content');
    });
  });

  describe('trim', () => {
    it('trims the displayed code by default on the json path', () => {
      const w = mountCode({ code: '\n  {"a": 1}\n  ', language: 'json' });
      expect(w.find('.sn-code__code').element.textContent).toBe('{"a": 1}');
    });

    it('keeps surrounding whitespace on the json path when trim is false', () => {
      const raw = '\n{"a": 1}\n';
      const w = mountCode({ code: raw, language: 'json', trim: false });
      expect(w.find('.sn-code__code').element.textContent).toBe(raw);
    });
  });

  describe('json highlighting', () => {
    it('emits token segments for strings, numbers, keywords and punctuation', () => {
      const w = mountCode({
        code: '{"name": "A", "count": 3, "ok": true}',
        language: 'json',
      });
      expect(w.find('.sn-code__tok--key').exists()).toBe(true);
      expect(w.find('.sn-code__tok--string').exists()).toBe(true);
      expect(w.find('.sn-code__tok--number').exists()).toBe(true);
      expect(w.find('.sn-code__tok--keyword').exists()).toBe(true);
      expect(w.find('.sn-code__tok--punct').exists()).toBe(true);
    });

    it('marks object keys differently from string values at the same depth', () => {
      const w = mountCode({ code: '{"name": "A"}', language: 'json' });
      expect(w.find('.sn-code__tok--key').text()).toBe('"name"');
      expect(w.find('.sn-code__tok--string').text()).toBe('"A"');
    });

    it('tokenizes inline json without a pre wrapper', () => {
      const w = mountCode({ code: '{"a": 1}', language: 'json', inline: true });
      expect(w.find('.sn-code__code').exists()).toBe(false);
      expect(w.find('.sn-code__tok--number').text()).toBe('1');
    });
  });

  describe('word-wrap', () => {
    it('applies the word-wrap modifier class', () => {
      const w = mountCode({ code: 'x', wordWrap: true });
      expect(w.find('.sn-code').classes()).toContain('sn-code--word-wrap');
    });

    it('hides the line-number gutter when word-wrap is on', () => {
      const w = mountCode({ code: 'x', wordWrap: true, showLineNumbers: true });
      expect(w.find('.sn-code__line-numbers').exists()).toBe(false);
    });
  });

  describe('show-line-numbers', () => {
    it('renders one number per displayed line, right-aligned gutter', () => {
      const w = mountCode({ code: 'a\nb\nc', showLineNumbers: true });
      const root = w.find('.sn-code');
      expect(root.classes()).toContain('sn-code--show-line-numbers');
      expect(w.find('.sn-code__line-numbers').text()).toBe('1\n2\n3');
    });

    it('counts the trimmed text so gutter and code rows stay aligned', () => {
      // naive counts from the raw prop here; sn counts the displayed lines.
      const w = mountCode({ code: '\na\nb\n', language: 'json', showLineNumbers: true });
      expect(w.find('.sn-code__line-numbers').text()).toBe('1\n2');
    });

    it('hides the gutter in inline mode', () => {
      const w = mountCode({ code: 'a\nb', inline: true, showLineNumbers: true });
      expect(w.find('.sn-code__line-numbers').exists()).toBe(false);
    });
  });

  describe('uri', () => {
    it('decodes the code prop before display', () => {
      const w = mountCode({ code: encodeURIComponent('a\nb'), uri: true });
      expect(w.find('.sn-code').text()).toBe('a\nb');
    });

    it('falls back to the raw string on malformed input', () => {
      const w = mountCode({ code: '%zz', uri: true });
      expect(w.find('.sn-code').text()).toBe('%zz');
    });
  });

  describe('reactivity', () => {
    it('re-renders tokens when the code prop changes', async () => {
      const { wrapper: w, setCode } = mountCodeReactive('{"a": 1}', { language: 'json' });
      expect(w.find('.sn-code__tok--number').text()).toBe('1');

      setCode('{"a": 22}');
      await w.vm.$nextTick();
      expect(w.find('.sn-code__tok--number').text()).toBe('22');
    });
  });
});
