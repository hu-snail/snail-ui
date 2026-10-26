import { describe, expect, it } from 'vitest';
import { ean13CheckDigit, encodeEan13 } from './sn-barcode-types';

describe('ean13CheckDigit', () => {
  it('should compute the standard check digit', () => {
    // 5901234123457 是标准 EAN-13 示例码，校验位为 7。
    expect(ean13CheckDigit('590123412345')).toBe(7);
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

  it('should accept a valid 13-digit input and reject a wrong checksum', () => {
    expect(encodeEan13('5901234123457').error).toBeUndefined();
    const bad = encodeEan13('5901234123458');
    expect(bad.error?.code).toBe('BARCODE_CHECKSUM_INVALID');
    expect(bad.encoded).toBeUndefined();
  });

  it('should reject non-numeric or wrong-length input', () => {
    expect(encodeEan13('abc').error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeEan13('12345').error?.code).toBe('BARCODE_TEXT_INVALID');
  });
});
