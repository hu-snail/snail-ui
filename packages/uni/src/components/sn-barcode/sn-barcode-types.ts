/**
 * sn-barcode encoders — 各条码格式的模块游程编码。
 *
 * Reference library: lime-ui `l-barcode`（格式面）；编码表以 JsBarcode (MIT)
 * v3.11.6 源码为准核对（CODE128 BARS / CODE39 encodings / codabar / ITF）。
 *
 * 所有编码器输出统一的 `SnBarcodeEncoded`：条/空交替游程（首游程恒为条，
 * 末游程恒为条）+ 展示文本。校验位规则：
 * - EAN-13 / EAN-8 / UPC：输入少 1 位则自动补算；输入全位则校验，不匹配报错。
 * - CODE128：内部计算 Mod 103 校验符（不进 displayText）。
 * - CODE39 / CODEBAR / ITF：无强制校验位。
 */

export type SnBarcodeFormat = 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC' | 'CODEBAR' | 'ITF';

export interface SnBarcodeRun {
  /** 连续同色模块数。 */
  modules: number;
  /** true = 条（着色），false = 空（透明）。 */
  bar: boolean;
}

export interface SnBarcodeEncoded {
  /** 条/空交替的模块游程序列（首末游程均为条）。 */
  runs: SnBarcodeRun[];
  /** 用于展示的文本（含补算的校验位 / 去除起始终止符等）。 */
  displayText: string;
}

export interface SnBarcodeEncodeError {
  code: 'BARCODE_FORMAT_UNSUPPORTED' | 'BARCODE_TEXT_INVALID' | 'BARCODE_CHECKSUM_INVALID';
  message: string;
}

export type SnBarcodeEncodeResult = {
  encoded?: SnBarcodeEncoded;
  error?: SnBarcodeEncodeError;
};

/** 将 01 模块串做游程编码（要求首字符为 '1'，首末游程恒为条）。 */
function runLengthEncode(bits: string): SnBarcodeRun[] {
  const runs: SnBarcodeRun[] = [];
  let current = 0;
  let isBar = true;
  for (const bit of bits) {
    const bitBar = bit === '1';
    if (bitBar === isBar) {
      current += 1;
    } else {
      if (current > 0) runs.push({ modules: current, bar: isBar });
      current = 1;
      isBar = bitBar;
    }
  }
  if (current > 0) runs.push({ modules: current, bar: isBar });
  return runs;
}

/** 将模块串编码为结果（校验首末均为条）。 */
function toEncoded(bits: string, displayText: string): SnBarcodeEncoded {
  return { runs: runLengthEncode(bits), displayText };
}

/* ------------------------------------------------------------------ */
/* EAN-13 / EAN-8 / UPC（共同结构）                                     */
/* ------------------------------------------------------------------ */

/** L 码（奇校验）—— EAN 家族标准 7 位模板。 */
const L_CODES = [
  '0001101',
  '0011001',
  '0010011',
  '0111101',
  '0100011',
  '0110001',
  '0101111',
  '0111011',
  '0110111',
  '0001011',
] as const;

/** R 码 = L 码按位取反（偶校验）。 */
function rCode(digit: number): string {
  return L_CODES[digit]!.split('')
    .map((bit) => (bit === '1' ? '0' : '1'))
    .join('');
}

/** G 码 = R 码反转（偶校验）。 */
function gCode(digit: number): string {
  return rCode(digit).split('').reverse().join('');
}

/** 首位数字决定的左侧 6 位奇偶模板（EAN-13）。 */
const PARITY_TABLE = [
  'LLLLLL',
  'LLGLGG',
  'LLGGLG',
  'LLGGGL',
  'LGLLGG',
  'LGGLLG',
  'LGGGLL',
  'LGLGLG',
  'LGLGGL',
  'LGGLGL',
] as const;

