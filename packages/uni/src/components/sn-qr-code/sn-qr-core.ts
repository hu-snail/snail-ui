/**
 * sn-qr-core — dependency-free QR Code encoder (ISO/IEC 18004, Model 2).
 *
 * Shared by the uni-end `sn-qr-code` (and derived from the web-end copy in
 * `packages/vue-web/src/qr-code/sn-qr-core.ts`, which mirrors the algorithm
 * naive-ui vendors). The encoder is written from scratch for this repository:
 * zero runtime dependencies, no `eval` / `new Function` (AGENTS.md §23).
 *
 * ## Scope
 *
 *   - Versions 1-40 (grid 21×21 … 177×177), four EC levels, 8 mask patterns
 *     with the ISO N1-N4 penalty evaluation.
 *   - Segment modes: numeric / alphanumeric / byte. `encode()` picks the mode
 *     from the payload (all digits → numeric, all in the ISO alphanumeric set
 *     → alphanumeric, otherwise byte with UTF-8 via `TextEncoder`). Mixed-mode
 *     segmentation (splitting one payload across modes) is NOT implemented —
 *     every payload uses exactly one segment, which is always decodable.
 *   - `boostEcl` defaults to true: the EC level may be raised (L→M→Q→H)
 *     whenever the data still fits the already-selected minimum version.
 *   - An empty payload produces zero segments.
 *   - Data that does not fit any version (1-40) throws `RangeError`.
 *
 * The quiet zone is NOT part of the matrix — the component layer draws the
 * margin, so `dotType` / `margin` styling never touches the module grid.
 */

/** Error correction level, from ~7% (L) to ~30% (H) recoverable codewords. */
export type SnQrErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/** Result grid: `size` × `size` modules, (0,0) is the top-left corner. */
export interface SnQrMatrix {
  /** Model 2 version number, 1-40. Grid side length is `version * 4 + 17`. */
  readonly version: number;
  /** Mask pattern index actually applied, 0-7 (also present in format info). */
  readonly mask: number;
  /** Grid side length in modules (21-177). */
  readonly size: number;
  /** Dark/light color of one module. Out-of-bounds coordinates read light. */
  getModule(x: number, y: number): boolean;
}

export interface SnQrEncodeOptions {
  /**
   * Force a specific mask pattern (0-7) instead of picking the lowest-penalty
   * one. Used by tests; production callers omit it.
   */
  mask?: number;
  /**
   * Raise the EC level (L→M→Q→H) while the data still fits the selected
   * version. Default true, matching the reference `encodeText` behaviour.
   */
  boostEcl?: boolean;
}

const MIN_VERSION = 1;
const MAX_VERSION = 40;

/** Format-info payload bits per level (uint2), fixed by the standard. */
const FORMAT_BITS: Record<SnQrErrorCorrectionLevel, number> = {
  L: 1,
  M: 0,
  Q: 3,
  H: 2,
};

/**
 * ECC codewords per block, indexed `[levelOrdinal][version]` (index 0 unused).
 * Transcribed from ISO/IEC 18004 tables 13-16 (same values as the reference).
 */
