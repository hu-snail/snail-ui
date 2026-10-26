/**
 * sn-img-cropper unit tests — uni-end image cropper (wd-img-cropper parity).
 *
 * Tests verify observable behaviour, not internals (AGENTS.md §46):
 *   - `v-model` opens / closes the layer, and cancel / confirm close it
 *   - the crop frame follows `aspect-ratio`
 *   - touch gestures pan the image and two-finger spread zooms, clamped by
 *     `max-scale`
 *   - the rotate control steps 90° and is absent when `disabled-rotate` is on
 *   - `confirm` reports the transform plus the covered source rectangle
 *   - `imgloaded` / `imgloaderror` forward the image element events
 *
 * No `rpx` numbers in assertions: happy-dom drops CSS lengths it cannot parse,
 * so geometry is asserted through the numbers `confirm` reports instead.
 */

import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import SnImgCropper from './sn-img-cropper.vue';
import SnPopup from '../sn-popup/sn-popup.vue';
import type { SnImgCropperResult } from './sn-img-cropper.vue';

const imgSrc = 'https://cdn.example.com/photo.jpg';

/** Mount a v-model harness so `update:modelValue` round-trips like real usage. */
function mountCropper(props: Record<string, unknown> = {}) {
  const visible = ref(true);
  const wrapper = mount(
    defineComponent({
      setup() {
        return () =>
          h(SnImgCropper, {
            modelValue: visible.value,
            'onUpdate:modelValue': (value: boolean) => {
              visible.value = value;
            },
            imgSrc,
            ...props,
          });
      },
    }),
  );
  return { wrapper, visible, preview: wrapper.findComponent(SnImgCropper) };
}

/** Build a TouchEvent-like object for the touch handlers. */
function touchEvent(points: Array<{ x: number; y: number }>): TouchEvent {
  const touches = points.map((point) => ({ clientX: point.x, clientY: point.y }));
  return { touches } as unknown as TouchEvent;
}

/** Dispatch a touchstart / touchmove pair onto the crop stage. */
function gesture(
  preview: ReturnType<typeof mountCropper>['preview'],
  start: Array<{ x: number; y: number }>,
  move: Array<{ x: number; y: number }>,
): void {
  const stage = preview.find('.sn-img-cropper__stage');
  stage.element.dispatchEvent(Object.assign(new Event('touchstart'), touchEvent(start)));
  stage.element.dispatchEvent(Object.assign(new Event('touchmove'), touchEvent(move)));
}

/** Tap the confirm button and return the emitted result. */
async function confirm(preview: ReturnType<typeof mountCropper>['preview']) {
  await preview.findAll('.sn-button')[1]?.trigger('tap');
  return preview.emitted('confirm')?.[0]?.[0] as SnImgCropperResult;
}

