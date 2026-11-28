/**
 * sn-navbar unit tests — uni-end top navigation bar.
 *
 * Behaviour only (AGENTS.md §46): title / side text rendering, the tap →
 * emit contract, the disabled guards, the fixed + placeholder pair and the
 * accessibility roles. No rpx numbers in assertions — happy-dom discards
 * lengths it cannot parse.
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { mount } from '@vue/test-utils';

// getCapsuleMetrics 在组件模块加载即被调用并缓存返回对象；测试通过共享可变
// 对象驱动"测量到/未测量到"两条路径（组件持有同一引用，改字段即生效）。
const capsuleState = vi.hoisted(() => ({
  statusBarHeight: 0,
  navBarHeight: 44,
  capsulePadRight: 0,
  hasCapsule: false,
}));
vi.mock('../../utils/capsule', () => ({
  getCapsuleMetrics: () => capsuleState,
}));

import SnNavbar from './sn-navbar.vue';

describe('sn-navbar', () => {
  describe('content', () => {
    it('renders the title prop', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      expect(wrapper.find('.sn-navbar__title').text()).toBe('Home');
    });

    it('renders the title slot over the title prop', () => {
      const wrapper = mount(SnNavbar, {
        props: { title: 'Home' },
        slots: { title: '<text class="custom-title">Slot</text>' },
      });
      expect(wrapper.find('.custom-title').text()).toBe('Slot');
      expect(wrapper.find('.sn-navbar__title').exists()).toBe(false);
    });

    it('renders leftText on the left zone', () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } });
      expect(wrapper.find('.sn-navbar__left').text()).toBe('Back');
    });

    it('renders rightText on the right zone', () => {
      const wrapper = mount(SnNavbar, { props: { rightText: 'More' } });
      expect(wrapper.find('.sn-navbar__right').text()).toBe('More');
    });

    it('hides the left zone when nothing fills it', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      expect(wrapper.find('.sn-navbar__left').exists()).toBe(false);
    });

    it('hides the right zone when nothing fills it', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      expect(wrapper.find('.sn-navbar__right').exists()).toBe(false);
    });

    it('renders the back arrow when leftArrow is on', () => {
      const wrapper = mount(SnNavbar, { props: { leftArrow: true } });
      expect(wrapper.find('.sn-navbar__left .sn-navbar__arrow').exists()).toBe(true);
    });

    it('does not render the back arrow by default', () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } });
      expect(wrapper.find('.sn-navbar__arrow').exists()).toBe(false);
    });
  });

  describe('events', () => {
    it('emits click-left when the left zone is tapped', async () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(wrapper.emitted('click-left')).toHaveLength(1);
    });

    it('emits back together with click-left when leftArrow is on', async () => {
      const wrapper = mount(SnNavbar, { props: { leftArrow: true } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(wrapper.emitted('click-left')).toHaveLength(1);
      expect(wrapper.emitted('back')).toHaveLength(1);
    });

    it('does not emit back without the arrow', async () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(wrapper.emitted('back')).toBeUndefined();
    });

    it('emits click-right when the right zone is tapped', async () => {
      const wrapper = mount(SnNavbar, { props: { rightText: 'More' } });
      await wrapper.find('.sn-navbar__right').trigger('tap');
      expect(wrapper.emitted('click-right')).toHaveLength(1);
    });

    it('does not emit click-left while leftDisabled', async () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back', leftDisabled: true } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(wrapper.emitted('click-left')).toBeUndefined();
    });

    it('does not emit click-right while rightDisabled', async () => {
      const wrapper = mount(SnNavbar, { props: { rightText: 'More', rightDisabled: true } });
      await wrapper.find('.sn-navbar__right').trigger('tap');
      expect(wrapper.emitted('click-right')).toBeUndefined();
    });

    it('marks the disabled zones with aria-disabled', () => {
      const wrapper = mount(SnNavbar, {
        props: { leftText: 'Back', rightText: 'More', leftDisabled: true },
      });
      expect(wrapper.find('.sn-navbar__left').attributes('aria-disabled')).toBe('true');
      expect(wrapper.find('.sn-navbar__right').attributes('aria-disabled')).toBe('false');
    });

    it('emits back-home when the capsule is tapped', async () => {
      const wrapper = mount(SnNavbar, { slots: { capsule: '<text>cap</text>' } });
      await wrapper.find('.sn-navbar__capsule').trigger('tap');
      expect(wrapper.emitted('back-home')).toHaveLength(1);
    });

    it('suppresses the left zone when a capsule slot is present', () => {
      const wrapper = mount(SnNavbar, {
        props: { leftArrow: true },
        slots: { capsule: '<text>cap</text>' },
      });
      expect(wrapper.find('.sn-navbar__capsule').exists()).toBe(true);
      expect(wrapper.find('.sn-navbar__left').exists()).toBe(false);
    });
  });

  describe('layout', () => {
    it('adds the bordered class', () => {
      const wrapper = mount(SnNavbar, { props: { bordered: true } });
      expect(wrapper.find('.sn-navbar').classes()).toContain('sn-navbar--bordered');
    });

    it('adds the fixed class and writes z-index', () => {
      const wrapper = mount(SnNavbar, { props: { fixed: true, zIndex: 42 } });
      expect(wrapper.find('.sn-navbar').classes()).toContain('sn-navbar--fixed');
      expect(wrapper.find('.sn-navbar').attributes('style')).toContain('z-index: 42');
    });

    it('renders the placeholder only when fixed and placeholder are both on', () => {
      expect(
        mount(SnNavbar, { props: { fixed: true, placeholder: true } })
          .find('.sn-navbar__placeholder')
          .exists(),
      ).toBe(true);
      expect(
        mount(SnNavbar, { props: { placeholder: true } })
          .find('.sn-navbar__placeholder')
          .exists(),
      ).toBe(false);
      expect(
        mount(SnNavbar, { props: { fixed: true } })
          .find('.sn-navbar__placeholder')
          .exists(),
      ).toBe(false);
    });

    it('marks the placeholder as decorative', () => {
      const wrapper = mount(SnNavbar, { props: { fixed: true, placeholder: true } });
      expect(wrapper.find('.sn-navbar__placeholder').attributes('aria-hidden')).toBe('true');
    });

    it('mirrors the safe-area box on the placeholder when safeAreaInsetTop is on', () => {
      const wrapper = mount(SnNavbar, {
        props: { fixed: true, placeholder: true, safeAreaInsetTop: true },
      });
      expect(wrapper.find('.sn-navbar__placeholder').classes()).toContain(
        'sn-navbar__placeholder--safe-area',
      );
      expect(
        mount(SnNavbar, { props: { fixed: true, placeholder: true } })
          .find('.sn-navbar__placeholder')
          .classes(),
      ).not.toContain('sn-navbar__placeholder--safe-area');
    });

    it('reserves the measured status bar + nav row on the placeholder (MP border-box)', () => {
      // 全局 box-sizing: border-box 下，`min-height: 88rpx; padding-top: Npx`
      // 的空占位会塌成 max(88rpx, Npx)——导航行被 padding 吃掉，首屏内容
      // 顶进 fixed 导航栏下方（AUI-MP-002 回归）。占位必须显式拿
      // `calc(statusBar + 88rpx)` 总高。
      capsuleState.statusBarHeight = 47;
      capsuleState.hasCapsule = true;
      try {
        const wrapper = mount(SnNavbar, {
          props: { fixed: true, placeholder: true, safeAreaInsetTop: true },
        });
        expect(wrapper.find('.sn-navbar__placeholder').attributes('style')).toContain(
          'calc(47px + 88rpx)',
        );
      } finally {
        capsuleState.statusBarHeight = 0;
        capsuleState.hasCapsule = false;
      }
    });

    it('adds the safe-area class', () => {
      const wrapper = mount(SnNavbar, { props: { safeAreaInsetTop: true } });
      expect(wrapper.find('.sn-navbar').classes()).toContain('sn-navbar--safe-area');
    });

    it('forwards customClass and customStyle', () => {
      const wrapper = mount(SnNavbar, {
        props: { customClass: 'my-navbar', customStyle: 'margin: 4px;' },
      });
      expect(wrapper.find('.sn-navbar').classes()).toContain('my-navbar');
      expect(wrapper.find('.sn-navbar').attributes('style')).toContain('margin: 4px');
    });
  });

  describe('accessibility', () => {
    it('exposes role="navigation" on the root', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      expect(wrapper.find('.sn-navbar').attributes('role')).toBe('navigation');
    });

    it('labels the root with the title', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      expect(wrapper.find('.sn-navbar').attributes('aria-label')).toBe('Home');
    });

    it('marks the side zones as buttons', () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back', rightText: 'More' } });
      expect(wrapper.find('.sn-navbar__left').attributes('role')).toBe('button');
      expect(wrapper.find('.sn-navbar__right').attributes('role')).toBe('button');
    });

    it('names the side zones from the text, with spoken fallbacks', () => {
      const custom = mount(SnNavbar, { props: { leftText: 'Back', rightText: 'More' } });
      expect(custom.find('.sn-navbar__left').attributes('aria-label')).toBe('Back');
      expect(custom.find('.sn-navbar__right').attributes('aria-label')).toBe('More');
      const arrowOnly = mount(SnNavbar, { props: { leftArrow: true } });
      expect(arrowOnly.find('.sn-navbar__left').attributes('aria-label')).toBe('Back');
    });
  });

  describe('slots (left / right)', () => {
    it('renders the left slot and reveals the zone without leftText or arrow', () => {
      const wrapper = mount(SnNavbar, {
        props: { title: 'Home' },
        slots: { left: '<text class="custom-left">menu</text>' },
      });
      expect(wrapper.find('.custom-left').exists()).toBe(true);
      expect(wrapper.find('.sn-navbar__left').exists()).toBe(true);
    });

    it('renders the right slot and reveals the zone without rightText', () => {
      const wrapper = mount(SnNavbar, {
        props: { title: 'Home' },
        slots: { right: '<text class="custom-right">search</text>' },
      });
      expect(wrapper.find('.custom-right').exists()).toBe(true);
      expect(wrapper.find('.sn-navbar__right').exists()).toBe(true);
    });

    it('emits click-left from the slot-filled left zone', async () => {
      const wrapper = mount(SnNavbar, {
        slots: { left: '<text class="custom-left">menu</text>' },
      });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(wrapper.emitted('click-left')).toHaveLength(1);
    });

    it('does not emit click-left from the capsule zone', async () => {
      const wrapper = mount(SnNavbar, {
        props: { leftArrow: true },
        slots: { capsule: '<text>cap</text>' },
      });
      await wrapper.find('.sn-navbar__capsule').trigger('tap');
      expect(wrapper.emitted('back-home')).toHaveLength(1);
      expect(wrapper.emitted('click-left')).toBeUndefined();
    });
  });

  describe('built-in MP capsule (mpCapsule)', () => {
    afterEach(() => {
      capsuleState.hasCapsule = false;
    });

    it('renders the built-in capsule when the MP environment is measured', () => {
      capsuleState.hasCapsule = true;
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      expect(wrapper.find('.sn-navbar__mp-capsule').exists()).toBe(true);
    });

    it('renders nothing in the capsule zone outside the MP environment', () => {
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      expect(wrapper.find('.sn-navbar__mp-capsule').exists()).toBe(false);
      expect(wrapper.find('.sn-navbar__capsule').exists()).toBe(false);
    });

    it('yields to a custom #capsule slot', () => {
      capsuleState.hasCapsule = true;
      const wrapper = mount(SnNavbar, {
        slots: { capsule: '<text class="custom-cap">cap</text>' },
      });
      expect(wrapper.find('.sn-navbar__mp-capsule').exists()).toBe(false);
      expect(wrapper.find('.custom-cap').exists()).toBe(true);
    });

    it('yields to left-zone content', () => {
      capsuleState.hasCapsule = true;
      const wrapper = mount(SnNavbar, { props: { title: 'Home', leftText: 'Back' } });
      expect(wrapper.find('.sn-navbar__mp-capsule').exists()).toBe(false);
    });

    it('stays off when mpCapsule is false', () => {
      capsuleState.hasCapsule = true;
      const wrapper = mount(SnNavbar, { props: { title: 'Home', mpCapsule: false } });
      expect(wrapper.find('.sn-navbar__mp-capsule').exists()).toBe(false);
    });

    it('names the built-in capsule buttons for assistive tech', () => {
      capsuleState.hasCapsule = true;
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      const buttons = wrapper.findAll('.sn-navbar__mp-capsule-btn');
      expect(buttons).toHaveLength(2);
      expect(buttons[0].attributes('role')).toBe('button');
      expect(buttons[0].attributes('aria-label')).toBe('Back');
      expect(buttons[1].attributes('role')).toBe('button');
      expect(buttons[1].attributes('aria-label')).toBe('Home');
    });

    it('emits back and navigates back from the built-in back button', async () => {
      capsuleState.hasCapsule = true;
      const navigateBack = vi.fn();
      const host = globalThis as {
        uni?: { navigateBack: ReturnType<typeof vi.fn> };
        getCurrentPages?: () => unknown[];
      };
      host.uni = { navigateBack };
      host.getCurrentPages = () => [{ route: 'a' }, { route: 'b' }];
      try {
        const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
        await wrapper.find('.sn-navbar__mp-capsule-btn').trigger('tap');
        expect(wrapper.emitted('back')).toHaveLength(1);
        expect(navigateBack).toHaveBeenCalledWith({ delta: 1 });
        // 胶囊不是左侧文案区：不发 click-left。
        expect(wrapper.emitted('click-left')).toBeUndefined();
      } finally {
        delete host.uni;
        delete host.getCurrentPages;
      }
    });

    it('leaves navigation to the host when autoBack is off on the built-in capsule', async () => {
      capsuleState.hasCapsule = true;
      const navigateBack = vi.fn();
      const host = globalThis as { uni?: { navigateBack: ReturnType<typeof vi.fn> } };
      host.uni = { navigateBack };
      host.getCurrentPages = () => [{ route: 'a' }, { route: 'b' }];
      try {
        const wrapper = mount(SnNavbar, { props: { title: 'Home', autoBack: false } });
        await wrapper.find('.sn-navbar__mp-capsule-btn').trigger('tap');
        expect(navigateBack).not.toHaveBeenCalled();
        expect(wrapper.emitted('back')).toHaveLength(1);
      } finally {
        delete host.uni;
        delete host.getCurrentPages;
      }
    });

    it('does not emit back-home when the built-in back button is tapped', async () => {
      capsuleState.hasCapsule = true;
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      await wrapper.find('.sn-navbar__mp-capsule-btn').trigger('tap');
      // 返回键 stop 冒泡：容器的 back-home 契约只属于插槽内容。
      expect(wrapper.emitted('back-home')).toBeUndefined();
    });

    it('emits back-home once from the built-in home button', async () => {
      capsuleState.hasCapsule = true;
      const wrapper = mount(SnNavbar, { props: { title: 'Home' } });
      const homeButton = wrapper.findAll('.sn-navbar__mp-capsule-btn')[1];
      await homeButton.trigger('tap');
      expect(wrapper.emitted('back-home')).toHaveLength(1);
    });
  });

  describe('state classes', () => {
    it('flags the disabled sides on the root', () => {
      const wrapper = mount(SnNavbar, {
        props: { leftText: 'Back', rightText: 'More', leftDisabled: true, rightDisabled: true },
      });
      expect(wrapper.find('.sn-navbar').classes()).toContain('sn-navbar--left-disabled');
      expect(wrapper.find('.sn-navbar').classes()).toContain('sn-navbar--right-disabled');
    });

    it('writes no z-index while unfixed', () => {
      const wrapper = mount(SnNavbar, { props: { zIndex: 42 } });
      expect(wrapper.find('.sn-navbar').attributes('style')).toBeUndefined();
    });
  });

  describe('press feedback (hover-class)', () => {
    it('wires the pressed class on the left side', () => {
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } });
      expect(wrapper.find('.sn-navbar__left').attributes('hover-class')).toBe(
        'sn-navbar__side--pressed',
      );
    });

    it('wires the pressed class on the right side', () => {
      const wrapper = mount(SnNavbar, { props: { rightText: 'More' } });
      expect(wrapper.find('.sn-navbar__right').attributes('hover-class')).toBe(
        'sn-navbar__side--pressed',
      );
    });

    it('keeps disabled sides inert', () => {
      const wrapper = mount(SnNavbar, {
        props: { leftText: 'Back', rightText: 'More', leftDisabled: true, rightDisabled: true },
      });
      expect(wrapper.find('.sn-navbar__left').attributes('hover-class')).toBe('none');
      expect(wrapper.find('.sn-navbar__right').attributes('hover-class')).toBe('none');
    });
  });

  describe('default back navigation (autoBack)', () => {
    const host = globalThis as {
      uni?: { navigateBack: ReturnType<typeof vi.fn>; reLaunch: ReturnType<typeof vi.fn> };
      getCurrentPages?: () => unknown[];
    };

    /** 装一个栈深度可控的 uni 宿主，返回两个路由 spy。 */
    function installRouter(stackSize: number): {
      navigateBack: ReturnType<typeof vi.fn>;
      reLaunch: ReturnType<typeof vi.fn>;
    } {
      const navigateBack = vi.fn();
      const reLaunch = vi.fn();
      host.uni = { navigateBack, reLaunch };
      host.getCurrentPages = () =>
        Array.from({ length: stackSize }, (_, index) => ({ route: `page-${index}` }));
      return { navigateBack, reLaunch };
    }

    afterEach(() => {
      delete host.uni;
      delete host.getCurrentPages;
    });

    it('pops the page stack through uni.navigateBack when a previous page exists', async () => {
      const { navigateBack, reLaunch } = installRouter(2);
      const wrapper = mount(SnNavbar, { props: { leftArrow: true } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(navigateBack).toHaveBeenCalledTimes(1);
      expect(navigateBack).toHaveBeenCalledWith({ delta: 1 });
      expect(reLaunch).not.toHaveBeenCalled();
    });

    it('reLaunches backFallback when the stack has no previous page', async () => {
      const { navigateBack, reLaunch } = installRouter(1);
      const wrapper = mount(SnNavbar, {
        props: { leftArrow: true, backFallback: '/pages/index/index' },
      });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(navigateBack).not.toHaveBeenCalled();
      expect(reLaunch).toHaveBeenCalledWith({ url: '/pages/index/index' });
    });

    it('does not reload or reLaunch when the stack has no previous page and no fallback', async () => {
      const { navigateBack, reLaunch } = installRouter(1);
      const wrapper = mount(SnNavbar, { props: { leftArrow: true } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(navigateBack).not.toHaveBeenCalled();
      expect(reLaunch).not.toHaveBeenCalled();
    });

    it('leaves navigation to the host when autoBack is off', async () => {
      const { navigateBack, reLaunch } = installRouter(2);
      const wrapper = mount(SnNavbar, { props: { leftArrow: true, autoBack: false } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(navigateBack).not.toHaveBeenCalled();
      expect(reLaunch).not.toHaveBeenCalled();
      expect(wrapper.emitted('back')).toHaveLength(1);
    });

    it('does not navigate from a left zone without the arrow', async () => {
      const { navigateBack } = installRouter(2);
      const wrapper = mount(SnNavbar, { props: { leftText: 'Back' } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(navigateBack).not.toHaveBeenCalled();
    });

    it('does not navigate while leftDisabled', async () => {
      const { navigateBack } = installRouter(2);
      const wrapper = mount(SnNavbar, { props: { leftArrow: true, leftDisabled: true } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(navigateBack).not.toHaveBeenCalled();
    });

    it('still emits click-left / back alongside the default navigation', async () => {
      installRouter(2);
      const wrapper = mount(SnNavbar, { props: { leftArrow: true } });
      await wrapper.find('.sn-navbar__left').trigger('tap');
      expect(wrapper.emitted('click-left')).toHaveLength(1);
      expect(wrapper.emitted('back')).toHaveLength(1);
    });

    it('is inert without a uni host (docs preview / unit env)', async () => {
      const wrapper = mount(SnNavbar, { props: { leftArrow: true } });
      await expect(wrapper.find('.sn-navbar__left').trigger('tap')).resolves.toBeUndefined();
      expect(wrapper.emitted('back')).toHaveLength(1);
    });
  });

  describe('H5 hit-testing (stacking order)', () => {
    it('stacks the side zones above the full-width center container', () => {
      // 回归（H5 返回键点了没反应）：.sn-navbar__center 是 width:100% 的定位
      // 元素、DOM 顺序在侧区之后，浏览器会把它整块画在绝对定位的左右按钮
      // 之上 —— 点击落在标题容器上，onLeftTap 永远不触发（Playwright 报
      // "covered by .sn-navbar__center"）。happy-dom 不做绘制顺序，只能锁
      // 源码契约：侧区与胶囊区必须显式抬层。
      const source = readFileSync(
        resolve(process.cwd(), 'src/components/sn-navbar/sn-navbar.vue'),
        'utf8',
      );
      for (const selector of ['.sn-navbar__side', '.sn-navbar__capsule']) {
        const start = source.indexOf(`${selector} {`);
        expect(start, `${selector} rule missing`).toBeGreaterThan(-1);
        const body = source.slice(start, source.indexOf('}', start));
        expect(body).toMatch(/z-index:\s*1;/);
      }
    });
  });
});
