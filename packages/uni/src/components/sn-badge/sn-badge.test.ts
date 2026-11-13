/**
 * sn-badge unit tests — uni-end count / dot marker (AUI-MP-DS-002).
 *
 * Covers the reference surface: value / max / isDot / hidden / type / bgColor /
 * showZero / shape / border / top / right / customClass / customStyle.
 *
 * Assertions stay on classes / attributes / text — happy-dom drops CSS lengths
 * it cannot parse, so `rpx` values are never asserted.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SnBadge from './sn-badge.vue';
// Raw SFC source for CSS-level regression guards (vitest 的 import.meta.url
// 不是 file: 协议，readFileSync(new URL(...)) 会抛 "The URL must be of scheme
// file"；?raw 走 Vite 资产管线，两端一致)。happy-dom 不解析 rpx token 样式，
// App 端裁剪类回归只能断言源码里的规则本体。
import badgeSource from './sn-badge.vue?raw';

describe('sn-badge', () => {
  describe('value rendering', () => {
    it('renders the wrapped content and the numeric value', () => {
      const w = mount(SnBadge, { props: { value: 8 }, slots: { default: 'host' } });
      expect(w.text()).toContain('host');
      expect(w.find('.sn-badge__marker').text()).toBe('8');
    });

    it('renders a string value verbatim', () => {
      const w = mount(SnBadge, { props: { value: 'new' } });
      expect(w.find('.sn-badge__marker').text()).toBe('new');
    });

    it('caps a numeric value at max with a trailing plus', () => {
      const w = mount(SnBadge, { props: { value: 120, max: 99 } });
      expect(w.find('.sn-badge__marker').text()).toBe('99+');
    });

    it('ignores max for string values', () => {
      const w = mount(SnBadge, { props: { value: 'v120', max: 99 } });
      expect(w.find('.sn-badge__marker').text()).toBe('v120');
    });

    it('renders no marker when value is absent', () => {
      const w = mount(SnBadge, { slots: { default: 'host' } });
      expect(w.find('.sn-badge__marker').exists()).toBe(false);
    });

    it('suppresses a zero value by default', () => {
      const w = mount(SnBadge, { props: { value: 0 } });
      expect(w.find('.sn-badge__marker').exists()).toBe(false);
    });

    it('renders a zero value when showZero is on', () => {
      const w = mount(SnBadge, { props: { value: 0, showZero: true } });
      expect(w.find('.sn-badge__marker').text()).toBe('0');
    });

    it('hides the marker when hidden is on, even with a value', () => {
      const w = mount(SnBadge, { props: { value: 5, hidden: true } });
      expect(w.find('.sn-badge__marker').exists()).toBe(false);
    });

    it('renders no marker for an empty-string value', () => {
      const w = mount(SnBadge, { props: { value: '' } });
      expect(w.find('.sn-badge__marker').exists()).toBe(false);
    });

    it('lets hidden win over dot mode', () => {
      const w = mount(SnBadge, { props: { isDot: true, hidden: true } });
      expect(w.find('.sn-badge__marker').exists()).toBe(false);
    });
  });

  describe('dot mode', () => {
    it('renders a dot marker without text', () => {
      const w = mount(SnBadge, { props: { isDot: true } });
      expect(w.classes()).toContain('sn-badge--dot');
      expect(w.find('.sn-badge__marker').exists()).toBe(true);
      expect(w.find('.sn-badge__marker').text()).toBe('');
      expect(w.find('.sn-badge__marker').attributes('aria-hidden')).toBe('true');
    });

    it('renders a dot even without a value', () => {
      const w = mount(SnBadge, { props: { isDot: true, value: undefined } });
      expect(w.find('.sn-badge__marker').exists()).toBe(true);
    });
  });

  describe('type', () => {
    it('renders the danger marker by default', () => {
      const w = mount(SnBadge, { props: { value: 3 } });
      expect(w.find('.sn-badge__marker').classes()).not.toContain('sn-badge__marker--primary');
    });

    it('applies the type class for each semantic colour', () => {
      for (const type of ['primary', 'success', 'warning', 'danger', 'info'] as const) {
        const w = mount(SnBadge, { props: { value: 1, type } });
        expect(w.find('.sn-badge__marker').classes()).toContain(`sn-badge__marker--${type}`);
      }
    });

    it('forwards bgColor as an inline background override', () => {
      const w = mount(SnBadge, { props: { value: 1, bgColor: '#abcdef' } });
      expect(w.find('.sn-badge__marker').attributes('style')).toContain(
        'background-color: #abcdef',
      );
    });
  });

  describe('shape', () => {
    it('defaults to the circle shape', () => {
      const w = mount(SnBadge, { props: { value: 1 } });
      expect(w.find('.sn-badge__marker').classes()).toContain('sn-badge__marker--circle');
    });

    it('applies the shape class for square and bubble', () => {
      for (const shape of ['square', 'bubble'] as const) {
        const w = mount(SnBadge, { props: { value: 1, shape } });
        expect(w.find('.sn-badge__marker').classes()).toContain(`sn-badge__marker--${shape}`);
      }
    });

    it('adds the border class when border is on', () => {
      const w = mount(SnBadge, { props: { value: 1, border: true } });
      expect(w.find('.sn-badge__marker').classes()).toContain('sn-badge__marker--border');
    });
  });

  describe('offsets', () => {
    it('adds px units to numeric top / right offsets', () => {
      const w = mount(SnBadge, { props: { value: 1, top: 4, right: 6 } });
      const style = w.find('.sn-badge__marker').attributes('style') ?? '';
      expect(style).toContain('top: 4px');
      expect(style).toContain('right: 6px');
    });

    it('forwards string offsets verbatim', () => {
      const w = mount(SnBadge, { props: { value: 1, top: '8px', right: '8px' } });
      const style = w.find('.sn-badge__marker').attributes('style') ?? '';
      expect(style).toContain('top: 8px');
      expect(style).toContain('right: 8px');
    });

    it('leaves the marker style empty without offsets or bgColor', () => {
      const w = mount(SnBadge, { props: { value: 1 } });
      expect(w.find('.sn-badge__marker').attributes('style')).toBeUndefined();
    });

    it('ignores empty-string offsets', () => {
      const w = mount(SnBadge, { props: { value: 1, top: '', right: '' } });
      expect(w.find('.sn-badge__marker').attributes('style')).toBeUndefined();
    });
  });

  describe('root passthrough', () => {
    it('forwards customClass and customStyle to the root node', () => {
      const w = mount(SnBadge, {
        props: { value: 1, customClass: 'my-badge', customStyle: 'margin: 4px' },
      });
      expect(w.classes()).toContain('my-badge');
      expect(w.attributes('style')).toContain('margin: 4px');
    });
  });

  describe('uni-app x App overflow visibility (source level)', () => {
    it('keeps the root overflow-visible as the negative-offset escape hatch', () => {
      // 常规骑跨几何下 marker 永不出 root 盒（突出量由 __host margin 预留），
      // overflow: visible 只为用户传负值 top / right 把 marker 推出盒外的
      // 场景兜底（web / 小程序端生效；App 端溢出渲染本就不可靠）。
      const style = badgeSource.slice(badgeSource.indexOf('<style'));
      expect(style).toMatch(/\.sn-badge \{[^}]*overflow:\s*visible/);
    });

    it('states the marker text font and colour explicitly instead of relying on inherit', () => {
      // App 端样式不级联（仅 color / font-size 原生继承，inherit 关键字亦不可
      // 靠）：文字必须显式拿到 marker 的字号 / 行高 / 颜色，否则回落引擎默认
      // 值。回归守卫——不许再出现 inherit 依赖。
      const style = badgeSource.slice(badgeSource.indexOf('<style'));
      const rule = /\.sn-badge__text \{([^}]*)\}/.exec(style)?.[1] ?? '';
      expect(rule).toContain('font-size: var(--sn-mp-font-size-xs)');
      expect(rule).toContain('line-height: 1');
      expect(rule).toContain('color: var(--sn-mp-color-text-on-primary)');
      expect(rule).not.toContain('inherit');
    });
  });

  describe('corner straddle via host headroom (every end)', () => {
    // 真机 + H5 双重实测的中间解：transform 骑角（一半出 root 盒）在 App 端
    // 被圆角根裁剪、overflow: visible 压不住；在 H5 被后绘宿主容器盖住。
    // 骑跨量改为 __host margin 预留在 root 盒内，marker 锚 root 外角、无
    // transform——一半压内容盒、一半留余量，全端确定性渲染。

    it('keeps the root padding-free so App content-area anchoring matches web', () => {
      // App 端 absolute 在父元素「内容区域」锚定（官方 css/position），web 端
      // 锚定 padding box——root 一旦带 padding，两端 marker 落点分叉。余量只
      // 能放 __host margin。
      const style = badgeSource.slice(badgeSource.indexOf('<style'));
      const rule = (/\.sn-badge \{([^}]*)\}/.exec(style)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
      expect(rule).not.toMatch(/padding\s*:/);
      expect(rule).not.toMatch(/border-radius\s*:/);
    });

    it('reserves half the count-marker height as host headroom', () => {
      const style = badgeSource.slice(badgeSource.indexOf('<style'));
      const rule = /\.sn-badge__host \{([^}]*)\}/.exec(style)?.[1] ?? '';
      expect(rule).toContain('margin-top: 16rpx');
      expect(rule).toContain('margin-right: 16rpx');
    });

    it('halves the headroom in dot mode so the dot centre stays on the corner', () => {
      const style = badgeSource.slice(badgeSource.indexOf('<style'));
      const rule = /\.sn-badge--dot \.sn-badge__host \{([^}]*)\}/.exec(style)?.[1] ?? '';
      expect(rule).toContain('margin-top: 8rpx');
      expect(rule).toContain('margin-right: 8rpx');
    });

    it('anchors the marker at the root corner with no riding transform', () => {
      const style = badgeSource.slice(badgeSource.indexOf('<style'));
      const rule = /\.sn-badge__marker \{([^}]*)\}/.exec(style)?.[1] ?? '';
      expect(rule).toContain('top: 0');
      expect(rule).toContain('right: 0');
      // 断言意图：规则体内不得出现 transform 声明（骑角归零）——注释文字里的
      // 旧方案记载不受影响。
      expect(rule).not.toMatch(/transform\s*:/);
    });

    it('renders the marker as a sibling of the host, never inside it', () => {
      // marker 若落进宿主盒子，宿主的圆角 / 裁剪会削掉骑跨的一半（avatar
      // 状态点的同款结论）。
      const w = mount(SnBadge, { props: { value: 8 }, slots: { default: 'host' } });
      expect(w.find('.sn-badge__host').text()).toContain('host');
      expect(w.find('.sn-badge__host .sn-badge__marker').exists()).toBe(false);
    });

    it('keeps the pin in the class rule, not a script gate (style AND script gates drift independently)', () => {
      const script = badgeSource.slice(0, badgeSource.indexOf('<template'));
      expect(script).not.toContain('markerPlatformStyle');
      // 全端统一骑跨后不再需要任何分端开关——style / script 里的 #ifdef 都是
      // 漂移隐患（vapor 不剥 style gate 的教训）。
      expect(script).not.toContain('#ifdef');
      const style = badgeSource.slice(badgeSource.indexOf('<style'));
      expect(style).not.toContain('#ifdef');
    });

    it('keeps the marker style undefined in a DOM host (positioning is class-owned)', () => {
      const w = mount(SnBadge, { props: { value: 1 } });
      expect(w.find('.sn-badge__marker').attributes('style')).toBeUndefined();
    });

    it('still forwards user top / right offsets from the riding corner', () => {
      const w = mount(SnBadge, { props: { value: 1, top: 4, right: 6 } });
      const style = w.find('.sn-badge__marker').attributes('style') ?? '';
      expect(style).toContain('top: 4px');
      expect(style).toContain('right: 6px');
      expect(style).not.toContain('transform');
    });
  });
});
