/**
 * SnLayout family unit tests — web-end layout containers.
 *
 * Behavior coverage (AGENTS.md §46 — assert observable output, not
 * internals):
 *   - vertical flex orchestration by default; horizontal with hasSider
 *   - position=absolute pins the root to inset 0
 *   - style passthrough reaches Header / Content / Footer / Sider via
 *     provide/inject
 *   - sider collapsed dual mode: transform slides the preserved DOM,
 *     width reflows the content (width / translate assertions)
 *   - built-in trigger click emits update:collapsed and toggles the
 *     uncontrolled state; controlled collapsed is not overridden
 *   - bordered / reverse placement classes
 *   - sider absolute positioning anchors to the correct edge
 *   - header / footer carry their height tokens; content flexes
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnLayout from './SnLayout.vue';
import SnLayoutHeader from './SnLayoutHeader.vue';
import SnLayoutContent from './SnLayoutContent.vue';
import SnLayoutFooter from './SnLayoutFooter.vue';
import SnLayoutSider from './SnLayoutSider.vue';

/** Mount SnLayout with rendered slot children (provide/inject needs real
 * component instances, so slots are composed with h() instead of HTML). */
function mountLayout(children: () => unknown[], props: Record<string, unknown> = {}) {
  const Host = defineComponent({
    setup() {
      return () => h(SnLayout, props, { default: children });
    },
  });
  return mount(Host);
}

describe('SnLayout', () => {
  it('should stack children vertically by default', () => {
    const w = mount(SnLayout);
    expect(w.classes()).toContain('sn-layout');
    expect(w.classes()).not.toContain('sn-layout--has-sider');
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/display:\s*flex/);
    expect(style).toMatch(/flex-direction:\s*column/);
  });

  it('should switch to horizontal row flex when hasSider is set', () => {
    const w = mount(SnLayout, { props: { hasSider: true } });
    expect(w.classes()).toContain('sn-layout--has-sider');
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/flex-direction:\s*row/);
    expect(style).toMatch(/flex-wrap:\s*nowrap/);
  });

  it('should fill the viewport via inset 0 when position is absolute', () => {
    const w = mount(SnLayout, { props: { position: 'absolute' } });
    expect(w.classes()).toContain('sn-layout--absolute');
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/position:\s*absolute/);
    for (const edge of ['top', 'right', 'bottom', 'left']) {
      expect(style).toMatch(new RegExp(`${edge}:\\s*0(px)?`));
    }
  });

  it('should stay in normal flow when position is static (default)', () => {
    const w = mount(SnLayout);
    expect(w.attributes('style') ?? '').not.toMatch(/position:\s*absolute/);
  });

  it('should forward header/footer/content styles through provide context', () => {
    const w = mountLayout(
      () => [
        h(SnLayoutHeader, () => 'top'),
        h(SnLayoutContent, () => 'main'),
        h(SnLayoutFooter, () => 'bottom'),
      ],
      {
        headerStyle: { background: 'red' },
        contentStyle: { padding: '8px' },
        footerStyle: 'color: blue',
      },
    );
    const header = w.find('.sn-layout-header');
    expect(header.attributes('style')).toMatch(/background:\s*red/);
    expect(header.attributes('style')).toMatch(/height:\s*var\(--sn-web-layout-header-height/);

    const content = w.find('.sn-layout-content');
    expect(content.attributes('style')).toMatch(/flex-grow:\s*1/);
    expect(content.attributes('style')).toMatch(/flex-shrink:\s*1/);
    expect(content.attributes('style')).toMatch(/padding:\s*8px/);

    const footer = w.find('.sn-layout-footer');
    expect(footer.attributes('style')).toMatch(/color:\s*blue/);
    expect(footer.attributes('style')).toMatch(/height:\s*var\(--sn-web-layout-footer-height/);

    expect(w.text()).toContain('top');
    expect(w.text()).toContain('main');
    expect(w.text()).toContain('bottom');
  });

  it('should lay out sider + stack horizontally in a hasSider layout', () => {
    const w = mountLayout(
      () => [h(SnLayoutSider, () => 'side'), h(SnLayoutContent, () => 'main')],
      { hasSider: true, siderStyle: { background: 'gray' } },
    );
    expect(w.attributes('style')).toMatch(/flex-direction:\s*row/);
    const sider = w.find('.sn-layout-sider');
    expect(sider.exists()).toBe(true);
    expect(sider.attributes('style')).toMatch(/background:\s*gray/);
  });

  it('should give content a scrollable flex region inside the layout', () => {
    const w = mountLayout(() => [h(SnLayoutContent, () => 'main')]);
    const content = w.find('.sn-layout-content');
    const style = content.attributes('style') ?? '';
    expect(style).toMatch(/flex-grow:\s*1/);
    expect(style).toMatch(/flex-shrink:\s*1/);
    expect(style).toMatch(/overflow-y:\s*auto/);
  });
});

