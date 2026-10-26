import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnImage from './SnImage.vue';
import SnImageGroup from './SnImageGroup.vue';

/** Minimal 1×1 png data uri — keeps every demo/test self-contained. */
const PNG_1PX =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

/** Mount through a wrapper component, mirroring real usage. */
function mountImage(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
  const w = mount(
    defineComponent({
      components: { SnImage },
      setup() {
        return () => h(SnImage, props as never, slots as never);
      },
    }),
  );
  mountedWrappers.push(w);
  return w;
}

/** Mount a group with two member images (optional extra props per image). */
function mountGroup(
  imageProps: Array<Record<string, unknown>> = [],
  groupProps: Record<string, unknown> = {},
) {
  const w = mount(
    defineComponent({
      components: { SnImage, SnImageGroup },
      setup() {
        return () =>
          h(SnImageGroup, groupProps as never, {
            default: () => imageProps.map((p) => h(SnImage, { ...p, key: String(p.src) } as never)),
          });
      },
    }),
  );
  mountedWrappers.push(w);
  return w;
}

interface IOController {
  fire: (isIntersecting: boolean) => void;
}

/** Stub IntersectionObserver, handing tests manual control. */
function stubIntersectionObserver(): IOController[] {
  const controllers: IOController[] = [];
  class IOStub {
    constructor(callback: IntersectionObserverCallback) {
      controllers.push({
        fire: (isIntersecting: boolean) => {
          callback(
            [{ isIntersecting } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
        },
      });
    }
    observe(): void {}
    disconnect(): void {}
    unobserve(): void {}
  }
  vi.stubGlobal('IntersectionObserver', IOStub);
  return controllers;
}

/** Wrappers still mounted for the current test — unmounted in afterEach so
 * no stale document-level preview listeners survive into the next test. */
const mountedWrappers: Array<ReturnType<typeof mount>> = [];

function previewRoot(): Element | null {
  return document.querySelector('.sn-image-preview');
}

function previewImg(): HTMLImageElement | null {
  return document.querySelector('.sn-image-preview__img');
}

afterEach(() => {
  for (const w of mountedWrappers.splice(0)) w.unmount();
  document.body.innerHTML = '';
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('SnImage rendering (AUI-WEB-DD-010)', () => {
  it('renders an img inside the sn-image wrapper with src and alt', () => {
    const w = mountImage({ src: PNG_1PX, alt: '占位' });
    expect(w.find('[data-snui-component="image"]').exists()).toBe(true);
    const img = w.find('img');
    expect(img.attributes('src')).toBe(PNG_1PX);
    expect(img.attributes('alt')).toBe('占位');
    expect(img.attributes('aria-label')).toBe('占位');
  });

  it('forwards numeric width/height as attributes and object-fit as style', () => {
    const w = mountImage({ src: PNG_1PX, width: 100, height: 80 });
    const img = w.find('img');
    expect(img.attributes('width')).toBe('100');
    expect(img.attributes('height')).toBe('80');
    expect(img.attributes('style')).toContain('object-fit: fill');
  });

  it('accepts string dimensions and a custom object-fit', () => {
    const w = mountImage({ src: PNG_1PX, width: '10rem', objectFit: 'cover' });
    expect(w.find('img').attributes('width')).toBe('10rem');
    expect(w.find('img').attributes('style')).toContain('object-fit: cover');
  });

  it('marks preview-disabled images (and errored images) with the modifier class', async () => {
    const w = mountImage({ src: PNG_1PX, previewDisabled: true });
    expect(w.find('.sn-image--preview-disabled').exists()).toBe(true);
    const err = mountImage({ src: 'not-a-url', fallbackSrc: PNG_1PX });
    err.find('img').trigger('error');
    await err.vm.$nextTick();
    expect(err.find('.sn-image--preview-disabled').exists()).toBe(true);
  });

  it('merges img-props onto the img and keeps owned attributes authoritative', () => {
    const w = mountImage({
      src: PNG_1PX,
      alt: 'wins',
      width: 100,
      imgProps: { alt: 'loses', width: 999, class: 'thumb', 'data-track': 'x' },
    });
    const img = w.find('img');
    expect(img.attributes('alt')).toBe('wins');
    expect(img.attributes('width')).toBe('100');
    expect(img.classes()).toContain('thumb');
    expect(img.attributes('data-track')).toBe('x');
  });

  it('emits load and error events', async () => {
    const w = mountImage({ src: PNG_1PX });
    await w.find('img').trigger('load');
    expect(w.findComponent(SnImage).emitted('load')).toHaveLength(1);
    await w.find('img').trigger('error');
    expect(w.findComponent(SnImage).emitted('error')).toHaveLength(1);
  });

  it('falls back to fallback-src on error and emits error', async () => {
    const w = mountImage({ src: 'broken-url', fallbackSrc: PNG_1PX });
    await w.find('img').trigger('error');
    const img = w.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(PNG_1PX);
    expect(w.findComponent(SnImage).emitted('error')).toHaveLength(1);
  });

  it('replaces the img with the error slot when provided', async () => {
    const w = mountImage(
      { src: 'broken-url' },
      { error: () => h('div', { class: 'custom-error' }, '加载失败') },
    );
    await w.find('img').trigger('error');
    await w.vm.$nextTick();
    expect(w.find('img').exists()).toBe(false);
    expect(w.find('.custom-error').exists()).toBe(true);
    expect(w.find('.custom-error').text()).toBe('加载失败');
  });

  it('renders the placeholder slot until the image loads', async () => {
    const w = mountImage(
      { src: PNG_1PX },
      { placeholder: () => h('div', { class: 'loading-hint' }, '加载中') },
    );
    expect(w.find('.loading-hint').exists()).toBe(true);
    await w.find('img').trigger('load');
    await w.vm.$nextTick();
    expect(w.find('.loading-hint').exists()).toBe(false);
  });

  it('uses native lazy loading for plain lazy and hides nothing by default', () => {
    const w = mountImage({ src: PNG_1PX, lazy: true });
    expect(w.find('img').attributes('loading')).toBe('lazy');
    const eager = mountImage({ src: PNG_1PX });
    expect(eager.find('img').attributes('loading')).toBe('eager');
  });

  it('defers the src until the IntersectionObserver reports visibility', async () => {
    stubIntersectionObserver();
    const w = mountImage({
      src: PNG_1PX,
      lazy: true,
      intersectionObserverOptions: { root: '#scroll-container' },
    });
    const img = w.find('img');
    expect(img.attributes('loading')).toBe('eager'); // observer mode, not native
    expect(img.attributes('src')).toBeUndefined();
  });
});

describe('SnImage preview (standalone)', () => {
  it('opens the teleported overlay with the toolbar on thumbnail click', async () => {
    const w = mountImage({ src: PNG_1PX, previewSrc: 'https://example.com/large.png' });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    const overlay = previewRoot();
    expect(overlay).not.toBeNull();
    expect(previewImg()?.getAttribute('src')).toBe('https://example.com/large.png');
    // Standalone: no prev/next, but rotate ×2, 1:1, zoom ×2, download, close.
    const labels = Array.from(overlay!.querySelectorAll('button')).map((b) =>
      b.getAttribute('aria-label'),
    );
    expect(labels).toEqual([
      '向左旋转',
      '向右旋转',
      '原始尺寸',
      '缩小',
      '放大',
      '下载图片',
      '关闭',
    ]);
    // Body scroll is locked while shown and restored on close.
    expect(document.documentElement.style.overflow).toBe('hidden');
    await overlay!
      .querySelector('button[aria-label="关闭"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    expect(previewRoot()).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('does not open the preview when preview-disabled or after an error', async () => {
    const disabled = mountImage({ src: PNG_1PX, previewDisabled: true });
    await disabled.find('img').trigger('click');
    await disabled.vm.$nextTick();
    expect(previewRoot()).toBeNull();

    const errored = mountImage({ src: 'broken', fallbackSrc: PNG_1PX });
    await errored.find('img').trigger('error');
    await errored.find('img').trigger('click');
    await errored.vm.$nextTick();
    expect(previewRoot()).toBeNull();
  });

  it('closes on mask click and on Escape, and blocks body scroll meanwhile', async () => {
    const w = mountImage({ src: PNG_1PX });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    expect(previewRoot()).not.toBeNull();
    document
      .querySelector('.sn-image-preview__overlay')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    expect(previewRoot()).toBeNull();

    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await w.vm.$nextTick();
    expect(previewRoot()).toBeNull();
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('zooms via toolbar and arrow keys, 1:1 restores original size, rotate works', async () => {
    const w = mountImage({ src: PNG_1PX });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    const img = previewImg()!;
    expect(img.style.transform).toContain('scale(1)');

    document
      .querySelector('button[aria-label="放大"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('scale(1.5)');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('scale(2.25)');

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('scale(1.5)');

    document
      .querySelector('button[aria-label="原始尺寸"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('scale(1)');

    document
      .querySelector('button[aria-label="向右旋转"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('rotate(90deg)');

    document
      .querySelector('button[aria-label="向左旋转"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('rotate(0deg)');
  });

  it('zooms with the mouse wheel and pans with the mouse, springing back on release', async () => {
    const w = mountImage({ src: PNG_1PX });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    const root = previewRoot()!;
    root.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, bubbles: true, cancelable: true }));
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('scale(1.5)');

    const img = previewImg()!;
    img.dispatchEvent(
      new MouseEvent('mousedown', { button: 0, clientX: 20, clientY: 10, bubbles: true }),
    );
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 60, clientY: 40, bubbles: true }),
    );
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('translateX(40px)');
    expect(previewImg()!.style.transform).toContain('translateY(30px)');
    expect(previewImg()!.style.transition).toBe('none');

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 60, clientY: 40, bubbles: true }));
    await w.vm.$nextTick();
    // Default keepDragOffset=false → the image springs back (fits the viewport).
    expect(previewImg()!.style.transform).toContain('translateX(0px)');
  });

  it('keeps the dragged offset when keep-drag-offset is set', async () => {
    const w = mountImage({ src: PNG_1PX, keepDragOffset: true });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    previewImg()!.dispatchEvent(
      new MouseEvent('mousedown', { button: 0, clientX: 0, clientY: 0, bubbles: true }),
    );
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 15, clientY: 5, bubbles: true }));
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 15, clientY: 5, bubbles: true }));
    await w.vm.$nextTick();
    expect(previewImg()!.style.transform).toContain('translateX(15px)');
    expect(previewImg()!.style.transform).toContain('translateY(5px)');
  });

  it('toggles original-size scale on double click and downloads via the toolbar', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const w = mountImage({ src: PNG_1PX });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    const img = previewImg()!;
    img.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    await w.vm.$nextTick();
    // happy-dom naturalWidth/Height are 0 → original scale is 1 (no change).
    expect(previewImg()!.style.transform).toContain('scale(1)');

    document
      .querySelector('button[aria-label="下载图片"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(document.body.querySelectorAll('a[download]')).toHaveLength(0);
  });

  it('hides the toolbar when show-toolbar is false', async () => {
    const w = mountImage({ src: PNG_1PX, showToolbar: false });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    expect(previewRoot()).not.toBeNull();
    expect(document.querySelector('.sn-image-preview__toolbar')).toBeNull();
  });

  it('exposes title hints on toolbar buttons when show-toolbar-tooltip is set', async () => {
    const w = mountImage({ src: PNG_1PX, showToolbarTooltip: true });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    expect(document.querySelector('button[aria-label="放大"]')!.getAttribute('title')).toBe('放大');
  });

  it('opens the preview programmatically through the exposed showPreview method', async () => {
    let imageInstance: { showPreview: () => void } | null = null;
    const w = mount(
      defineComponent({
        components: { SnImage },
        setup() {
          return () =>
            h(SnImage, {
              src: PNG_1PX,
              ref: (el: unknown) => {
                imageInstance = el as { showPreview: () => void } | null;
              },
            } as never);
        },
      }),
    );
    mountedWrappers.push(w);
    imageInstance!.showPreview();
    await w.vm.$nextTick();
    expect(previewRoot()).not.toBeNull();
  });

  it('renders a custom toolbar through render-toolbar', async () => {
    const w = mountImage({
      src: PNG_1PX,
      renderToolbar: ({ nodes }: { nodes: Record<string, unknown> }) =>
        h('div', { class: 'custom-toolbar' }, [nodes.close, nodes.zoomIn]),
    });
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    const custom = document.querySelector('.sn-image-preview__toolbar .custom-toolbar');
    expect(custom).not.toBeNull();
    const labels = Array.from(custom!.querySelectorAll('button')).map((b) =>
      b.getAttribute('aria-label'),
    );
    expect(labels).toEqual(['关闭', '放大']);
  });
});