/** 计算 EAN 家族校验位（1/3 交替加权，从右起）。 */
export function eanCheckDigit(digits: string): number {
  let sum = 0;
  for (let i = digits.length - 1, weight = 3; i >= 0; i--, weight = weight === 3 ? 1 : 3) {
    sum += Number(digits.charAt(i)) * weight;
  }
  return (10 - (sum % 10)) % 10;
}

/** 12/13 位（补算或校验位）→ 带校验位的完整数字串。 */
function resolveEanDigits(
  rawText: string,
  length: number,
  label: string,
): { digits?: string; error?: SnBarcodeEncodeError } {
  const text = rawText.trim();
  const fullLength = length + 1;
  if (!new RegExp(`^\\d{${length},${fullLength}}$`).test(text)) {
    return {
      error: {
        code: 'BARCODE_TEXT_INVALID',
        message: `${label} 需要 ${length} 或 ${fullLength} 位数字`,
      },
    };
  }
  if (text.length === length) {
    return { digits: `${text}${eanCheckDigit(text)}` };
  }
  if (eanCheckDigit(text.slice(0, length)) !== Number(text.charAt(length))) {
    return { error: { code: 'BARCODE_CHECKSUM_INVALID', message: '校验位与内容不匹配' } };
  }
  return { digits: text };
}
/** EAN-13 编码：101 + 左 6 位（奇偶模板）+ 01010 + 右 6 位 + 101，共 95 模块。 */
export function encodeEan13(rawText: string): SnBarcodeEncodeResult {
  const { digits, error } = resolveEanDigits(rawText, 12, 'EAN-13');
  if (error !== undefined) return { error };
  if (digits === undefined) {
    return { error: { code: 'BARCODE_TEXT_INVALID', message: '内容为空' } };
  }
  const parity = PARITY_TABLE[Number(digits.charAt(0))]!;
  let bits = '101';
  for (let i = 1; i <= 6; i++) {
    const digit = Number(digits.charAt(i));
    bits += parity.charAt(i - 1) === 'L' ? L_CODES[digit] : gCode(digit);
  }
  bits += '01010';
  for (let i = 7; i <= 12; i++) {
    bits += rCode(Number(digits.charAt(i)));
  }
  bits += '101';
  return { encoded: toEncoded(bits, digits) };
}

/** EAN-8 编码：101 + 左 4 位 L 码 + 01010 + 右 4 位 R 码 + 101，共 67 模块。 */
export function encodeEan8(rawText: string): SnBarcodeEncodeResult {
  const { digits, error } = resolveEanDigits(rawText, 7, 'EAN-8');
  if (error !== undefined) return { error };
  if (digits === undefined) {
    return { error: { code: 'BARCODE_TEXT_INVALID', message: '内容为空' } };
  }
  let bits = '101';
  for (let i = 0; i < 4; i++) bits += L_CODES[Number(digits.charAt(i))];
  bits += '01010';
  for (let i = 4; i < 8; i++) bits += rCode(Number(digits.charAt(i)));
  bits += '101';
  return { encoded: toEncoded(bits, digits) };
}

/** UPC-A 编码：101 + 6 位 L 码 + 01010 + 6 位 R 码 + 101，共 95 模块。 */
export function encodeUpc(rawText: string): SnBarcodeEncodeResult {
  const { digits, error } = resolveEanDigits(rawText, 11, 'UPC');
  if (error !== undefined) return { error };
  if (digits === undefined) {
    return { error: { code: 'BARCODE_TEXT_INVALID', message: '内容为空' } };
  }
  let bits = '101';
  for (let i = 0; i < 6; i++) bits += L_CODES[Number(digits.charAt(i))];
  bits += '01010';
  for (let i = 6; i < 12; i++) bits += rCode(Number(digits.charAt(i)));
  bits += '101';
  return { encoded: toEncoded(bits, digits) };
}

/* ------------------------------------------------------------------ */
/* CODE128（Code Set B）                                               */
/* ------------------------------------------------------------------ */

/**
 * CODE128 107 个符号的模块串（0-105 为 11 模块，106 为停止符 13 模块）。
 * 每个符号 3 条 3 空，交替排列。表源：JsBarcode constants BARS。
 */