describe('SnLayoutHeader / SnLayoutFooter', () => {
  it('should pin header height to the header-height token', () => {
    const w = mount(SnLayoutHeader);
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/flex-grow:\s*0/);
    expect(style).toMatch(/flex-shrink:\s*0/);
    expect(style).toMatch(/height:\s*var\(--sn-web-layout-header-height,\s*64px\)/);
  });

  it('should pin footer height to the footer-height token', () => {
    const w = mount(SnLayoutFooter);
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/flex-grow:\s*0/);
    expect(style).toMatch(/flex-shrink:\s*0/);
    expect(style).toMatch(/height:\s*var\(--sn-web-layout-footer-height,\s*64px\)/);
  });

  it('should render header/footer standalone without a parent layout', () => {
    const header = mount(SnLayoutHeader, { slots: { default: 'h' } });
    const footer = mount(SnLayoutFooter, { slots: { default: 'f' } });
    expect(header.text()).toContain('h');
    expect(footer.text()).toContain('f');
  });
});

describe('SnLayoutSider', () => {
  it('should default to 272px expanded box width', () => {
    const w = mount(SnLayoutSider);
    expect(w.classes()).toContain('sn-layout-sider--left');
    expect(w.classes()).not.toContain('sn-layout-sider--collapsed');
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/width:\s*272px/);
    expect(style).toMatch(/max-width:\s*272px/);
  });

  it('should clamp the box to collapsedWidth when collapsed (transform mode)', () => {
    const w = mount(SnLayoutSider, { props: { collapsed: true } });
    expect(w.classes()).toContain('sn-layout-sider--collapsed');
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/width:\s*272px/);
    expect(style).toMatch(/max-width:\s*64px/);
  });

  it('should slide the preserved DOM by -(width - collapsedWidth) in transform mode', () => {
    const w = mount(SnLayoutSider, { props: { collapsed: true } });
    const content = w.find('.sn-layout-sider__content');
    const style = content.attributes('style') ?? '';
    expect(style).toMatch(/min-width:\s*272px/);
    expect(style).toMatch(/transform:\s*translateX\(-208px\)/);
    expect(style).toMatch(/transition:\s*transform 0\.2s/);
  });

  it('should reset the slide to translateX(0) when expanded in transform mode', () => {
    const w = mount(SnLayoutSider);
    const content = w.find('.sn-layout-sider__content');
    expect(content.attributes('style') ?? '').toMatch(/transform:\s*translateX\(0px\)/);
  });

  it('should reflow content by width (no min-width / translate) in width mode', () => {
    const w = mount(SnLayoutSider, {
      props: { collapsed: true, collapseMode: 'width' },
    });
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/max-width:\s*64px/);
    const content = w.find('.sn-layout-sider__content');
    const contentStyle = content.attributes('style') ?? '';
    expect(contentStyle).not.toMatch(/min-width/);
    expect(contentStyle).not.toMatch(/transform/);
  });

  it('should slide the opposite way for reverse sider', () => {
    const w = mount(SnLayoutSider, {
      props: { collapsed: true, reverse: true },
    });
    expect(w.classes()).toContain('sn-layout-sider--right');
    const content = w.find('.sn-layout-sider__content');
    expect(content.attributes('style') ?? '').toMatch(/translateX\(208px\)/);
  });

  it('should honor custom width / collapsedWidth numbers', () => {
    const w = mount(SnLayoutSider, {
      props: { width: 300, collapsedWidth: 80, collapsed: true },
    });
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/width:\s*300px/);
    expect(style).toMatch(/max-width:\s*80px/);
    const content = w.find('.sn-layout-sider__content');
    expect(content.attributes('style') ?? '').toMatch(/translateX\(-220px\)/);
  });

  it('should pass through non-numeric CSS length widths', () => {
    const w = mount(SnLayoutSider, { props: { width: '30%' } });
    const style = w.attributes('style') ?? '';
    expect(style).toMatch(/width:\s*30%/);
    expect(style).toMatch(/max-width:\s*30%/);
  });

  it('should start collapsed from defaultCollapsed without v-model', () => {
    const w = mount(SnLayoutSider, { props: { defaultCollapsed: true } });
    expect(w.classes()).toContain('sn-layout-sider--collapsed');
  });

  it('should emit update:collapsed and toggle uncontrolled state on trigger click', async () => {
    const w = mount(SnLayoutSider, { props: { showTrigger: true } });
    const trigger = w.find('button');
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes('aria-expanded')).toBe('true');

    await trigger.trigger('click');
    expect(w.emitted('update:collapsed')?.at(-1)).toEqual([true]);
    expect(w.classes()).toContain('sn-layout-sider--collapsed');
    expect(trigger.attributes('aria-expanded')).toBe('false');

    await trigger.trigger('click');
    expect(w.emitted('update:collapsed')?.at(-1)).toEqual([false]);
    expect(w.classes()).not.toContain('sn-layout-sider--collapsed');
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });

  it('should not override controlled collapsed on trigger click', async () => {
    const w = mount(SnLayoutSider, {
      props: { showTrigger: true, collapsed: false },
    });
    await w.find('button').trigger('click');
    expect(w.emitted('update:collapsed')?.at(-1)).toEqual([true]);
    // Prop stays false (host has not applied the emit) → still expanded.
    expect(w.classes()).not.toContain('sn-layout-sider--collapsed');
    expect(w.find('button').attributes('aria-expanded')).toBe('true');
  });

  it('should render the built-in trigger for trigger string variants', () => {
    for (const variant of ['arrow-circle', 'bar'] as const) {
      const w = mount(SnLayoutSider, { props: { showTrigger: variant } });
      expect(w.find('button').exists()).toBe(true);
    }
  });

  it('should not render a trigger when showTrigger is false', () => {
    const w = mount(SnLayoutSider);
    expect(w.find('button').exists()).toBe(false);
  });

  it('should mark the content-facing edge with bordered class', () => {
    const left = mount(SnLayoutSider, { props: { bordered: true } });
    expect(left.classes()).toContain('sn-layout-sider--bordered');
    expect(left.classes()).toContain('sn-layout-sider--left');

    const right = mount(SnLayoutSider, {
      props: { bordered: true, reverse: true },
    });
    expect(right.classes()).toContain('sn-layout-sider--bordered');
    expect(right.classes()).toContain('sn-layout-sider--right');
  });

  it('should anchor to the correct edge when position is absolute', () => {
    const left = mount(SnLayoutSider, { props: { position: 'absolute' } });
    const leftStyle = left.attributes('style') ?? '';
    expect(leftStyle).toMatch(/position:\s*absolute/);
    expect(leftStyle).toMatch(/top:\s*0(px)?/);
    expect(leftStyle).toMatch(/bottom:\s*0(px)?/);
    expect(leftStyle).toMatch(/left:\s*0(px)?/);
    expect(leftStyle).not.toMatch(/right:\s*0(px)?/);

    const right = mount(SnLayoutSider, {
      props: { position: 'absolute', reverse: true },
    });
    const rightStyle = right.attributes('style') ?? '';
    expect(rightStyle).toMatch(/right:\s*0(px)?/);
    expect(rightStyle).not.toMatch(/left:\s*0(px)?/);
  });

  it('should fill an absolute layout together with absolute positioning', () => {
    const w = mountLayout(() => [h(SnLayoutSider, { position: 'absolute' }, () => 'side')], {
      position: 'absolute',
      hasSider: true,
    });
    expect(w.attributes('style') ?? '').toMatch(/position:\s*absolute/);
    const sider = w.find('.sn-layout-sider');
    expect(sider.attributes('style') ?? '').toMatch(/position:\s*absolute/);
  });
});