const ECC_CODEWORDS_PER_BLOCK: readonly [
  readonly number[],
  readonly number[],
  readonly number[],
  readonly number[],
] = [
  // Low
  [
    -1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30,
    30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
  // Medium
  [
    -1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28,
    28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28,
  ],
  // Quartile
  [
    -1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30,
    30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
  // High
  [
    -1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30,
    30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
];

/** Number of RS blocks per level and version, indexed like the table above. */
const NUM_ERROR_CORRECTION_BLOCKS: readonly [
  readonly number[],
  readonly number[],
  readonly number[],
  readonly number[],
] = [
  // Low
  [
    -1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14,
    15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25,
  ],
  // Medium
  [
    -1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23,
    25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49,
  ],
  // Quartile
  [
    -1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34,
    34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68,
  ],
  // High
  [
    -1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35,
    37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81,
  ],
];

/** Total modules available for codewords (function patterns excluded). */
function getNumRawDataModules(version: number): number {
  let result = (16 * version + 128) * version + 64;
  if (version >= 2) {
    const numAlign = Math.floor(version / 7) + 2;
    result -= (25 * numAlign - 10) * numAlign - 55;
    if (version >= 7) result -= 36;
  }
  return result;
}

/** Data (non-ECC) codewords for a version + level ordinal (0=L … 3=H). */
function getNumDataCodewords(version: number, levelOrdinal: number): number {
  return (
    Math.floor(getNumRawDataModules(version) / 8) -
    ECC_CODEWORDS_PER_BLOCK[levelOrdinal]![version]! *
      NUM_ERROR_CORRECTION_BLOCKS[levelOrdinal]![version]!
  );
}

/* ── Reed-Solomon over GF(2^8) / 0x11D ──────────────────────────────────── */

function reedSolomonMultiply(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}

/** RS generator polynomial coefficients (highest power first, lead dropped). */
function reedSolomonComputeDivisor(degree: number): number[] {
  if (degree < 1 || degree > 255) throw new RangeError('Degree out of range');
  const result: number[] = new Array<number>(degree - 1).fill(0);
  result.push(1);
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < result.length; j++) {
      result[j] = reedSolomonMultiply(result[j]!, root);
      if (j + 1 < result.length) result[j] = result[j]! ^ result[j + 1]!;
    }
    root = reedSolomonMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonComputeRemainder(
  data: readonly number[],
  divisor: readonly number[],
): number[] {
  const result: number[] = divisor.map(() => 0);
  for (const b of data) {
    const factor = b ^ (result.shift() as number);
    result.push(0);
    for (let i = 0; i < divisor.length; i++) {
      result[i] = result[i]! ^ reedSolomonMultiply(divisor[i]!, factor);
    }
  }
  return result;
}

/* ── Bit buffer ─────────────────────────────────────────────────────────── */

function appendBits(value: number, length: number, bits: number[]): void {
  if (length < 0 || length > 31 || value >>> length !== 0) {
    throw new RangeError('Value out of range');
  }
  for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1);
}

/* ── Construction state ─────────────────────────────────────────────────── */

interface Grid {
  size: number;
  modules: boolean[][];
  isFunction: boolean[][];
}

function createGrid(size: number): Grid {
  const modules: boolean[][] = [];
  const isFunction: boolean[][] = [];
  for (let y = 0; y < size; y++) {
    modules.push(new Array<boolean>(size).fill(false));
    isFunction.push(new Array<boolean>(size).fill(false));
  }
  return { size, modules, isFunction };
}

function setFunctionModule(grid: Grid, x: number, y: number, isDark: boolean): void {
  grid.modules[y]![x] = isDark;
  grid.isFunction[y]![x] = true;
}

/** 9×9 finder pattern (incl. separator), center at (x, y); may overhang. */
function drawFinderPattern(grid: Grid, x: number, y: number): void {
  for (let dy = -4; dy <= 4; dy++) {
    for (let dx = -4; dx <= 4; dx++) {
      const dist = Math.max(Math.abs(dx), Math.abs(dy));
      const xx = x + dx;
      const yy = y + dy;
      if (xx >= 0 && xx < grid.size && yy >= 0 && yy < grid.size) {
        setFunctionModule(grid, xx, yy, dist !== 2 && dist !== 4);
      }
    }
  }
}

/** 5×5 alignment pattern, center at (x, y); coordinates must be in bounds. */
function drawAlignmentPattern(grid: Grid, x: number, y: number): void {
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      setFunctionModule(grid, x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
  }
}

/** Ascending alignment-pattern center coordinates for the version. */
function getAlignmentPatternPositions(grid: Grid, version: number): number[] {
  if (version === 1) return [];
  const numAlign = Math.floor(version / 7) + 2;
  const step = version === 32 ? 26 : Math.ceil((version * 4 + 4) / (numAlign * 2 - 2)) * 2;
  const result: number[] = [6];
  for (let pos = grid.size - 7; result.length < numAlign; pos -= step) {
    result.splice(1, 0, pos);
  }
  return result;
}

function drawFunctionPatterns(grid: Grid, version: number, levelOrdinal: number): void {
  // Timing patterns (finders overwrite parts of them right after).
  for (let i = 0; i < grid.size; i++) {
    setFunctionModule(grid, 6, i, i % 2 === 0);
    setFunctionModule(grid, i, 6, i % 2 === 0);
  }
  drawFinderPattern(grid, 3, 3);
  drawFinderPattern(grid, grid.size - 4, 3);
  drawFinderPattern(grid, 3, grid.size - 4);
  const positions = getAlignmentPatternPositions(grid, version);
  for (let i = 0; i < positions.length; i++) {
    for (let j = 0; j < positions.length; j++) {
      // Skip the three corners that collide with finder patterns.
      const isFinderCorner =
        (i === 0 && j === 0) ||
        (i === 0 && j === positions.length - 1) ||
        (i === positions.length - 1 && j === 0);
      if (!isFinderCorner) drawAlignmentPattern(grid, positions[i]!, positions[j]!);
    }
  }
  drawFormatBits(grid, levelOrdinal, 0); // dummy mask, overwritten later
  drawVersionBits(grid, version);
}

/** Two BCH(15,5)-protected copies of the format info (EC level + mask). */
function drawFormatBits(grid: Grid, levelOrdinal: number, mask: number): void {
  const formatBits = FORMAT_BITS[(['L', 'M', 'Q', 'H'] as const)[levelOrdinal]!];
  const data = (formatBits << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  const bits = ((data << 10) | rem) ^ 0x5412;

  // First copy: around the top-left finder.
  for (let i = 0; i <= 5; i++) setFunctionModule(grid, 8, i, getBit(bits, i));
  setFunctionModule(grid, 8, 7, getBit(bits, 6));
  setFunctionModule(grid, 8, 8, getBit(bits, 7));
  setFunctionModule(grid, 7, 8, getBit(bits, 8));
  for (let i = 9; i < 15; i++) setFunctionModule(grid, 14 - i, 8, getBit(bits, i));

  // Second copy: split below the top-right / right of the bottom-left finder.
  for (let i = 0; i < 8; i++) setFunctionModule(grid, grid.size - 1 - i, 8, getBit(bits, i));
  for (let i = 8; i < 15; i++) setFunctionModule(grid, 8, grid.size - 15 + i, getBit(bits, i));
  setFunctionModule(grid, 8, grid.size - 8, true); // always-dark module
}

/** Two BCH(18,6)-protected copies of the version info (version ≥ 7 only). */
function drawVersionBits(grid: Grid, version: number): void {
  if (version < 7) return;
  let rem = version;
  for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
  const bits = (version << 12) | rem;
  for (let i = 0; i < 18; i++) {
    const isDark = getBit(bits, i);
    const a = grid.size - 11 + (i % 3);
    const b = Math.floor(i / 3);
    setFunctionModule(grid, a, b, isDark);
    setFunctionModule(grid, b, a, isDark);
  }
}

/** Zig-zag placement of the interleaved codeword bits into the data area. */
function drawCodewords(grid: Grid, data: readonly number[]): void {
  let i = 0;
  for (let right = grid.size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < grid.size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? grid.size - 1 - vert : vert;
        if (!grid.isFunction[y]![x] && i < data.length * 8) {
          grid.modules[y]![x] = getBit(data[i >>> 3]!, 7 - (i & 7));
          i++;
        }
        // Remainder bits (0-7) stay light, as initialized.
      }
    }
  }
}

/** Split data into RS blocks, append ECC, interleave into one byte sequence. */
function addEccAndInterleave(
  version: number,
  levelOrdinal: number,
  data: readonly number[],
): number[] {
  const numBlocks = NUM_ERROR_CORRECTION_BLOCKS[levelOrdinal]![version]!;
  const blockEccLen = ECC_CODEWORDS_PER_BLOCK[levelOrdinal]![version]!;
  const rawCodewords = Math.floor(getNumRawDataModules(version) / 8);
  const numShortBlocks = numBlocks - (rawCodewords % numBlocks);
  const shortBlockLen = Math.floor(rawCodewords / numBlocks);

  const blocks: number[][] = [];
  const rsDiv = reedSolomonComputeDivisor(blockEccLen);
  for (let i = 0, k = 0; i < numBlocks; i++) {
    const dat = data.slice(k, k + shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1));
    k += dat.length;
    const ecc = reedSolomonComputeRemainder(dat, rsDiv);
    if (i < numShortBlocks) dat.push(0); // padding byte keeps block lengths equal
    blocks.push(dat.concat(ecc));
  }

  const result: number[] = [];
  for (let i = 0; i < blocks[0]!.length; i++) {
    for (let j = 0; j < blocks.length; j++) {
      // Skip the padding byte position in short blocks.
      if (i !== shortBlockLen - blockEccLen || j >= numShortBlocks) {
        result.push(blocks[j]![i]!);
      }
    }
  }
  return result;
}

