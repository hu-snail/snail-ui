import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import SnQrCode from './SnQrCode.vue';
import { encode, type SnQrMatrix } from './sn-qr-core';

/** Render a matrix as '#'/'.' rows for known-vector comparison. */
function matrixRows(qr: SnQrMatrix): string[] {
  const rows: string[] = [];
  for (let y = 0; y < qr.size; y++) {
    let row = '';
    for (let x = 0; x < qr.size; x++) row += qr.getModule(x, y) ? '#' : '.';
    rows.push(row);
  }
  return rows;
}

/** Full-module equality between two matrices. */
function expectSameModules(a: SnQrMatrix, b: SnQrMatrix): void {
  expect(a.size).toBe(b.size);
  for (let y = 0; y < a.size; y++) {
    for (let x = 0; x < a.size; x++) {
      expect(a.getModule(x, y)).toBe(b.getModule(x, y));
    }
  }
}

/** ISO format bits per EC level (uint2), fixed by the standard. */
const FORMAT_BITS = { L: 1, M: 0, Q: 3, H: 2 } as const;

/** Read the first (top-left) 15-bit format-info copy out of the grid. */
function readFormatBits(qr: SnQrMatrix): number {
  const bits: boolean[] = new Array<boolean>(15).fill(false);
  for (let i = 0; i <= 5; i++) bits[i] = qr.getModule(8, i);
  bits[6] = qr.getModule(8, 7);
  bits[7] = qr.getModule(8, 8);
  bits[8] = qr.getModule(7, 8);
  for (let i = 9; i < 15; i++) bits[i] = qr.getModule(14 - i, 8);
  let value = 0;
  for (let i = 0; i < 15; i++) if (bits[i]) value |= 1 << i;
  return value;
}

/** Read the non-mirrored 18-bit version-info copy (version ≥ 7). */
function readVersionBits(qr: SnQrMatrix): number {
  let value = 0;
  for (let i = 0; i < 18; i++) {
    const a = qr.size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    if (qr.getModule(a, b)) value |= 1 << i;
  }
  return value;
}

/** Assert a 5×5 alignment pattern centered at (cx, cy). */
function expectAlignmentPattern(qr: SnQrMatrix, cx: number, cy: number): void {
  expect(qr.getModule(cx, cy)).toBe(true); // dark center
  expect(qr.getModule(cx - 1, cy)).toBe(false); // light ring
  expect(qr.getModule(cx - 2, cy)).toBe(true); // dark corners
  expect(qr.getModule(cx - 2, cy - 2)).toBe(true);
  expect(qr.getModule(cx + 2, cy + 2)).toBe(true);
}

/** Assert the 7×7 finder pattern + separators centered at (cx, cy). */
function expectFinderPattern(qr: SnQrMatrix, cx: number, cy: number): void {
  for (let dy = -3; dy <= 3; dy++) {
    for (let dx = -3; dx <= 3; dx++) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      // Dark border + core, light ring, exactly as ISO draws finders.
      expect(qr.getModule(cx + dx, cy + dy)).toBe(dist !== 2 && dist !== 4);
    }
  }
  // Separator ring (dist 4) is light where it falls inside the grid.
  expect(qr.getModule(cx + 4, cy)).toBe(false);
  expect(qr.getModule(cx, cy + 4)).toBe(false);
}

/** Mount SnQrCode through a wrapper component, mirroring real usage. */
function mountQr(props: Record<string, unknown> = {}) {
  return mount(
    defineComponent({
      components: { SnQrCode },
      setup() {
        return () => h(SnQrCode, props as never);
      },
    }),
  );
}