describe('SnImageGroup (AUI-WEB-DD-010)', () => {
  it('registers member images and opens the shared preview at the clicked index', async () => {
    const w = mountGroup([
      { src: 'https://example.com/a.png' },
      { src: 'https://example.com/b.png' },
    ]);
    const imgs = w.findAll('img');
    expect(imgs).toHaveLength(2);
    await imgs[0]!.trigger('click');
    await w.vm.$nextTick();
    expect(previewImg()?.getAttribute('src')).toBe('https://example.com/a.png');
    // Group preview offers prev/next too.
    expect(document.querySelector('button[aria-label="上一张"]')).not.toBeNull();
    expect(document.querySelector('button[aria-label="下一张"]')).not.toBeNull();
  });

  it('switches images with next/prev (wrap-around) emitting update:current', async () => {
    const w = mountGroup([
      { src: 'https://example.com/a.png' },
      { src: 'https://example.com/b.png' },
    ]);
    await w.findAll('img')[1]!.trigger('click');
    await w.vm.$nextTick();
    expect(previewImg()?.getAttribute('src')).toBe('https://example.com/b.png');

    document
      .querySelector('button[aria-label="下一张"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    // open() already emitted current=1; the wrap-around click emits 0.
    const currentEmissions = w.findComponent(SnImageGroup).emitted('update:current')!;
    expect(currentEmissions[currentEmissions.length - 1]?.[0]).toBe(0);
    expect(previewImg()?.getAttribute('src')).toBe('https://example.com/a.png');
    expect(w.findComponent(SnImageGroup).emitted('preview-next')).toHaveLength(1);

    document
      .querySelector('button[aria-label="上一张"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    expect(currentEmissions[currentEmissions.length - 1]?.[0]).toBe(1);
    expect(w.findComponent(SnImageGroup).emitted('preview-prev')).toHaveLength(1);
  });

  it('notifies update:show when the shared preview closes', async () => {
    const w = mountGroup([{ src: 'https://example.com/a.png' }]);
    await w.findAll('img')[0]!.trigger('click');
    await w.vm.$nextTick();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await w.vm.$nextTick();
    // open() emitted true first; the Escape close emits false.
    const showEmissions = w.findComponent(SnImageGroup).emitted('update:show')!;
    expect(showEmissions[showEmissions.length - 1]?.[0]).toBe(false);
    expect(previewRoot()).toBeNull();
  });

  it('previews a srcList without member images and supports controlled show', async () => {
    const w = mountGroup([], {
      srcList: ['https://example.com/x.png', 'https://example.com/y.png'],
      show: true,
      defaultCurrent: 1,
    });
    await w.vm.$nextTick();
    expect(previewImg()?.getAttribute('src')).toBe('https://example.com/y.png');

    document
      .querySelector('button[aria-label="下一张"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await w.vm.$nextTick();
    // Controlled `show` stays open; current wraps 1 → 0.
    expect(w.findComponent(SnImageGroup).emitted('update:current')?.[0]?.[0]).toBe(0);
    expect(previewImg()?.getAttribute('src')).toBe('https://example.com/x.png');
    expect(previewRoot()).not.toBeNull();
  });

  it('unregisters members on unmount so the shared preview goes quiet', async () => {
    const w = mountGroup([
      { src: 'https://example.com/a.png' },
      { src: 'https://example.com/b.png' },
    ]);
    await w.findAll('img')[0]!.trigger('click');
    await w.vm.$nextTick();
    expect(previewRoot()).not.toBeNull();
    w.unmount();
    expect(previewRoot()).toBeNull();
  });
});

describe('SnImage lazy loading with IntersectionObserver', () => {
  it('starts loading when the observed element intersects', async () => {
    const controllers = stubIntersectionObserver();
    const w = mountImage({
      src: PNG_1PX,
      lazy: true,
      intersectionObserverOptions: { root: null, rootMargin: '10px', threshold: 0.1 },
    });
    expect(w.find('img').attributes('src')).toBeUndefined();
    // Fire the intersection entry captured at observe() time.
    const controller = controllers[controllers.length - 1]!;
    controller.fire(true);
    await w.vm.$nextTick();
    expect(w.find('img').attributes('src')).toBe(PNG_1PX);
  });
});

describe('SnImage preview with a placeholder visible', () => {
  it('keeps the placeholder until load even when the preview opens', async () => {
    const w = mountImage(
      { src: PNG_1PX },
      { placeholder: () => h('div', { class: 'loading-hint' }, '加载中') },
    );
    expect(w.find('.loading-hint').exists()).toBe(true);
    await w.find('img').trigger('click');
    await w.vm.$nextTick();
    expect(previewRoot()).not.toBeNull();
    expect(w.find('.loading-hint').exists()).toBe(true);
  });
});