/* ── Masking + penalty ──────────────────────────────────────────────────── */

function getMaskBit(mask: number, x: number, y: number): boolean {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    case 7:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      throw new RangeError('Mask value out of range');
  }
}

function applyMask(grid: Grid, mask: number): void {
  for (let y = 0; y < grid.size; y++) {
    for (let x = 0; x < grid.size; x++) {
      if (!grid.isFunction[y]![x] && getMaskBit(mask, x, y)) {
        grid.modules[y]![x] = !grid.modules[y]![x];
      }
    }
  }
}

const PENALTY_N1 = 3;
const PENALTY_N2 = 3;
const PENALTY_N3 = 40;
const PENALTY_N4 = 10;

function getBit(x: number, i: number): boolean {
  return ((x >>> i) & 1) !== 0;
}

/** Count finder-like 1:1:3:1:1 run patterns once per light-run boundary. */
function finderPenaltyCountPatterns(runHistory: readonly number[]): number {
  const n = runHistory[1]!;
  const core =
    n > 0 &&
    runHistory[2] === n &&
    runHistory[3] === n * 3 &&
    runHistory[4] === n &&
    runHistory[5] === n;
  return (
    (core && runHistory[0]! >= n * 4 && runHistory[6]! >= n ? 1 : 0) +
    (core && runHistory[6]! >= n * 4 && runHistory[0]! >= n ? 1 : 0)
  );
}

