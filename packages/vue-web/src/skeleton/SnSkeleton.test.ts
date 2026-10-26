/**
 * SnSkeleton tests — AUI-WEB-FB-007.
 *
 * Reference: naive-ui `n-skeleton`. These tests pin the observable contract,
 * with emphasis on the size-resolution order that is easy to get subtly wrong:
 * circle squares the footprint, an explicit width/height beats the `size`
 * tier, and the tier only fills in what is still missing.
 */

import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SnSkeleton from './SnSkeleton.vue';

function mountSkeleton(props: Record<string, unknown> = {}) {
  return mount(SnSkeleton, { props });
}

/** Every rendered block (`repeat` can yield more than one). */
function blocksOf(wrapper: ReturnType<typeof mountSkeleton>) {
  return wrapper.findAll('.sn-skeleton');
}

function styleOf(wrapper: ReturnType<typeof mountSkeleton>, index = 0) {
  const block = blocksOf(wrapper)[index];
  if (!block) throw new Error(`no skeleton block at index ${index}`);
  return block.element.style;
}

describe('SnSkeleton', () => {
  describe('rendering', () => {
    it('should render a single block by default', () => {
      const wrapper = mountSkeleton();

      expect(blocksOf(wrapper)).toHaveLength(1);
      expect(wrapper.find('[data-snui-component="SnSkeleton"]').exists()).toBe(true);
    });

    it('should leave both dimensions to the stylesheet defaults', () => {
      const style = styleOf(mountSkeleton());

      // No inline width/height: an empty inline value would override the
      // stylesheet's `1em` / `100%` fallbacks.
      expect(style.width).toBe('');
      expect(style.height).toBe('');
    });

    it('should mark the blocks as decorative for assistive tech', () => {
      for (const block of blocksOf(mountSkeleton())) {
        expect(block.attributes('aria-hidden')).toBe('true');
      }
    });
  });

  describe('repeat', () => {
    it('should render N sibling blocks', () => {
      expect(blocksOf(mountSkeleton({ repeat: 3 }))).toHaveLength(3);
    });

    it('should treat repeat below 2 as a single block', () => {
      expect(blocksOf(mountSkeleton({ repeat: 0 }))).toHaveLength(1);
      expect(blocksOf(mountSkeleton({ repeat: 1 }))).toHaveLength(1);
      expect(blocksOf(mountSkeleton({ repeat: -5 }))).toHaveLength(1);
    });
  });

  describe('size resolution', () => {
    it('should treat a numeric width and height as px', () => {
      const style = styleOf(mountSkeleton({ width: 120, height: 40 }));

      expect(style.width).toBe('120px');
      expect(style.height).toBe('40px');
    });

    it('should pass CSS lengths through untouched', () => {
      const style = styleOf(mountSkeleton({ width: '60%', height: '2rem' }));

      expect(style.width).toBe('60%');
      expect(style.height).toBe('2rem');
    });

    it('should fall back to the height tier of `size`', () => {
      expect(styleOf(mountSkeleton({ size: 'small' })).height).toBe(
        'var(--sn-web-skeleton-height-small)',
      );
      expect(styleOf(mountSkeleton({ size: 'large' })).height).toBe(
        'var(--sn-web-skeleton-height-large)',
      );
    });

    it('should let an explicit height beat the size tier', () => {
      const style = styleOf(mountSkeleton({ size: 'large', height: 40 }));

      expect(style.height).toBe('40px');
    });

    it('should leave both dimensions unset with no size and no width/height', () => {
      const style = styleOf(mountSkeleton());

      expect(style.width).toBe('');
      expect(style.height).toBe('');
    });

    it('should fall back to the stylesheet height for a disabled sharp block', () => {
      const style = styleOf(mountSkeleton({ sharp: false }));

      expect(style.borderRadius).toBe('var(--sn-web-skeleton-radius)');
      expect(style.height).toBe('');
    });
  });

  describe('circle', () => {
    it('should square the footprint and round it fully', () => {
      const style = styleOf(mountSkeleton({ circle: true, height: 48 }));

      expect(style.width).toBe('48px');
      expect(style.height).toBe('48px');
      expect(style.borderRadius).toBe('50%');
    });

    it('should let width stand in for height', () => {
      const style = styleOf(mountSkeleton({ circle: true, width: 64 }));

      expect(style.width).toBe('64px');
      expect(style.height).toBe('64px');
    });

    it('should prefer width when both are given', () => {
      const style = styleOf(mountSkeleton({ circle: true, width: 64, height: 32 }));

      expect(style.width).toBe('64px');
      expect(style.height).toBe('64px');
    });

    it('should fall back to the size tier when neither dimension is given', () => {
      const style = styleOf(mountSkeleton({ circle: true, size: 'medium' }));

      expect(style.width).toBe('var(--sn-web-skeleton-height-medium)');
      expect(style.height).toBe('var(--sn-web-skeleton-height-medium)');
    });

    it('should beat round and sharp', () => {
      const style = styleOf(mountSkeleton({ circle: true, round: true, sharp: false }));

      expect(style.borderRadius).toBe('50%');
    });
  });

  describe('border radius', () => {
    it('should keep square corners with the default sharp', () => {
      expect(styleOf(mountSkeleton()).borderRadius).toBe('');
    });

    it('should pill the ends when round is set', () => {
      expect(styleOf(mountSkeleton({ round: true })).borderRadius).toBe('4096px');
    });

    it('should use the token radius when sharp is turned off', () => {
      expect(styleOf(mountSkeleton({ sharp: false })).borderRadius).toBe(
        'var(--sn-web-skeleton-radius)',
      );
    });

    it('should let round beat a disabled sharp', () => {
      expect(styleOf(mountSkeleton({ round: true, sharp: false })).borderRadius).toBe('4096px');
    });
  });

  describe('text', () => {
    it('should inline the block and shift the baseline', () => {
      const style = styleOf(mountSkeleton({ text: true }));

      expect(style.display).toBe('inline-block');
      expect(style.verticalAlign).toBe('-0.125em');
    });

    it('should add the text modifier class', () => {
      expect(blocksOf(mountSkeleton({ text: true }))[0]?.classes()).toContain('sn-skeleton--text');
    });

    it('should leave the block display alone without text', () => {
      expect(styleOf(mountSkeleton()).display).toBe('');
    });
  });

  describe('animated', () => {
    it('should animate by default', () => {
      expect(styleOf(mountSkeleton()).animation).toBe('');
    });

    it('should disable the animation when animated is false', () => {
      expect(styleOf(mountSkeleton({ animated: false })).animation).toBe('none');
    });
  });
});