const CODE128_BARS = [
  '11011001100',
  '11001101100',
  '11001100110',
  '10010011000',
  '10010001100',
  '10001001100',
  '10011001000',
  '10011000100',
  '10001100100',
  '11001001000',
  '11001000100',
  '11000100100',
  '10110011100',
  '10011011100',
  '10011001110',
  '10111001100',
  '10011101100',
  '10011100110',
  '11001110010',
  '11001011100',
  '11001001110',
  '11011100100',
  '11001110100',
  '11101101110',
  '11101001100',
  '11100101100',
  '11100100110',
  '11101100100',
  '11100110100',
  '11100110010',
  '11011011000',
  '11011000110',
  '11000110110',
  '10100011000',
  '10001011000',
  '10001000110',
  '10110001000',
  '10001101000',
  '10001100010',
  '11010001000',
  '11000101000',
  '11000100010',
  '10110111000',
  '10110001110',
  '10001101110',
  '10111011000',
  '10111000110',
  '10001110110',
  '11101110110',
  '11010001110',
  '11000101110',
  '11011101000',
  '11011100010',
  '11011101110',
  '11101011000',
  '11101000110',
  '11100010110',
  '11101101000',
  '11101100010',
  '11100011010',
  '11101111010',
  '11001000010',
  '11110001010',
  '10100110000',
  '10100001100',
  '10010110000',
  '10010000110',
  '10000101100',
  '10000100110',
  '10110010000',
  '10110000100',
  '10011010000',
  '10011000010',
  '10000110100',
  '10000110010',
  '11000010010',
  '11001010000',
  '11110111010',
  '11000010100',
  '10001111010',
  '10100111100',
  '10010111100',
  '10010011110',
  '10111100100',
  '10011110100',
  '10011110010',
  '11110100100',
  '11110010100',
  '11110010010',
  '11011011110',
  '11011110110',
  '11110110110',
  '10101111000',
  '10100011110',
  '10001011110',
  '10111101000',
  '10111100010',
  '11110101000',
  '11110100010',
  '10111011110',
  '10111101110',
  '11101011110',
  '11110101110',
  '11010000100',
  '11010010000',
  '11010011100',
  '1100011101011',
] as const;

/** 供测试与高级用法校验的 CODE128 符号表（内部使用，非公开 API）。 */
export { CODE128_BARS };
const CODE128_START_B = 104;
const CODE128_MODULO = 103;

/**
 * CODE128（Code Set B）编码：START-B + 数据（ASCII 32-127）+ Mod 103 校验符
 * + 停止符。输入仅支持可打印 ASCII；不支持则报 BARCODE_TEXT_INVALID。
 */
export function encodeCode128(rawText: string): SnBarcodeEncodeResult {
  const text = rawText.trim();
  if (text.length === 0 || !/^[ -~]+$/.test(text)) {
    return {
      error: { code: 'BARCODE_TEXT_INVALID', message: 'CODE128 仅支持可打印 ASCII 字符' },
    };
  }
  const values = [...text].map((char) => char.charCodeAt(0) - 32);
  let checksum = CODE128_START_B;
  values.forEach((value, index) => {
    checksum += (index + 1) * value;
  });
  const symbols = [CODE128_START_B, ...values, checksum % CODE128_MODULO, 106];
  const bits = symbols.map((symbol) => CODE128_BARS[symbol]).join('');
  return { encoded: toEncoded(bits, text) };
}

/* ------------------------------------------------------------------ */
/* CODE39                                                              */
/* ------------------------------------------------------------------ */

/**
 * CODE39 字符表（0-9 A-Z - . 空格 $ / + % 及 * 起始终止符）。
 * 值为 15 位 01 串，'1' 表示宽元素（条/空交替，共 9 元素）。
 * 表源：JsBarcode CODE39 encodings。
 */