function finderPenaltyAddHistory(
  currentRunLength: number,
  runHistory: number[],
  size: number,
): void {
  let length = currentRunLength;
  if (runHistory[0] === 0) length += size; // virtual light border
  runHistory.pop();
  runHistory.unshift(length);
}

function finderPenaltyTerminateAndCount(
  grid: Grid,
  currentRunColor: boolean,
  currentRunLength: number,
  runHistory: number[],
): number {
  let length = currentRunLength;
  if (currentRunColor) {
    finderPenaltyAddHistory(length, runHistory, grid.size);
    length = 0;
  }
  length += grid.size; // virtual light border at the end of the line
  finderPenaltyAddHistory(length, runHistory, grid.size);
  return finderPenaltyCountPatterns(runHistory);
}

/** ISO penalty score (lower is better) used to pick the automatic mask. */
function getPenaltyScore(grid: Grid): number {
  let result = 0;
  const size = grid.size;

  // N1 + N3, rows then columns.
  for (let axis = 0; axis < 2; axis++) {
    for (let a = 0; a < size; a++) {
      let runColor = false;
      let runLength = 0;
      const runHistory = [0, 0, 0, 0, 0, 0, 0];
      for (let b = 0; b < size; b++) {
        const color = axis === 0 ? grid.modules[a]![b]! : grid.modules[b]![a]!;
        if (color === runColor) {
          runLength++;
          if (runLength === 5) result += PENALTY_N1;
          else if (runLength > 5) result++;
        } else {
          finderPenaltyAddHistory(runLength, runHistory, size);
          if (!runColor) {
            result += finderPenaltyCountPatterns(runHistory) * PENALTY_N3;
          }
          runColor = color;
          runLength = 1;
        }
      }
      result += finderPenaltyTerminateAndCount(grid, runColor, runLength, runHistory) * PENALTY_N3;
    }
  }

  // N2: 2×2 same-color blocks.
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const color = grid.modules[y]![x]!;
      if (
        color === grid.modules[y]![x + 1] &&
        color === grid.modules[y + 1]![x] &&
        color === grid.modules[y + 1]![x + 1]
      ) {
        result += PENALTY_N2;
      }
    }
  }

  // N4: dark/light balance.
  let dark = 0;
  for (const row of grid.modules) {
    for (const color of row) if (color) dark++;
  }
  const total = size * size;
  const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
  result += k * PENALTY_N4;
  return result;
}

