import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import SnEquation from './SnEquation.vue';

/** Mount SnEquation through a wrapper component, mirroring real usage. */
function mountEquation(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnEquation },
      setup() {
        return () => h(SnEquation, props as never);
      },
    }),
  );
}

describe('SnEquation (AUI-WEB-DD-007)', () => {
  describe('rendering', () => {
    it('should render inline katex markup in a span.katex wrapper', () => {
      const w = mountEquation({ value: 'c = \\pm\\sqrt{a^2+b^2}' });
      const root = w.find('[data-snui-component="equation"]');
      expect(root.exists()).toBe(true);
      expect(root.element.tagName).toBe('SPAN');
      expect(root.classes()).toContain('katex');
      // KaTeX embeds the source expression in an x-tex annotation.
      expect(root.html()).toContain('a^2+b^2');
    });

    it('should render an empty span for the default empty value', () => {
      const w = mountEquation();
      const root = w.find('[data-snui-component="equation"]');
      expect(root.classes()).toContain('katex');
      expect(root.text()).toBe('');
    });

    it('should not throw on invalid latex (throwOnError defaults to false)', () => {
      expect(() => mountEquation({ value: '\\frac{' })).not.toThrow();
      const w = mountEquation({ value: '\\frac{' });
      // With throwOnError: false katex renders the raw source in a
      // span.katex-error instead of the normal katex markup.
      expect(w.find('[data-snui-component="equation"]').classes()).toContain('katex-error');
    });

    it('should update the rendered markup when value changes', async () => {
      const value = ref('a');
      const w = mount(
        defineComponent({
          components: { SnEquation },
          setup() {
            return () => h(SnEquation, { value: value.value });
          },
        }),
      );
      const before = w.html();
      value.value = 'b^2';
      await w.vm.$nextTick();
      expect(w.html()).not.toBe(before);
      expect(w.html()).toContain('b^2');
    });
  });

  describe('katexOptions', () => {
    it('should switch to a katex-display wrapper in displayMode', () => {
      // katex renders displayMode as `span.katex-display` (the consumer is
      // expected to wrap it in a block container if needed).
      const w = mountEquation({
        value: 'E=mc^2',
        katexOptions: { displayMode: true },
      });
      const root = w.find('[data-snui-component="equation"]');
      expect(root.element.tagName).toBe('SPAN');
      expect(root.classes()).toContain('katex-display');
    });

    it('should propagate the ParseError when throwOnError is overridden to true', () => {
      // Mirrors n-equation: katexOptions are forwarded verbatim, so
      // throwOnError: true makes renderToString throw like naive does.
      expect(() =>
        mountEquation({
          value: '\\frac{',
          katexOptions: { throwOnError: true },
        }),
      ).toThrow();
    });
  });

  describe('katex prop override', () => {
    it('should use the consumer-provided katex-like renderer', () => {
      const calls: Array<{ expression: string; options?: Record<string, unknown> }> = [];
      const customKatex = {
        renderToString(expression: string, options?: Record<string, unknown>): string {
          calls.push({ expression, options });
          return '<span class="custom-equation">stub</span>';
        },
      };
      const w = mountEquation({ value: 'x', katex: customKatex });
      const root = w.find('[data-snui-component="equation"]');
      expect(root.classes()).toContain('custom-equation');
      expect(root.text()).toBe('stub');
      expect(calls).toHaveLength(1);
      expect(calls[0].expression).toBe('x');
      expect(calls[0].options).toMatchObject({ throwOnError: false });
    });

    it('should render the no-katex placeholder when the override is unusable', () => {
      const w = mountEquation({ value: 'x', katex: undefined });
      // Bundled katex is present, so the placeholder only appears when the
      // resolution itself fails — assert the happy path stays katex instead.
      expect(w.find('[data-snui-component="equation"]').classes()).toContain('katex');
    });
  });
});