const CODE39_ENCODINGS: Record<string, string> = {
  '0': '101000111011101',
  '1': '111010001010111',
  '2': '101110001010111',
  '3': '111011100010101',
  '4': '101000111010111',
  '5': '111010001110101',
  '6': '101110001110101',
  '7': '101000101110111',
  '8': '111010001011101',
  '9': '101110001011101',
  A: '111010100010111',
  B: '101110100010111',
  C: '111011101000101',
  D: '101011100010111',
  E: '111010111000101',
  F: '101110111000101',
  G: '101010001110111',
  H: '111010100011101',
  I: '101110100011101',
  J: '101011100011101',
  K: '111010101000111',
  L: '101110101000111',
  M: '111011101010001',
  N: '101011101000111',
  O: '111010111010001',
  P: '101110111010001',
  Q: '101010111000111',
  R: '111010101110001',
  S: '101110101110001',
  T: '101011101110001',
  U: '111000101010111',
  V: '100011101010111',
  W: '111000111010101',
  X: '100010111010111',
  Y: '111000101110101',
  Z: '100011101110101',
  '-': '100010101110111',
  '.': '111000101011101',
  ' ': '100011101011101',
  $: '100010001000101',
  '/': '100010001010001',
  '+': '100010100010001',
  '%': '101000100010001',
  '*': '100010111011101',
};
/**
 * CODE39 编码：`*` + 数据 + `*`，字符间 1 模块窄空隙。输入自动转大写，
 * 仅支持 0-9 A-Z - . 空格 $ / + %。表值为模块级 01 串（宽元素 = 3 模块）。
 */
export function encodeCode39(rawText: string): SnBarcodeEncodeResult {
  const text = rawText.trim().toUpperCase();
  if (text.length === 0 || !/^[0-9A-Z\-. $/+%]+$/.test(text)) {
    return {
      error: {
        code: 'BARCODE_TEXT_INVALID',
        message: 'CODE39 仅支持大写字母、数字与 - . 空格 $ / + %',
      },
    };
  }
  let bits = `${CODE39_ENCODINGS['*']!}0`;
  for (const char of text) {
    bits += `${CODE39_ENCODINGS[char]!}0`;
  }
  bits += CODE39_ENCODINGS['*']!;
  return { encoded: toEncoded(bits, text) };
}

/* ------------------------------------------------------------------ */
/* CODEBAR（Codabar / NW-7）                                           */
/* ------------------------------------------------------------------ */

/**
 * CODEBAR 字符编码（9/10 位 01 串，条空交替）。数字与符号为 9 位，
 * `: / . +` 与 A-D 起始终止符为 10 位。表源：JsBarcode codabar。
 */
const CODEBAR_ENCODINGS: Record<string, string> = {
  '0': '101010011',
  '1': '101011001',
  '2': '101001011',
  '3': '110010101',
  '4': '101101001',
  '5': '110101001',
  '6': '100101011',
  '7': '100101101',
  '8': '100110101',
  '9': '110100101',
  '-': '101001101',
  $: '101100101',
  ':': '1101011011',
  '/': '1101101011',
  '.': '1101101101',
  '+': '1011011011',
  A: '1011001001',
  B: '1001001011',
  C: '1010010011',
  D: '1010011001',
};

/**
 * CODEBAR 编码：起始/终止符（A-D，未提供时自动补 A…A）夹数据，字符间窄
 * 空隙。数据仅支持 0-9 - $ : / . +。
 */
export function encodeCodebar(rawText: string): SnBarcodeEncodeResult {
  const text = rawText.trim().toUpperCase();
  const dataPattern = /^[0-9$:/.\-+]+$/;
  const fullPattern = /^[A-D][0-9$:/.\-+]+[A-D]$/;
  if (!dataPattern.test(text) && !fullPattern.test(text)) {
    return {
      error: {
        code: 'BARCODE_TEXT_INVALID',
        message: 'CODEBAR 需要起/终止符（A-D）+ 0-9 与 - $ : / . +，或纯数据（自动补 A…A）',
      },
    };
  }
  const full = dataPattern.test(text) ? `A${text}A` : text;
  const bits = [...full]
    .map((char, index) => (index === 0 ? '' : '0') + (CODEBAR_ENCODINGS[char] ?? ''))
    .join('');
  if (bits.length === 0) {
    return { error: { code: 'BARCODE_TEXT_INVALID', message: 'CODEBAR 内容为空' } };
  }
  return { encoded: toEncoded(bits, full) };
}