/* ── Public entry point ─────────────────────────────────────────────────── */

/** Segment mode actually used for a payload (exposed for tests / inspection). */
export type SnQrSegmentMode = 'numeric' | 'alphanumeric' | 'byte';

/** Characters allowed by ISO/IEC 18004 alphanumeric mode. */
const ALPHANUMERIC_CHARSET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

function toUtf8Bytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text));
}

/** Mode indicators from the standard (4 bits each). */
const MODE_INDICATOR: Record<SnQrSegmentMode, number> = {
  numeric: 0x1,
  alphanumeric: 0x2,
  byte: 0x4,
};

/**
 * Pick the densest single-segment mode that can carry the whole payload.
 * Mixed-mode segmentation (splitting one payload across modes) is out of
 * scope — see the file header.
 */
export function pickSegmentMode(text: string): SnQrSegmentMode {
  if (text === '') return 'byte';
  if (/^[0-9]+$/.test(text)) return 'numeric';
  let alphanumeric = true;
  for (const char of text) {
    if (!ALPHANUMERIC_CHARSET.includes(char)) {
      alphanumeric = false;
      break;
    }
  }
  return alphanumeric ? 'alphanumeric' : 'byte';
}

/** Character-count indicator width for a mode + version. */
function charCountBits(mode: SnQrSegmentMode, version: number): number {
  const tier = version <= 9 ? 0 : version <= 26 ? 1 : 2;
  if (mode === 'numeric') return [10, 12, 14][tier]!;
  if (mode === 'alphanumeric') return [9, 11, 13][tier]!;
  return [8, 16, 16][tier]!;
}

/** Payload bit length for a mode + payload (without mode / count indicators). */
function payloadBits(mode: SnQrSegmentMode, text: string): number {
  const length = text.length;
  if (mode === 'numeric') return Math.floor(length / 3) * 10 + [0, 4, 7][length % 3]!;
  if (mode === 'alphanumeric') return Math.floor(length / 2) * 11 + (length % 2) * 6;
  return toUtf8Bytes(text).length * 8;
}

/** Append the segment payload bits for a mode. */
function appendPayload(mode: SnQrSegmentMode, text: string, bits: number[]): void {
  if (mode === 'numeric') {
    for (let i = 0; i < text.length; i += 3) {
      const chunk = text.slice(i, i + 3);
      appendBits(Number(chunk), chunk.length * 3 + 1, bits);
    }
    return;
  }
  if (mode === 'alphanumeric') {
    for (let i = 0; i < text.length; i += 2) {
      const first = ALPHANUMERIC_CHARSET.indexOf(text[i]!);
      const second = i + 1 < text.length ? ALPHANUMERIC_CHARSET.indexOf(text[i + 1]!) : -1;
      if (second >= 0) appendBits(first * 45 + second, 11, bits);
      else appendBits(first, 6, bits);
    }
    return;
  }
  for (const byte of toUtf8Bytes(text)) appendBits(byte, 8, bits);
}

/** Lowest mask index achieving the minimum penalty (ties keep the lowest). */
function pickBestMask(grid: Grid, levelOrdinal: number): number {
  let bestMask = 0;
  let minPenalty = Number.MAX_SAFE_INTEGER;
  for (let mask = 0; mask < 8; mask++) {
    applyMask(grid, mask);
    drawFormatBits(grid, levelOrdinal, mask);
    const penalty = getPenaltyScore(grid);
    if (penalty < minPenalty) {
      bestMask = mask;
      minPenalty = penalty;
    }
    applyMask(grid, mask); // XOR undoes the mask
  }
  return bestMask;
}