describe('sn-qr-core', () => {
  describe('encode', () => {
    it('should produce identical output for identical input', () => {
      const a = encode('Hello, snail-aui!', 'M');
      const b = encode('Hello, snail-aui!', 'M');
      expect(a.version).toBe(b.version);
      expect(a.mask).toBe(b.mask);
      expectSameModules(a, b);
    });

    it('should match the known vector for byte-mode "hello" (version 1)', () => {
      // Known vector captured from the verified run against the ISO
      // algorithm implementation the reference library vendors (byte-mode
      // segment; "hello" is 5 bytes so the EC level boosts L→…→H at v1).
      const qr = encode('hello', 'M');
      expect(qr.version).toBe(1);
      expect(qr.mask).toBe(6);
      expect(qr.size).toBe(21);
      expect(matrixRows(qr)).toEqual([
        '#######.....#.#######',
        '#.....#.......#.....#',
        '#.###.#.##.#..#.###.#',
        '#.###.#.#.#...#.###.#',
        '#.###.#...###.#.###.#',
        '#.....#...#...#.....#',
        '#######.#.#.#.#######',
        '.........###.........',
        '...##.##.###.....##..',
        '#.#..#.#.##...#####..',
        '##.#.##.##.#.#.#..###',
        '##..##.#.#..##.##.#..',
        '.#..#####.....####.#.',
        '........#.#.###..#.#.',
        '#######.#.#...#...#..',
        '#.....#..###.#...####',
        '#.###.#.#.#.#...##.##',
        '#.###.#.#.####..#....',
        '#.###.#...##.########',
        '#.....#..############',
        '#######...#..#.......',
      ]);
    });

    it('should match the known vector for a version-2 url payload', () => {
      const qr = encode('https://snail.aui/qr', 'M');
      expect(qr.version).toBe(2);
      expect(qr.mask).toBe(4);
      expect(qr.size).toBe(25);
      expect(matrixRows(qr)).toEqual([
        '#######.......##..#######',
        '#.....#.....#...#.#.....#',
        '#.###.#.##.#..###.#.###.#',
        '#.###.#...#####.#.#.###.#',
        '#.###.#.######.##.#.###.#',
        '#.....#.#.#..##.#.#.....#',
        '#######.#.#.#.#.#.#######',
        '.........#.#..##.........',
        '.#..#.#.###.....##.##.#..',
        '.#####.###.###.##...##.#.',
        '.#.##.###..###.#..#####..',
        '.###.....##....####...##.',
        '.#.#.#####..###..##..####',
        '##.###.#.##.#####...#..#.',
        '..##..##..#.#..###.####..',
        '..#..#.#.##..#.....##.##.',
        '####.##.#.##...########..',
        '........#.#...#.#...#....',
        '#######..#..#...#.#.#....',
        '#.....#..#.###.##...####.',
        '#.###.#.#.....#.#########',
        '#.###.#..##.#.#..###..###',
        '#.###.#..####.#..##..#.#.',
        '#.....#.#.....##.#######.',
        '#######..##.####.##...###',
      ]);
    });

    it('should draw finder patterns at the three non-bottom-right corners', () => {
      for (const text of ['中', 'a'.repeat(18), 'a'.repeat(200)]) {
        const qr = encode(text, 'H');
        expect(qr.size).toBe(qr.version * 4 + 17);
        expectFinderPattern(qr, 3, 3);
        expectFinderPattern(qr, qr.size - 4, 3);
        expectFinderPattern(qr, 3, qr.size - 4);
      }
    });

    it('should alternate the timing patterns on row/column 6', () => {
      const qr = encode('https://snail.aui/qr', 'M');
      // Between the two finder patterns (x = 8 … size-9) the timing row and
      // column strictly alternate dark/even, light/odd.
      for (let i = 8; i <= qr.size - 9; i++) {
        expect(qr.getModule(i, 6)).toBe(i % 2 === 0);
        expect(qr.getModule(6, i)).toBe(i % 2 === 0);
      }
    });

    it('should draw alignment patterns per the version coordinate table', () => {
      // ISO: alignment patterns share the finder corner coordinates and the
      // three corner combinations are never drawn. Version 2 has positions
      // [6,18] where 6 and 18 are both finder corners → only (18,18).
      const v2 = encode('https://snail.aui/qr', 'M');
      expect(v2.version).toBe(2);
      expectAlignmentPattern(v2, 18, 18);
      // Version 7 has positions [6,22,38] → six patterns besides the corners.
      const v7 = encode('a'.repeat(80), 'Q');
      expect(v7.version).toBe(7);
      expectAlignmentPattern(v7, 22, 22);
      expectAlignmentPattern(v7, 6, 22);
      expectAlignmentPattern(v7, 22, 38);
    });

    it('should encode EC level and mask into both format-info copies', () => {
      // boostEcl disabled keeps the requested level, so the format payload
      // is exactly (formatBits << 3) | mask for every requested level.
      for (const ecl of ['L', 'M', 'Q', 'H'] as const) {
        for (let mask = 0; mask < 8; mask++) {
          const qr = encode('format-info', ecl, { mask, boostEcl: false });
          const first = readFormatBits(qr);
          const payload = first ^ 0x5412;
          // BCH(15,5) remainder over the generator 0x537 must vanish.
          let rem = payload;
          for (let i = 14; i >= 10; i--) {
            if ((rem >>> i) & 1) rem ^= 0x537 << (i - 10);
          }
          expect(rem).toBe(0);
          expect(payload >> 10).toBe((FORMAT_BITS[ecl] << 3) | mask);
          // Second copy around the bottom-left finder must match.
          const secondBits: boolean[] = [];
          for (let i = 0; i < 8; i++) secondBits.push(qr.getModule(qr.size - 1 - i, 8));
          for (let i = 8; i < 15; i++) secondBits.push(qr.getModule(8, qr.size - 15 + i));
          let secondValue = 0;
          for (let i = 0; i < 15; i++) if (secondBits[i]) secondValue |= 1 << i;
          expect(secondValue).toBe(first);
          expect(qr.getModule(8, qr.size - 8)).toBe(true); // always-dark module
        }
      }
    });

    it('should encode version info with valid BCH(18,6) for version ≥ 7', () => {
      const qr = encode('a'.repeat(200), 'H'); // version 15
      expect(qr.version).toBeGreaterThanOrEqual(7);
      const value = readVersionBits(qr);
      expect(value >> 12).toBe(qr.version);
      let rem = value;
      for (let i = 17; i >= 12; i--) {
        if ((rem >>> i) & 1) rem ^= 0x1f25 << (i - 12);
      }
      expect(rem).toBe(0);
      // Mirrored copy at the transposed coordinates must be identical.
      let mirrored = 0;
      for (let i = 0; i < 18; i++) {
        const a = qr.size - 11 + (i % 3);
        const b = Math.floor(i / 3);
        if (qr.getModule(b, a)) mirrored |= 1 << i;
      }
      expect(mirrored).toBe(value);
    });

    it('should upgrade the version when the payload outgrows the current one', () => {
      // boostEcl disabled keeps the requested level so the byte-capacity
      // boundaries are pure: v1-L holds 17 bytes, v2-L 32, v3-L 40+.
      expect(encode('a'.repeat(17), 'L', { boostEcl: false }).version).toBe(1);
      expect(encode('a'.repeat(18), 'L', { boostEcl: false }).version).toBe(2);
      expect(encode('a'.repeat(32), 'L', { boostEcl: false }).version).toBe(2);
      expect(encode('a'.repeat(33), 'L', { boostEcl: false }).version).toBe(3);
      expect(encode('a'.repeat(17), 'L', { boostEcl: false }).size).toBe(21);
      expect(encode('a'.repeat(18), 'L', { boostEcl: false }).size).toBe(25);
    });

    it('should boost the EC level while the version stays unchanged', () => {
      // 10 bytes = 92 bits: fits v1-M/Q (112/104) but not v1-H (72) → Q.
      const qr = encode('a'.repeat(10), 'L');
      expect(qr.version).toBe(1);
      const payload = readFormatBits(qr) ^ 0x5412;
      // payload = ((formatBits << 3) | mask) << 10 — level lives in bits 13+.
      expect((payload >> 13) & 0b11).toBe(FORMAT_BITS.Q);
      // 17 bytes = 148 bits: exceeds every v1 capacity above L → stays L.
      const noBoost = encode('a'.repeat(17), 'L');
      expect(((readFormatBits(noBoost) ^ 0x5412) >> 13) & 0b11).toBe(FORMAT_BITS.L);
    });

    it('should treat UTF-8 input as multi-byte byte-mode data', () => {
      const qr = encode('中', 'M'); // 3 UTF-8 bytes → 36 bits → fits version 1
      expect(qr.version).toBe(1);
      expect(qr.size).toBe(21);
      const emoji = encode('😀', 'M'); // 4 UTF-8 bytes
      expect(emoji.version).toBe(1);
      // Same text encoded twice stays deterministic; different text differs.
      expectSameModules(encode('中文测试文本', 'M'), encode('中文测试文本', 'M'));
      expect(matrixRows(encode('中', 'M'))).not.toEqual(matrixRows(encode('中文', 'M')));
    });

    it('should pick an automatic mask within 0-7 and honor forced masks', () => {
      const texts = ['hello', 'https://snail.aui/qr', '犹如一位幽默风趣的魔术师', 'a'.repeat(80)];
      for (const text of texts) {
        for (const ecl of ['L', 'M', 'Q', 'H'] as const) {
          const auto = encode(text, ecl);
          expect(auto.mask).toBeGreaterThanOrEqual(0);
          expect(auto.mask).toBeLessThanOrEqual(7);
          for (let mask = 0; mask < 8; mask++) {
            const forced = encode(text, ecl, { mask });
            expect(forced.mask).toBe(mask);
          }
        }
      }
    });

    it('should produce different grids for different forced masks', () => {
      const m0 = encode('mask-differs', 'M', { mask: 0 });
      const m1 = encode('mask-differs', 'M', { mask: 1 });
      let differs = false;
      for (let y = 0; y < m0.size && !differs; y++) {
        for (let x = 0; x < m0.size; x++) {
          if (m0.getModule(x, y) !== m1.getModule(x, y)) {
            differs = true;
            break;
          }
        }
      }
      expect(differs).toBe(true);
    });

    it('should fill version 40 at the byte ceiling and throw beyond it', () => {
      expect(encode('x'.repeat(2953), 'L').version).toBe(40);
      expect(encode('x'.repeat(2953), 'L').size).toBe(177);
      expect(() => encode('x'.repeat(2954), 'L')).toThrow(RangeError);
    });

    it('should reject unknown EC levels and out-of-range masks', () => {
      expect(() => encode('x', 'Z' as never)).toThrow(RangeError);
      expect(() => encode('x', 'M', { mask: 8 })).toThrow(RangeError);
      expect(() => encode('x', 'M', { mask: -2 })).toThrow(RangeError);
    });

    it('should encode an empty payload as a zero-segment grid', () => {
      const qr = encode('', 'M');
      expect(qr.version).toBe(1);
      expect(qr.size).toBe(21);
      expectFinderPattern(qr, 3, 3);
    });
  });
});