/* ------------------------------------------------------------------ */
/* ITF（Interleaved 2 of 5）                                           */
/* ------------------------------------------------------------------ */

/**
 * ITF 数字 5 位模板（2 宽 3 窄，'1' = 宽）。表源：JsBarcode ITF BINARIES。
 */
const ITF_DIGIT_PATTERNS = [
  '00110',
  '10001',
  '01001',
  '11000',
  '00101',
  '10100',
  '01100',
  '00011',
  '10010',
  '01010',
] as const;

/** ITF 起始（窄条窄空×2）与终止（宽条窄空宽条）模块串。 */
const ITF_START = '1010';
const ITF_END = '11101';

/**
 * ITF 编码：数字两两交错（第一位决定条、第二位决定空），要求偶数位数字。
 * 宽 = 2 模块，窄 = 1 模块。
 */
export function encodeItf(rawText: string): SnBarcodeEncodeResult {
  const text = rawText.trim();
  if (!/^\d+$/.test(text) || text.length % 2 !== 0) {
    return { error: { code: 'BARCODE_TEXT_INVALID', message: 'ITF 需要偶数位数字' } };
  }
  const width = (bit: string): string => (bit === '1' ? '11' : '0');
  let bits = ITF_START;
  for (let i = 0; i < text.length; i += 2) {
    const barPattern = ITF_DIGIT_PATTERNS[Number(text.charAt(i))]!;
    const spacePattern = ITF_DIGIT_PATTERNS[Number(text.charAt(i + 1))]!;
    // 交错：第 i 位数字的条紧邻第 i+1 位数字的空，逐一交替。
    for (let k = 0; k < 5; k++) {
      bits += width(barPattern.charAt(k)) + width(spacePattern.charAt(k));
    }
  }
  bits += ITF_END;
  return { encoded: toEncoded(bits, text) };
}

/* ------------------------------------------------------------------ */
/* 分发                                                                */
/* ------------------------------------------------------------------ */

const ENCODERS: Record<SnBarcodeFormat, (text: string) => SnBarcodeEncodeResult> = {
  CODE128: encodeCode128,
  CODE39: encodeCode39,
  EAN13: encodeEan13,
  EAN8: encodeEan8,
  UPC: encodeUpc,
  CODEBAR: encodeCodebar,
  ITF: encodeItf,
};

/** 各格式的输入说明（用于未实现 / 错误提示与空文本默认错误）。 */
export const SN_BARCODE_FORMAT_HINTS: Record<SnBarcodeFormat, string> = {
  CODE128: 'CODE128 支持可打印 ASCII 字符',
  CODE39: 'CODE39 支持大写字母、数字与 - . 空格 $ / + %',
  EAN13: 'EAN-13 需要 12 或 13 位数字',
  EAN8: 'EAN-8 需要 7 或 8 位数字',
  UPC: 'UPC 需要 11 或 12 位数字',
  CODEBAR: 'CODEBAR 需要起/终止符（A-D）与数据',
  ITF: 'ITF 需要偶数位数字',
};

/**
 * 按格式分发编码。失败时返回 `error`，绝不输出错误条码。
 */
export function encodeBarcode(format: SnBarcodeFormat, rawText: string): SnBarcodeEncodeResult {
  const encoder = ENCODERS[format];
  if (encoder === undefined) {
    return {
      error: { code: 'BARCODE_FORMAT_UNSUPPORTED', message: `暂未实现格式 ${format}` },
    };
  }
  return encoder(rawText);
}
