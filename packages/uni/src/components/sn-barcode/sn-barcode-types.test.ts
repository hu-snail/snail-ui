import { describe, expect, it } from 'vitest';
import { ean13CheckDigit, encodeEan13 } from './sn-barcode-types';

describe('ean13CheckDigit', () => {
  it('should compute the standard check digit', () => {
    // 5901234123457 是标准 EAN-13 示例码，校验位为 7。
    expect(ean13CheckDigit('590123412345')).toBe(7);
  });

  it('should compute the check digit for a second reference code', () => {
    // 4006381333931 是 EAN-13 规范中的公开示例码，校验位为 1。
    expect(ean13CheckDigit('400638133393')).toBe(1);
    expect(ean13CheckDigit('4006381333931'.slice(0, 12))).toBe(1);
  });
});

describe('encodeEan13', () => {
  it('should append the check digit for a 12-digit input', () => {
    const { encoded, error } = encodeEan13('590123412345');
    expect(error).toBeUndefined();
    expect(encoded?.displayText).toBe('5901234123457');
  });

  it('should produce 95 modules starting with the 101 guard (1-1-1 narrow runs)', () => {
    const { encoded } = encodeEan13('5901234123457');
    const total = encoded!.runs.reduce((sum, run) => sum + run.modules, 0);
    expect(total).toBe(95);
    expect(encoded!.runs.slice(0, 3)).toEqual([
      { modules: 1, bar: true },
      { modules: 1, bar: false },
      { modules: 1, bar: true },
    ]);
  });

  it('should produce a structurally valid symbol: guards, centre bars, strictly alternating runs', () => {
    const { encoded, error } = encodeEan13('400638133393');
    expect(error).toBeUndefined();
    const bits = encoded!.runs
      .map((run) => (run.bar ? '1'.repeat(run.modules) : '0'.repeat(run.modules)))
      .join('');
    expect(bits).toHaveLength(95);
    expect(bits.startsWith('101')).toBe(true);
    expect(bits.endsWith('101')).toBe(true);
    // 左侧 6 位（42 模块）之后是中间警戒条 01010。
    expect(bits.slice(45, 50)).toBe('01010');
    // 条/空必须严格交替，首尾游程恒为条。
    encoded!.runs.forEach((run, i) => {
      expect(run.bar, `run ${i}`).toBe(i % 2 === 0);
    });
  });

  it('should encode the left half with the parity template of the leading digit (0 → all L codes)', () => {
    // 首位 0 → 奇偶模板 LLLLLL；数字 0 的 L 码为标准 0001101。
    const { encoded } = encodeEan13('000000056789');
    const bits = encoded!.runs
      .map((run) => (run.bar ? '1'.repeat(run.modules) : '0'.repeat(run.modules)))
      .join('');
    expect(bits.slice(3, 45)).toBe('0001101'.repeat(6));
  });

  it('should mix G codes following the parity template (1 → LLGLGG)', () => {
    // 首位 1 → 模板 L,L,G,L,G,G；数字 0 的 L 码 0001101、G 码 0100111（标准表）。
    const { encoded } = encodeEan13('100000056789');
    const bits = encoded!.runs
      .map((run) => (run.bar ? '1'.repeat(run.modules) : '0'.repeat(run.modules)))
      .join('');
    expect(bits.slice(3, 45)).toBe(
      '0001101' + '0001101' + '0100111' + '0001101' + '0100111' + '0100111',
    );
  });

  it('should accept a valid 13-digit input and reject a wrong checksum', () => {
    expect(encodeEan13('5901234123457').error).toBeUndefined();
    const bad = encodeEan13('5901234123458');
    expect(bad.error?.code).toBe('BARCODE_CHECKSUM_INVALID');
    expect(bad.encoded).toBeUndefined();
  });

  it('should reject non-numeric or wrong-length input', () => {
    expect(encodeEan13('abc').error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeEan13('12345').error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeEan13('12345678901').error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeEan13('1234567890123 4').error?.code).toBe('BARCODE_TEXT_INVALID');
  });

  it('should accept 12 or 13 digits and reject 11 or 14', () => {
    expect(encodeEan13('123456789012').error).toBeUndefined();
    expect(encodeEan13('1234567890123').error?.code).toBe('BARCODE_CHECKSUM_INVALID');
    expect(encodeEan13('12345678901').error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeEan13('12345678901234').error?.code).toBe('BARCODE_TEXT_INVALID');
  });

  it('should ignore surrounding whitespace', () => {
    const { encoded, error } = encodeEan13('  590123412345  ');
    expect(error).toBeUndefined();
    expect(encoded?.displayText).toBe('5901234123457');
  });
});
