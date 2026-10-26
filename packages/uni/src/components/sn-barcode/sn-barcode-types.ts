/**
 * sn-barcode encoder — EAN-13 module run-length encoding.
 *
 * Reference library: lime-ui `l-barcode` (format surface). 本实现先落地
 * EAN-13（含校验位自动补算 / 校验）；CODE128 等其余格式需要完整编码表，
 * 登记为 follow-up，未实现的 format 会走 error 而不是输出错误条码。
 *
 * EAN-13 结构：左警戒 101 + 左侧 6 位（L/G 码，由首位数字决定奇偶模板）
 * + 中间 01010 + 右侧 6 位（R 码）+ 右警戒 101，共 95 模块。
 */

export type SnBarcodeFormat = 'EAN13'

export interface SnBarcodeRun {
  /** 连续同色模块数。 */
  modules: number
  /** true = 条（着色），false = 空（透明）。 */
  bar: boolean
}

export interface SnBarcodeEncoded {
  /** 条/空交替的模块游程序列，总长恒为 95 模块。 */
  runs: SnBarcodeRun[]
  /** 用于展示的文本（补算校验位后的 13 位）。 */
  displayText: string
}

export interface SnBarcodeEncodeError {
  code: 'BARCODE_FORMAT_UNSUPPORTED' | 'BARCODE_TEXT_INVALID' | 'BARCODE_CHECKSUM_INVALID'
  message: string
}

/** L 码（奇校验）—— EAN-13 标准 7 位模板。 */
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
] as const

/** R 码 = L 码按位取反（偶校验）。 */
function rCode(digit: number): string {
  return L_CODES[digit]!
    .split('')
    .map((bit) => (bit === '1' ? '0' : '1'))
    .join('')
}

/** G 码 = R 码反转（偶校验）。 */
function gCode(digit: number): string {
  return rCode(digit).split('').reverse().join('')
}

/** 首位数字决定的左侧 6 位奇偶模板。 */
const PARITY_TABLE = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG', 'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'] as const

/** 计算 EAN-13 校验位（1/3 交替加权）。 */
export function ean13CheckDigit(digits12: string): number {
  let sum = 0
  for (let i = 0; i < 12; i++) {
    const digit = Number(digits12.charAt(i))
    sum += i % 2 === 0 ? digit : digit * 3
  }
  return (10 - (sum % 10)) % 10
}

/** 将 95 位模块串做游程编码（首个游程恒为条）。 */
function runLengthEncode(bits: string): SnBarcodeRun[] {
  const runs: SnBarcodeRun[] = []
  let current = ''
  let isBar = bits.charAt(0) === '1'
  for (const bit of bits) {
    const bitBar = bit === '1'
    if (bitBar === isBar) {
      current += bit
    } else {
      runs.push({ modules: current.length, bar: isBar })
      current = bit
      isBar = bitBar
    }
  }
  runs.push({ modules: current.length, bar: isBar })
  return runs
}

/**
 * 编码 EAN-13。输入 12 位（自动补校验位）或 13 位（校验不匹配报错）。
 * 失败时返回 `error`，绝不输出错误条码。
 */
export function encodeEan13(rawText: string): { encoded?: SnBarcodeEncoded; error?: SnBarcodeEncodeError } {
  const text = rawText.trim()
  if (!/^\d{12,13}$/.test(text)) {
    return { error: { code: 'BARCODE_TEXT_INVALID', message: 'EAN-13 需要 12 或 13 位数字' } }
  }
  let digits = text
  if (text.length === 12) {
    digits = `${text}${ean13CheckDigit(text)}`
  } else if (ean13CheckDigit(text.slice(0, 12)) !== Number(text.charAt(12))) {
    return { error: { code: 'BARCODE_CHECKSUM_INVALID', message: '校验位与内容不匹配' } }
  }

  const parity = PARITY_TABLE[Number(digits.charAt(0))]!
  let bits = '101'
  for (let i = 1; i <= 6; i++) {
    const digit = Number(digits.charAt(i))
    bits += parity.charAt(i - 1) === 'L' ? L_CODES[digit] : gCode(digit)
  }
  bits += '01010'
  for (let i = 7; i <= 12; i++) {
    bits += rCode(Number(digits.charAt(i)))
  }
  bits += '101'

  return { encoded: { runs: runLengthEncode(bits), displayText: digits } }
}
