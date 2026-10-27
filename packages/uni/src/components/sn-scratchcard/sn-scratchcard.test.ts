import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import SnScratchcard from './sn-scratchcard.vue';

describe('SnScratchcard', () => {
  it('should render slot content under the cover', () => {
    const wrapper = mount(SnScratchcard, {
      slots: { default: '<view class="prize">恭喜中奖</view>' },
    });
    expect(wrapper.find('.prize').exists()).toBe(true);
  });

  it('should degrade to tap-to-reveal when no element canvas exists', async () => {
    const wrapper = mount(SnScratchcard, { props: { title: '刮一刮' } });
    await wrapper.vm.$nextTick();
    // happy-dom 的 canvas 无 2d 上下文 → 显式降级为点按揭示。
    expect(wrapper.find('.sn-scratchcard__cover').exists()).toBe(true);
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.find('.sn-scratchcard__cover--revealed').exists()).toBe(true);
  });

  it('should not re-emit open after already revealed', async () => {
    const wrapper = mount(SnScratchcard);
    await wrapper.vm.$nextTick();
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    expect(wrapper.emitted('open')).toHaveLength(1);
  });

  it('should re-hide the cover after reset()', async () => {
    const wrapper = mount(SnScratchcard);
    await wrapper.vm.$nextTick();
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    (wrapper.vm as unknown as { reset: () => void }).reset();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-scratchcard__cover--revealed').exists()).toBe(false);
  });
});

describe('SnScratchcard degraded cover contract', () => {
  it('should render no canvas in the tap-to-reveal degradation', async () => {
    const wrapper = mount(SnScratchcard);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('canvas').exists()).toBe(false);
    expect(wrapper.find('.sn-scratchcard__cover').exists()).toBe(true);
  });

  it('should label the region with the title, falling back to a generic label', () => {
    expect(mount(SnScratchcard, { props: { title: '刮我' } }).attributes('aria-label')).toBe(
      '刮我',
    );
    expect(mount(SnScratchcard).attributes('aria-label')).toBe('scratchcard');
  });

  it('should show the default scratch hint when no title is given', async () => {
    const wrapper = mount(SnScratchcard);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.sn-scratchcard__cover-title').text()).toBe('刮一刮');
  });

  it('should paint the cover with coverColor and the title typography', async () => {
    const wrapper = mount(SnScratchcard, {
      props: {
        title: '刮我',
        coverColor: '#abcdef',
        titleColor: '#123456',
        titleSize: 18,
      },
    });
    await wrapper.vm.$nextTick();
    const cover = wrapper.find('.sn-scratchcard__cover');
    expect(cover.attributes('style')).toContain('background-color: #abcdef');
    const title = wrapper.find('.sn-scratchcard__cover-title');
    expect(title.attributes('style')).toContain('color: #123456');
    expect(title.attributes('style')).toContain('font-size: 18px');
  });

  it('should disable the pressed hover state once opened', async () => {
    const wrapper = mount(SnScratchcard);
    await wrapper.vm.$nextTick();
    const cover = wrapper.find('.sn-scratchcard__cover');
    expect(cover.attributes('hover-class')).toBe('sn-scratchcard__cover--down');
    await cover.trigger('tap');
    expect(cover.attributes('hover-class')).toBe('none');
  });

  it('should forward customClass to the root', () => {
    const wrapper = mount(SnScratchcard, { props: { customClass: 'my-card' } });
    expect(wrapper.classes()).toContain('my-card');
  });

  it('should forward customStyle (width / height) to the root', () => {
    const wrapper = mount(SnScratchcard, { props: { customStyle: 'width: 300px; height: 150px' } });
    expect(wrapper.attributes('style')).toContain('width: 300px');
    expect(wrapper.attributes('style')).toContain('height: 150px');
  });
});

/**
 * The real-scratch path needs an element canvas with a measurable box and a
 * 2d context — happy-dom offers neither by default. Stub the canvas
 * prototype so the component takes the real branch, and record every 2d
 * call for assertions. Only the degradation contract above is exercised in
 * plain happy-dom.
 *
 * Untestable in happy-dom: actual bitmap pixel output of the canvas —
 * happy-dom paints nothing; we assert the drawing command sequence instead.
 */
