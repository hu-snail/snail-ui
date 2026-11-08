import { describe, expect, it } from 'vitest';
import {
  CODE128_BARS,
  eanCheckDigit,
  encodeBarcode,
  encodeCode128,
  encodeCode39,
  encodeCodebar,
  encodeEan13,
  encodeEan8,
  encodeItf,
  encodeUpc,
  type SnBarcodeEncoded,
} from './sn-barcode-types';

/** 将游程序列还原为 01 模块串。 */
function toBits(encoded: SnBarcodeEncoded): string {
  return encoded.runs
    .map((run) => (run.bar ? '1'.repeat(run.modules) : '0'.repeat(run.modules)))
    .join('');
}

describe('eanCheckDigit', () => {
  it('should compute the standard check digit', () => {
    // 5901234123457 是标准 EAN-13 示例码，校验位为 7。
    expect(eanCheckDigit('590123412345')).toBe(7);
  });

  it('should compute the check digit for a second reference code', () => {
    // 4006381333931 是 EAN-13 规范中的公开示例码，校验位为 1。
    expect(eanCheckDigit('400638133393')).toBe(1);
    expect(eanCheckDigit('4006381333931'.slice(0, 12))).toBe(1);
  });

  it('should support EAN-8 and UPC lengths', () => {
    // EAN-8 公开示例 96385074 校验位 4；UPC-A 公开示例 036000291452 校验位 2。
    expect(eanCheckDigit('9638507')).toBe(4);
    expect(eanCheckDigit('03600029145')).toBe(2);
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
describe('encodeEan8', () => {
  it('should append the check digit for a 7-digit input (canonical example)', () => {
    const { encoded, error } = encodeEan8('9638507');
    expect(error).toBeUndefined();
    expect(encoded?.displayText).toBe('96385074');
  });

  it('should produce 67 modules with 101 guards and centre 01010', () => {
    const { encoded } = encodeEan8('96385074');
    const bits = toBits(encoded!);
    expect(bits).toHaveLength(67);
    expect(bits.startsWith('101')).toBe(true);
    expect(bits.endsWith('101')).toBe(true);
    expect(bits.slice(31, 36)).toBe('01010');
    encoded!.runs.forEach((run, i) => {
      expect(run.bar, `run ${i}`).toBe(i % 2 === 0);
    });
  });

  it('should reject wrong checksum and non-numeric input', () => {
    expect(encodeEan8('96385075')?.error?.code).toBe('BARCODE_CHECKSUM_INVALID');
    expect(encodeEan8('abc')?.error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeEan8('963850')?.error?.code).toBe('BARCODE_TEXT_INVALID');
  });
});

describe('encodeUpc', () => {
  it('should append the check digit for an 11-digit input (canonical example)', () => {
    const { encoded, error } = encodeUpc('03600029145');
    expect(error).toBeUndefined();
    expect(encoded?.displayText).toBe('036000291452');
  });

  it('should produce 95 modules with the same structure as EAN-13', () => {
    const { encoded } = encodeUpc('036000291452');
    const bits = toBits(encoded!);
    expect(bits).toHaveLength(95);
    expect(bits.startsWith('101')).toBe(true);
    expect(bits.endsWith('101')).toBe(true);
    expect(bits.slice(45, 50)).toBe('01010');
  });

  it('should reject wrong checksum and non-numeric input', () => {
    expect(encodeUpc('036000291453')?.error?.code).toBe('BARCODE_CHECKSUM_INVALID');
    expect(encodeUpc('0360002914')?.error?.code).toBe('BARCODE_TEXT_INVALID');
  });
});

describe('encodeCode128', () => {
  it('should encode ASCII text with the Code B start symbol and stop symbol', () => {
    const { encoded, error } = encodeCode128('HELLO123');
    expect(error).toBeUndefined();
    expect(encoded?.displayText).toBe('HELLO123');
    const bits = toBits(encoded!);
    // START-B + 8 数据符 + 校验符 + 停止符 = 10 × 11 + 13 模块。
    expect(bits).toHaveLength(11 * 10 + 13);
    expect(bits.startsWith(CODE128_BARS[104])).toBe(true);
    expect(bits.endsWith(CODE128_BARS[106])).toBe(true);
  });

  it('should use the Mod-103 checksum symbol at the expected position', () => {
    const text = 'HI';
    const values = [...text].map((c) => c.charCodeAt(0) - 32);
    const expectedChecksum = (104 + 1 * values[0]! + 2 * values[1]!) % 103;
    const bits = toBits(encodeCode128(text).encoded!);
    // 符号序列：START-B, H, I, checksum, STOP。
    const checksumBits = bits.slice(11 * 3, 11 * 4);
    expect(checksumBits).toBe(CODE128_BARS[expectedChecksum]);
  });

  it('should produce strictly alternating bar/space runs', () => {
    const { encoded } = encodeCode128('A1$b%');
    encoded!.runs.forEach((run, i) => {
      expect(run.bar, `run ${i}`).toBe(i % 2 === 0);
    });
  });

  it('should reject empty and non-printable input', () => {
    expect(encodeCode128('')?.error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeCode128('héllo')?.error?.code).toBe('BARCODE_TEXT_INVALID');
  });
});

describe('encodeCode39', () => {
  it('should wrap the data in * start/stop characters', () => {
    const { encoded, error } = encodeCode39('HELLO123-');
    expect(error).toBeUndefined();
    expect(encoded?.displayText).toBe('HELLO123-');
    const bits = toBits(encoded!);
    // 每字符 9 元素（6 窄 3 宽 → 15 模块）+ 字符间 1 模块窄空隙；首尾 *。
    expect(bits).toHaveLength(15 * 11 + 1 * 10);
    encoded!.runs.forEach((run, i) => {
      expect(run.bar, `run ${i}`).toBe(i % 2 === 0);
    });
  });

  it('should uppercase lowercase input automatically', () => {
    expect(encodeCode39('hello')?.encoded?.displayText).toBe('HELLO');
  });

  it('should reject unsupported characters', () => {
    expect(encodeCode39('hé')?.error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeCode39('')?.error?.code).toBe('BARCODE_TEXT_INVALID');
  });
});

describe('encodeCodebar', () => {
  it('should auto-wrap bare data with A…A start/stop', () => {
    const { encoded, error } = encodeCodebar('123456789');
    expect(error).toBeUndefined();
    expect(encoded?.displayText).toBe('A123456789A');
  });

  it('should keep explicit start/stop characters', () => {
    const { encoded } = encodeCodebar('A123456789B');
    expect(encoded?.displayText).toBe('A123456789B');
    const bits = toBits(encoded!);
    expect(bits.startsWith('1011001001')).toBe(true);
    expect(bits.endsWith('1001001011')).toBe(true);
    encoded!.runs.forEach((run, i) => {
      expect(run.bar, `run ${i}`).toBe(i % 2 === 0);
    });
  });

  it('should reject data without valid start/stop framing', () => {
    expect(encodeCodebar('X123')?.error?.code).toBe('BARCODE_TEXT_INVALID');
  });
});

describe('encodeItf', () => {
  it('should interleave digit pairs between the narrow start and wide end', () => {
    const { encoded, error } = encodeItf('12345678');
    expect(error).toBeUndefined();
    expect(encoded?.displayText).toBe('12345678');
    const bits = toBits(encoded!);
    expect(bits.startsWith('1010')).toBe(true);
    expect(bits.endsWith('11101')).toBe(true);
    encoded!.runs.forEach((run, i) => {
      expect(run.bar, `run ${i}`).toBe(i % 2 === 0);
    });
  });

  it('should reject odd-length or non-numeric input', () => {
    expect(encodeItf('1234567')?.error?.code).toBe('BARCODE_TEXT_INVALID');
    expect(encodeItf('12a4')?.error?.code).toBe('BARCODE_TEXT_INVALID');
  });
});

describe('encodeBarcode dispatch', () => {
  it('should dispatch each format to its encoder', () => {
    expect(encodeBarcode('EAN8', '9638507').encoded?.displayText).toBe('96385074');
    expect(encodeBarcode('ITF', '12345678').encoded?.displayText).toBe('12345678');
    expect(encodeBarcode('CODE39', 'A1')?.encoded?.displayText).toBe('A1');
  });

  it('should report unsupported formats without producing bars', () => {
    const result = encodeBarcode('MSI' as never, '123');
    expect(result.error?.code).toBe('BARCODE_FORMAT_UNSUPPORTED');
    expect(result.encoded).toBeUndefined();
  });
});
