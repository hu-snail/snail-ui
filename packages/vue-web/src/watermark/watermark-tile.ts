/**
 * Pure tile-geometry maths for SnWatermark.
 *
 * Why this lives in its own module: the canvas path cannot run under
 * happy-dom (no 2D context), so the numbers that decide *what the user sees*
 * — tile size, canvas size, and how many copies are painted — are kept as
 * pure functions here where they can be unit-tested.
 *
 * `cross` doubles the canvas along both axes and paints a second copy one
 * tile down-right. Repeating that 2×2 canvas makes alternate tiles read as
 * staggered (the classic cross lattice) instead of a plain grid.
 */

export interface WatermarkTileInput {
  /** Logical tile width in CSS px. */
  width: number
  /** Logical tile height in CSS px. */
  height: number
  /** Stagger alternate tiles by half a tile. */
  cross?: boolean | undefined
}

export interface WatermarkTileSize {
  width: number
  height: number
}

/** Copies per axis: 2 when staggered, otherwise 1. */
export function watermarkTileFactor(input: WatermarkTileInput): number {
  return input.cross ? 2 : 1
}

/**
 * CSS size of one repeating background tile, in logical px.
 *
 * The overlay must pin this explicitly: a canvas' intrinsic size is in device
 * px, so without it the tile would render `dpr`× too large on a HiDPI screen
 * — and `cross` canvases (2×2 tiles) would double again.
 */
export function watermarkTileCssSize(input: WatermarkTileInput): string {
  const factor = watermarkTileFactor(input)
  return `${input.width * factor}px ${input.height * factor}px`
}

/** Device-pixel size of the canvas backing the tile. */
export function watermarkTileCanvasSize(
  input: WatermarkTileInput & { dpr: number },
): WatermarkTileSize {
  const factor = watermarkTileFactor(input)
  return {
    width: Math.max(1, Math.floor(input.width * input.dpr * factor)),
    height: Math.max(1, Math.floor(input.height * input.dpr * factor)),
  }
}

/**
 * Top-left offsets (device px) at which the tile content is painted.
 *
 * One entry for a plain grid; two for `cross` (origin + one tile down-right).
 */
export function watermarkTileDrawOffsets(
  input: WatermarkTileInput & { dpr: number },
): WatermarkTileSize[] {
  const offsets: WatermarkTileSize[] = [{ width: 0, height: 0 }]
  if (input.cross) {
    offsets.push({
      width: input.width * input.dpr,
      height: input.height * input.dpr,
    })
  }
  return offsets
}