describe('SnQrCode (AUI-WEB-DD-015)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a canvas with role img and an aria-label carrying the value', () => {
    const w = mountQr({ value: 'https://example.com' });
    const root = w.find('.sn-qr-code');
    expect(root.exists()).toBe(true);
    expect(root.attributes('data-snui-component')).toBe('qr-code');
    const canvas = w.find('canvas');
    expect(canvas.exists()).toBe(true);
    expect(canvas.attributes('role')).toBe('img');
    expect(canvas.attributes('aria-label')).toBe('二维码：https://example.com');
  });

  it('applies size, padding and background via inline style', () => {
    const w = mountQr({ value: 'x', size: 140, padding: 8, backgroundColor: '#F5F5F5' });
    const style = w.find('.sn-qr-code').attributes('style');
    expect(style).toContain('width: 140px');
    expect(style).toContain('height: 140px');
    expect(style).toContain('padding: 8px');
  });

  it('accepts a string padding value', () => {
    const w = mountQr({ padding: '1rem' });
    expect(w.find('.sn-qr-code').attributes('style')).toContain('padding: 1rem');
  });

  it('draws the canvas at devicePixelRatio resolution without crashing when the 2D context is missing', () => {
    // happy-dom's getContext returns null; painting is guarded and the
    // component must still render a correctly sized canvas element.
    const w = mountQr({ value: 'crisp', size: 120 });
    const canvas = w.find('canvas');
    expect(canvas.exists()).toBe(true);
    expect(canvas.attributes('width')).toBe('120');
    expect(canvas.attributes('height')).toBe('120');
    expect(canvas.attributes('style')).toContain('width: 120px');
  });

  it('re-encodes and repaints when the value changes', async () => {
    const w = mountQr({ value: 'first', type: 'svg' });
    const before = w.find('svg path').attributes('d');
    await w.setProps({ value: 'second-value-longer' });
    const after = w.find('svg path').attributes('d');
    expect(after).not.toBe(before);
  });

  it('updates the canvas aria-label when the value changes', async () => {
    const w = mountQr({ value: 'before' });
    await w.setProps({ value: 'after' });
    expect(w.find('canvas').attributes('aria-label')).toBe('二维码：after');
  });

  it('renders an svg with the module path when type is svg', () => {
    const w = mountQr({ value: 'svg-mode', type: 'svg', color: '#18a058' });
    const svg = w.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('role')).toBe('img');
    expect(svg.attributes('viewBox')).toBe('0 0 21 21');
    const path = w.find('svg path');
    expect(path.attributes('fill')).toBe('#18a058');
    expect(path.attributes('d')).toContain('M');
  });

  it('grows the svg viewBox when the payload forces a higher version', () => {
    // 17 ASCII bytes at level H need version 3 → 29×29 modules.
    const w = mountQr({ value: 'a'.repeat(17), errorCorrectionLevel: 'H', type: 'svg' });
    expect(w.find('svg').attributes('viewBox')).toBe('0 0 29 29');
  });

  it('re-encodes when the error correction level changes', async () => {
    const w = mountQr({ value: 'a'.repeat(17), errorCorrectionLevel: 'L', type: 'svg' });
    expect(w.find('svg').attributes('viewBox')).toBe('0 0 21 21');
    await w.setProps({ errorCorrectionLevel: 'H' });
    expect(w.find('svg').attributes('viewBox')).toBe('0 0 29 29');
  });

  it('shows the floating download toolbar by default and hides it on demand', async () => {
    const withToolbar = mountQr({ value: 'x' });
    const button = withToolbar.find('button[aria-label="下载二维码"]');
    expect(button.exists()).toBe(true);
    expect(button.find('svg').exists()).toBe(true);

    const withoutToolbar = mountQr({ value: 'x', showToolbar: false });
    expect(withoutToolbar.find('button[aria-label="下载二维码"]').exists()).toBe(false);
  });

  it('downloads the canvas as png (or svg fallback) through a temporary anchor', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const w = mountQr({ value: 'download-me' });
    await w.find('button[aria-label="下载二维码"]').trigger('click');
    // happy-dom's toDataURL is unavailable → the component degrades to the
    // SVG payload, but the download flow itself must always fire.
    expect(clickSpy).toHaveBeenCalledTimes(1);
    const anchors = document.body.querySelectorAll('a[download]');
    expect(anchors).toHaveLength(0); // the anchor is removed after the click
  });

  it('downloads the svg payload when type is svg', async () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const w = mountQr({ value: 'svg-download', type: 'svg' });
    await w.find('button[aria-label="下载二维码"]').trigger('click');
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});
