/**
 * Connector-line layout shared by SnTree and SnTreeSelect.
 *
 * Both components render a flat, depth-first list of visible rows. From that
 * list alone we can derive the classic "tree guide" geometry:
 *
 *   - a row at depth d draws vertical guides at levels 0..d-2 for every
 *     ancestor that still has a following sibling (the branch continues);
 *   - its own L connector sits at level d-1 and runs only to the row center
 *     when the row is the last visible child of that branch;
 *   - root rows (d === 0) have no connector at all.
 *
 * Coordinates are expressed as level indexes, not pixels: each renderer maps
 * an index to its own switcher-center x (SnTree uses the `indent` prop,
 * SnTreeSelect uses its CSS indent tokens). Keeping the geometry in one pure
 * function guarantees both trees terminate their branches identically.
 */

/** One vertical line anchored to a level's switcher-center x. */
export interface SnTreeLineVertical {
  /** Level index the line belongs to. */
  index: number;
  /** Terminate at the row center (last child of a branch). */
  half: boolean;
}

/** Connector lines for one visible row. */
export interface SnTreeLineLayout {
  verticals: SnTreeLineVertical[];
  /** Level index of the horizontal L segment; `null` for root-level rows. */
  horizontalIndex: number | null;
}

/**
 * Resolve connector lines from the depth of every visible row.
 *
 * Pure and deterministic. `depths` must be a depth-first walk (each row is
 * either deeper by any amount, or back to a shallower level); collapsed
 * branches simply never contribute rows.
 *
 * Two geometries share this resolver:
 *
 *   - `'branch'` (default): classic L connectors — ancestor guides stop once
 *     their branch is the last one, and each row closes with an elbow that is
 *     half-height for a last child.
 *   - `'guide'`: indent-guide style — every ancestor level draws a full-height
 *     vertical through the whole subtree (including the last branch) and no
 *     horizontal segment is emitted. Each guide starts at the first child's
 *     row top and ends at the last descendant row's bottom.
 */
export function resolveTreeLineLayout(
  depths: readonly number[],
  mode: 'branch' | 'guide' = 'branch',
): SnTreeLineLayout[] {
  if (mode === 'guide') {
    return depths.map((depth) => ({
      verticals: Array.from({ length: depth }, (_, index) => ({ index, half: false })),
      horizontalIndex: null,
    }));
  }

  /** Whether the most recently visited row at each depth is its last sibling. */
  const lastAtDepth = new Map<number, boolean>();

  return depths.map((depth, rowIndex) => {
    // A following row at the same depth means this row still has a sibling;
    // a shallower row (or the end of the list) ends the branch.
    let isLast = true;
    for (let next = rowIndex + 1; next < depths.length; next++) {
      const nextDepth = depths[next] ?? 0;
      if (nextDepth < depth) break;
      if (nextDepth === depth) {
        isLast = false;
        break;
      }
    }
    lastAtDepth.set(depth, isLast);

    const verticals: SnTreeLineVertical[] = [];
    for (let level = 0; level <= depth - 2; level++) {
      // The ancestor at `level + 1` was visited most recently at that depth,
      // so its flag describes exactly the branch this row belongs to.
      if (lastAtDepth.get(level + 1) === false) {
        verticals.push({ index: level, half: false });
      }
    }

    let horizontalIndex: number | null = null;
    if (depth > 0) {
      verticals.push({ index: depth - 1, half: isLast });
      horizontalIndex = depth - 1;
    }

    return { verticals, horizontalIndex };
  });
}