describe('SnScratchcard real scratch path', () => {
  interface Call {
    op: string;
    args: unknown[];
  }
  let calls: Call[] = [];
  let stub: Record<string, unknown>;

  function record(op: string): (...args: unknown[]) => void {
    return (...args: unknown[]) => {
      calls.push({ op, args });
    };
  }

  beforeEach(() => {
    calls = [];
    stub = {
      scale: record('scale'),
      fillRect: record('fillRect'),
      fillText: record('fillText'),
      save: record('save'),
      restore: record('restore'),
      beginPath: record('beginPath'),
      arc: record('arc'),
      fill: record('fill'),
      moveTo: record('moveTo'),
      lineTo: record('lineTo'),
      stroke: record('stroke'),
      clearRect: record('clearRect'),
      drawImage: record('drawImage'),
      getImageData: vi.fn(() => undefined),
      createImage: vi.fn(() => undefined),
      fillStyle: '',
      font: '',
      textAlign: '',
      textBaseline: '',
      lineWidth: 0,
      lineCap: '',
      lineJoin: '',
      globalCompositeOperation: '',
    };
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      stub as unknown as CanvasRenderingContext2D,
    );
    Object.defineProperty(HTMLCanvasElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 300,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'offsetHeight', {
      configurable: true,
      get: () => 150,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({ left: 10, top: 20 }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLCanvasElement.prototype as { offsetWidth?: unknown }).offsetWidth;
    delete (HTMLCanvasElement.prototype as { offsetHeight?: unknown }).offsetHeight;
    delete (HTMLCanvasElement.prototype as { getBoundingClientRect?: unknown })
      .getBoundingClientRect;
    delete (globalThis as { uni?: unknown }).uni;
  });

  it('should take the canvas branch and paint the cover rectangle on mount', () => {
    const wrapper = mount(SnScratchcard, { props: { coverColor: '#c0c0c0' } });
    expect(wrapper.find('canvas').exists()).toBe(true);
    expect(wrapper.find('.sn-scratchcard__cover').exists()).toBe(false);
    expect(stub.fillStyle).toBe('#c0c0c0');
    expect(calls).toContainEqual({ op: 'fillRect', args: [0, 0, 300, 150] });
  });

  it('should size the bitmap by the element box times the device pixel ratio', () => {
    (globalThis as { uni?: unknown }).uni = {
      getDeviceInfo: () => ({ devicePixelRatio: 2 }),
    };
    const wrapper = mount(SnScratchcard);
    const canvas = wrapper.find('canvas').element as HTMLCanvasElement;
    expect(canvas.width).toBe(600);
    expect(canvas.height).toBe(300);
    expect(calls).toContainEqual({ op: 'scale', args: [2, 2] });
  });

  it('should tile the watermark text under the cover', () => {
    mount(SnScratchcard, { props: { watermarkText: 'W', watermarkSize: 12 } });
    const watermarkCalls = calls.filter((c) => c.op === 'fillText' && c.args[0] === 'W');
    expect(watermarkCalls.length).toBeGreaterThan(0);
    expect(stub.font).toBe('12px sans-serif');
  });

  it('should paint the centered title with a bold face', () => {
    mount(SnScratchcard, { props: { title: '刮我', titleSize: 20 } });
    expect(calls).toContainEqual({ op: 'fillText', args: ['刮我', 150, 75] });
    expect(stub.font).toBe('bold 20px sans-serif');
    expect(stub.textAlign).toBe('center');
  });

  it('should erase strokes with destination-out compositing at the touch point', () => {
    const wrapper = mount(SnScratchcard, { props: { scratchRadius: 8 } });
    const canvas = wrapper.find('canvas');
    canvas.trigger('touchstart', { touches: [{ clientX: 30, clientY: 40 }] });
    canvas.trigger('touchmove', { touches: [{ clientX: 30, clientY: 40 }] });
    // 触摸坐标减去 canvas 视口偏移 (10, 20) → 擦除点 (20, 20)。
    expect(stub.globalCompositeOperation).toBe('destination-out');
    expect(stub.lineWidth).toBe(16);
    expect(stub.lineCap).toBe('round');
    expect(calls).toContainEqual({ op: 'arc', args: [20, 20, 8, 0, Math.PI * 2] });
    expect(calls.some((c) => c.op === 'fill')).toBe(true);
  });

  it('should emit open once the scratched ratio reaches the threshold', async () => {
    const onOpen = vi.fn();
    const wrapper = mount(SnScratchcard, {
      props: { ratio: 0.01, scratchRadius: 10, onOpen },
    });
    const canvas = wrapper.find('canvas');
    canvas.trigger('touchstart', { touches: [{ clientX: 11, clientY: 21 }] });
    canvas.trigger('touchmove', { touches: [{ clientX: 211, clientY: 21 }] });
    canvas.trigger('touchend');
    // 200px × (2×10px) 笔画 / 300×150 画布 ≈ 0.089 ≥ 0.01。
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(calls.some((c) => c.op === 'clearRect')).toBe(true);
    // 已开启后不再响应刮擦。
    const strokes = calls.filter((c) => c.op === 'arc').length;
    canvas.trigger('touchmove', { touches: [{ clientX: 50, clientY: 50 }] });
    canvas.trigger('touchend');
    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(calls.filter((c) => c.op === 'arc').length).toBe(strokes);
  });

  it('should sample alpha from getImageData when the context provides it', () => {
    stub.getImageData = vi.fn(() => {
      const data = new Uint8ClampedArray(64).fill(255);
      data[3] = 0; // 第一个采样点已透明。
      return { data };
    });
    const onOpen = vi.fn();
    const wrapper = mount(SnScratchcard, { props: { ratio: 0.5, onOpen } });
    const canvas = wrapper.find('canvas');
    canvas.trigger('touchstart', { touches: [{ clientX: 11, clientY: 21 }] });
    canvas.trigger('touchmove', { touches: [{ clientX: 21, clientY: 21 }] });
    canvas.trigger('touchend');
    expect(stub.getImageData).toHaveBeenCalledWith(0, 0, 300, 150);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('should repaint the cover after reset() so the card can be scratched again', async () => {
    const onOpen = vi.fn();
    const wrapper = mount(SnScratchcard, { props: { ratio: 0.01, onOpen } });
    const canvas = wrapper.find('canvas');
    canvas.trigger('touchstart', { touches: [{ clientX: 11, clientY: 21 }] });
    canvas.trigger('touchmove', { touches: [{ clientX: 211, clientY: 21 }] });
    canvas.trigger('touchend');
    expect(onOpen).toHaveBeenCalledTimes(1);
    (wrapper.vm as unknown as { reset: () => void }).reset();
    await wrapper.vm.$nextTick();
    const fillRects = calls.filter((c) => c.op === 'fillRect').length;
    expect(fillRects).toBe(2);
    // Reset 后可再次刮开。
    canvas.trigger('touchstart', { touches: [{ clientX: 11, clientY: 21 }] });
    canvas.trigger('touchmove', { touches: [{ clientX: 211, clientY: 21 }] });
    canvas.trigger('touchend');
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it('should fall back to painting the color cover when the image fails to load', () => {
    const image = {
      src: '',
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
    };
    stub.createImage = vi.fn(() => image);
    mount(SnScratchcard, { props: { coverImg: 'https://example.com/cover.png' } });
    expect(image.src).toBe('https://example.com/cover.png');
    expect(calls.some((c) => c.op === 'drawImage')).toBe(false);
    image.onerror?.();
    expect(calls).toContainEqual({ op: 'fillRect', args: [0, 0, 300, 150] });
  });

  it('should draw the cover image once it loads', () => {
    const image = {
      src: '',
      onload: null as (() => void) | null,
      onerror: null as (() => void) | null,
    };
    stub.createImage = vi.fn(() => image);
    mount(SnScratchcard, { props: { coverImg: 'https://example.com/cover.png' } });
    image.onload?.();
    expect(calls).toContainEqual({
      op: 'drawImage',
      args: [image, 0, 0, 300, 150],
    });
    // 图片封面不走颜色兜底。
    expect(calls.some((c) => c.op === 'fillRect')).toBe(false);
  });
});

describe('SnScratchcard zero-size degradation', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    Object.defineProperty(HTMLCanvasElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 0,
    });
    Object.defineProperty(HTMLCanvasElement.prototype, 'offsetHeight', {
      configurable: true,
      get: () => 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLCanvasElement.prototype as { offsetWidth?: unknown }).offsetWidth;
    delete (HTMLCanvasElement.prototype as { offsetHeight?: unknown }).offsetHeight;
  });

  it('should degrade to tap-to-reveal when the layout box is not measurable yet', async () => {
    const onOpen = vi.fn();
    const wrapper = mount(SnScratchcard, { props: { onOpen } });
    await wrapper.vm.$nextTick();
    // 位图无法定尺寸 → 显式降级（可预期行为），不静默失败。
    expect(wrapper.find('canvas').exists()).toBe(false);
    expect(wrapper.find('.sn-scratchcard__cover').exists()).toBe(true);
    await wrapper.find('.sn-scratchcard__cover').trigger('tap');
    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