describe('sn-img-cropper', () => {
  it('should render the layer while v-model is true', () => {
    const { preview } = mountCropper();
    expect(preview.findComponent(SnPopup).props('modelValue')).toBe(true);
    expect(preview.find('.sn-img-cropper').exists()).toBe(true);
    expect(preview.find('image').attributes('src')).toBe(imgSrc);
  });

  it('should hide the layer while v-model is false', () => {
    const { preview } = mountCropper({ modelValue: false });
    expect(preview.findComponent(SnPopup).props('modelValue')).toBe(false);
  });

  it('should emit cancel and close on the cancel button', async () => {
    const { preview, visible } = mountCropper();
    await preview.findAll('.sn-button')[0]?.trigger('tap');
    expect(preview.emitted('cancel')).toHaveLength(1);
    expect(visible.value).toBe(false);
  });

  it('should emit confirm with the identity transform and close', async () => {
    const { preview, visible } = mountCropper();
    const result = await confirm(preview);
    expect(result).toMatchObject({ offsetX: 0, offsetY: 0, scale: 1, rotate: 0 });
    expect(visible.value).toBe(false);
  });

  it('should use a square crop frame for the default 1:1 ratio', async () => {
    const { preview } = mountCropper();
    const { frame } = await confirm(preview);
    expect(frame.width).toBe(frame.height);
    expect(frame.width).toBeGreaterThan(0);
  });

  it('should widen the frame for a 16:9 ratio and heighten it for 9:16', async () => {
    const wide = mountCropper({ aspectRatio: '16:9' });
    const wideFrame = (await confirm(wide.preview)).frame;
    expect(wideFrame.width).toBeGreaterThan(wideFrame.height);

    const tall = mountCropper({ aspectRatio: '9:16' });
    const tallFrame = (await confirm(tall.preview)).frame;
    expect(tallFrame.height).toBeGreaterThan(tallFrame.width);
  });

  it('should fall back to 1:1 for a malformed aspect ratio', async () => {
    const { preview } = mountCropper({ aspectRatio: 'nonsense' });
    const { frame } = await confirm(preview);
    expect(frame.width).toBe(frame.height);
  });

  it('should pan the image with a one-finger drag', async () => {
    const { preview } = mountCropper();
    gesture(preview, [{ x: 100, y: 100 }], [{ x: 150, y: 130 }]);
    await nextTick();

    const transform = preview.find('.sn-img-cropper__image').attributes('style') ?? '';
    expect(transform).toContain('translate(');
    // A 50px / 30px drag is 100rpx / 60rpx at the 2× design ratio.
    expect(transform).toContain('100rpx');
    expect(transform).toContain('60rpx');
  });

  it('should zoom with a two-finger spread, clamped by maxScale', async () => {
    const { preview } = mountCropper({ maxScale: 2 });
    // Start distance 100 → move distance 400 (a 4× spread), clamped to 2.
    gesture(
      preview,
      [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
      ],
      [
        { x: 0, y: 100 },
        { x: 400, y: 100 },
      ],
    );
    await nextTick();
    expect(preview.find('.sn-img-cropper__image').attributes('style')).toContain('scale(2)');
  });

  it('should step the rotation by 90 degrees per tap', async () => {
    const { preview } = mountCropper();
    await preview.find('[aria-label="rotate"]').trigger('tap');
    await nextTick();
    expect(preview.find('.sn-img-cropper__image').attributes('style')).toContain('rotate(90deg)');

    await preview.find('[aria-label="rotate"]').trigger('tap');
    await nextTick();
    expect(preview.find('.sn-img-cropper__image').attributes('style')).toContain('rotate(180deg)');
  });

  it('should wrap the rotation past 360 degrees', async () => {
    const { preview } = mountCropper();
    for (let i = 0; i < 4; i++) {
      await preview.find('[aria-label="rotate"]').trigger('tap');
      await nextTick();
    }
    expect(preview.find('.sn-img-cropper__image').attributes('style')).toContain('rotate(0deg)');
  });

  it('should hide the rotate control when disabledRotate is on', () => {
    const { preview } = mountCropper({ disabledRotate: true });
    expect(preview.find('[aria-label="rotate"]').exists()).toBe(false);
    expect(preview.find('.sn-img-cropper').classes()).toContain('sn-img-cropper--rotate-disabled');
  });

  it('should reset the transform from the reset control', async () => {
    const { preview } = mountCropper();
    await preview.find('[aria-label="rotate"]').trigger('tap');
    await nextTick();
    await preview.find('[aria-label="reset"]').trigger('tap');
    await nextTick();
    const transform = preview.find('.sn-img-cropper__image').attributes('style') ?? '';
    expect(transform).toContain('rotate(0deg)');
    expect(transform).toContain('scale(1)');
  });

  it('should report the covered source rectangle in confirm', async () => {
    const { preview } = mountCropper({ aspectRatio: '1:1' });
    const { source } = await confirm(preview);
    // At scale 1 the frame covers its own size in design px (500rpx → 250px).
    expect(source.width).toBe(250);
    expect(source.height).toBe(250);
    expect(source.x).toBe(0);
    expect(source.y).toBe(0);
  });

  it('should halve the covered source when zoomed to 2x', async () => {
    const { preview } = mountCropper({ aspectRatio: '1:1', maxScale: 4 });
    // Start distance 100 → move distance 200 (exactly a 2× spread).
    gesture(
      preview,
      [
        { x: 100, y: 100 },
        { x: 200, y: 100 },
      ],
      [
        { x: 50, y: 100 },
        { x: 250, y: 100 },
      ],
    );
    await nextTick();
    const result = await confirm(preview);
    expect(result.scale).toBe(2);
    expect(result.source.width).toBe(125);
  });

  it('should emit imgloaded when the image loads', async () => {
    const { preview } = mountCropper();
    await preview.find('image').trigger('load');
    expect(preview.emitted('imgloaded')?.[0]?.[0]).toEqual({ src: imgSrc });
  });

  it('should emit imgloaderror when the image fails', async () => {
    const { preview } = mountCropper();
    await preview.find('image').trigger('error');
    expect(preview.emitted('imgloaderror')).toHaveLength(1);
  });

  it('should size the preview image from imgWidth / imgHeight', () => {
    // `%` strings: happy-dom drops CSS lengths it cannot parse (`rpx`), so the
    // string form is what it can round-trip. The numeric → rpx mapping is the
    // same conversion the frame / offset styles use.
    const { preview } = mountCropper({ imgWidth: '60%', imgHeight: '80%' });
    const style = preview.find('.sn-img-cropper__image').attributes('style') ?? '';
    expect(style).toContain('width: 60%');
    expect(style).toContain('height: 80%');
  });

  it('should keep the default fit when imgWidth / imgHeight are unset', () => {
    const { preview } = mountCropper();
    const style = preview.find('.sn-img-cropper__image').attributes('style') ?? '';
    expect(style).not.toContain('width:');
    expect(style).not.toContain('height:');
  });

  it('should accept the export parity props without changing the result', async () => {
    const { preview } = mountCropper({ exportScale: 2, quality: 0.8, fileType: 'jpg' });
    const result = await confirm(preview);
    expect(result.scale).toBe(1);
    expect(result.frame.width).toBeGreaterThan(0);
  });

  it('should render the custom button labels', () => {
    const { preview } = mountCropper({ cancelButtonText: '放弃', confirmButtonText: '保存' });
    expect(preview.text()).toContain('放弃');
    expect(preview.text()).toContain('保存');
  });

  it('should forward customClass and customStyle to the root', () => {
    const { preview } = mountCropper({ customClass: 'my-cropper', customStyle: 'padding: 8px' });
    const root = preview.find('.sn-img-cropper');
    expect(root.classes()).toContain('my-cropper');
    expect(root.attributes('style')).toContain('padding: 8px');
  });

  it('should expose the cropper as a modal dialog', () => {
    const { preview } = mountCropper();
    const root = preview.find('.sn-img-cropper');
    expect(root.attributes('role')).toBe('dialog');
    expect(root.attributes('aria-modal')).toBe('true');
    expect(root.attributes('aria-label')).toBe(`image cropper: ${imgSrc}`);
  });
});