/** Extra fields describing the chosen segment, layered onto the matrix. */
export interface SnQrEncoded extends SnQrMatrix {
  /** Segment mode used for the payload. */
  readonly mode: SnQrSegmentMode;
  /** EC level actually written into the format info (may be boosted). */
  readonly level: SnQrErrorCorrectionLevel;
}

/**
 * Encode text into a QR Code (Model 2), choosing the smallest version (1-40)
 * that fits at the requested EC level, the densest single-segment mode and the
 * lowest-penalty mask pattern.
 */
export function encode(
  text: string,
  ecl: SnQrErrorCorrectionLevel = 'M',
  options: SnQrEncodeOptions = {},
): SnQrEncoded {
  const levelOrdinal = { L: 0, M: 1, Q: 2, H: 3 }[ecl];
  if (levelOrdinal === undefined)
    throw new RangeError(`Unknown error correction level: ${String(ecl)}`);
  const forcedMask = options.mask ?? -1;
  if (forcedMask < -1 || forcedMask > 7) throw new RangeError('Mask value out of range');

  const mode = pickSegmentMode(text);

  // 1. Smallest version whose data capacity fits the segment.
  let version = MIN_VERSION;
  let dataUsedBits = 0;
  for (; ; version++) {
    if (version > MAX_VERSION) throw new RangeError('Data too long');
    dataUsedBits = text === '' ? 0 : 4 + charCountBits(mode, version) + payloadBits(mode, text);
    if (dataUsedBits <= getNumDataCodewords(version, levelOrdinal) * 8) break;
  }

  // 2. Boost the EC level while the data still fits the same version.
  let effectiveOrdinal = levelOrdinal;
  if (options.boostEcl !== false) {
    for (const candidate of [1, 2, 3]) {
      if (dataUsedBits <= getNumDataCodewords(version, candidate) * 8) {
        effectiveOrdinal = candidate;
      }
    }
  }

  // 3. Segment bits → terminator → byte alignment → pad bytes.
  const dataCapacityBits = getNumDataCodewords(version, effectiveOrdinal) * 8;
  const bits: number[] = [];
  if (text !== '') {
    appendBits(MODE_INDICATOR[mode], 4, bits);
    appendBits(text.length, charCountBits(mode, version), bits);
    appendPayload(mode, text, bits);
  }
  appendBits(0, Math.min(4, dataCapacityBits - bits.length), bits);
  appendBits(0, (8 - (bits.length % 8)) % 8, bits);
  for (let padByte = 0xec; bits.length < dataCapacityBits; padByte ^= 0xec ^ 0x11) {
    appendBits(padByte, 8, bits);
  }

  const dataCodewords: number[] = [];
  while (dataCodewords.length * 8 < bits.length) dataCodewords.push(0);
  bits.forEach((bit, i) => {
    dataCodewords[i >>> 3] = (dataCodewords[i >>> 3] ?? 0) | (bit << (7 - (i & 7)));
  });

  // 4. Draw function patterns + data, then pick and apply the final mask.
  const size = version * 4 + 17;
  const grid = createGrid(size);
  drawFunctionPatterns(grid, version, effectiveOrdinal);
  drawCodewords(grid, addEccAndInterleave(version, effectiveOrdinal, dataCodewords));

  const mask = forcedMask >= 0 ? forcedMask : pickBestMask(grid, effectiveOrdinal);
  applyMask(grid, mask);
  drawFormatBits(grid, effectiveOrdinal, mask);

  const modules = grid.modules;
  const effectiveLevel = (['L', 'M', 'Q', 'H'] as const)[effectiveOrdinal]!;
  return {
    version,
    mask,
    size,
    mode,
    level: effectiveLevel,
    getModule(x: number, y: number): boolean {
      return x >= 0 && x < size && y >= 0 && y < size && modules[y]![x]!;
    },
  };
}
