/**
 * Shared types + pure helpers for SnCascader — internal to `src/cascader/`.
 *
 * Mirrors the tree option contract of the web-end reference cascader
 * (label / value / disabled / children) with `labelField` / `valueField` /
 * `childrenField` remapping. The bound value is the full leaf path
 * (root-first array of values); multiple mode binds an array of paths.
 *
 * Kept in a plain `.ts` module (same convention as sn-select-types.ts /
 * sn-tree-select-types.ts) so no shared wiring (install.ts / index.ts /
 * resolver.ts) is touched.
 */

/** Value type selectable inside SnCascader — tree values are string | number. */
export type SnCascaderValue = string | number;

/**
 * One committed selection: the full root-to-leaf path (root-first).
 * Single mode binds one path; multiple mode binds an array of paths.
 */
export type SnCascaderPath = SnCascaderValue[];

/** Visual size preset (AUI convention adds `mini` below the tiny grade). */
export type SnCascaderSize = 'mini' | 'tiny' | 'small' | 'medium' | 'large';

/** Validation-driven visual status. */
export type SnCascaderStatus = 'default' | 'error' | 'warning';

/** How hovering / clicking a parent node expands the next column. */
export type SnCascaderExpandTrigger = 'click' | 'hover';

/**
 * Raw entry accepted by the `options` prop: an object whose fields are read
 * through `labelField` / `valueField` / `childrenField`.
 */
export interface SnCascaderOptionInput {
  [key: string]: unknown;
}

/**
 * A normalized tree node (deterministic, pure output of normalization).
 * Only leaves are selectable — parents expand the next column.
 */
export interface SnCascaderNode {
  /** Stable per-render key (index path, guarantees uniqueness). */
  key: string;
  /** Display label. */
  label: string;
  /** Committed value (falls back to the sibling index when missing). */
  value: SnCascaderValue;
  /** Node-level disabled — cannot be chosen, cannot expand children. */
  disabled: boolean;
  /** True when the node has no children (selectable row). */
  isLeaf: boolean;
  /** Depth in the tree (0 = root level) — drives the active column index. */
  depth: number;
  /** Values from root to self inclusive (what selection commits). */
  pathValues: SnCascaderValue[];
  /** Labels from root to self inclusive (what the trigger displays). */
  pathLabels: string[];
  /** Normalized children (empty array for leaves). */
  children: SnCascaderNode[];
}

/** Field remapping bundle consumed by the normalizer. */
export interface SnCascaderFields {
  labelField: string;
  valueField: string;
  childrenField: string;
}

function isOptionObject(raw: unknown): raw is SnCascaderOptionInput {
  return typeof raw === 'object' && raw !== null && !Array.isArray(raw);
}

function normalizeLevel(
  rawList: ReadonlyArray<SnCascaderOptionInput>,
  fields: SnCascaderFields,
  depth: number,
  parentValues: SnCascaderValue[],
  parentLabels: string[],
  parentKey: string,
): SnCascaderNode[] {
  const nodes: SnCascaderNode[] = [];
  rawList.forEach((raw, index) => {
    const labelRaw: unknown = raw[fields.labelField];
    const valueRaw: unknown = raw[fields.valueField];
    const disabledRaw: unknown = raw['disabled'];
    const childrenRaw: unknown = raw[fields.childrenField];
    const value: SnCascaderValue =
      typeof valueRaw === 'string' || typeof valueRaw === 'number' ? valueRaw : index;
    const label = typeof labelRaw === 'string' && labelRaw !== '' ? labelRaw : String(value);
    const key = parentKey === '' ? String(index) : `${parentKey}-${index}`;
    const pathValues = [...parentValues, value];
    const pathLabels = [...parentLabels, label];
    const childRawList = Array.isArray(childrenRaw) ? childrenRaw.filter(isOptionObject) : [];
    const children = normalizeLevel(childRawList, fields, depth + 1, pathValues, pathLabels, key);
    nodes.push({
      key,
      label,
      value,
      disabled: disabledRaw === true,
      isLeaf: children.length === 0,
      depth,
      pathValues,
      pathLabels,
      children,
    });
  });
  return nodes;
}

/**
 * Normalize the raw `options` prop into the node tree. Deterministic and
 * idempotent — same input + fields always produce the same output.
 */
export function normalizeCascaderOptions(
  options: ReadonlyArray<SnCascaderOptionInput>,
  fields: SnCascaderFields,
): SnCascaderNode[] {
  return normalizeLevel(options.filter(isOptionObject), fields, 0, [], [], '');
}

/**
 * Resolve a bound value path (root-first) to its node chain. Returns null
 * when any level misses or — unless `allowNonLeaf` — the path stops on a
 * non-leaf; a broken path renders the placeholder instead of a partial
 * label. `allowNonLeaf` is for check-strictly mode, which binds parent
 * values too.
 */
export function findPathByValues(
  nodes: ReadonlyArray<SnCascaderNode>,
  values: ReadonlyArray<SnCascaderValue>,
  options: { allowNonLeaf?: boolean } = {},
): SnCascaderNode[] | null {
  const allowNonLeaf = options.allowNonLeaf === true;
  if (values.length === 0) return null;
  const first = values[0];
  if (first === undefined) return null;
  const head = nodes.find((node) => node.value === first);
  if (head === undefined) return null;
  if (values.length === 1) {
    return head.isLeaf || allowNonLeaf ? [head] : null;
  }
  if (head.isLeaf) return null;
  const rest = findPathByValues(head.children, values.slice(1), options);
  return rest === null ? null : [head, ...rest];
}

/** Collect every selectable leaf under `nodes`, depth-first, order preserved. */
export function collectCascaderLeaves(nodes: ReadonlyArray<SnCascaderNode>): SnCascaderNode[] {
  const out: SnCascaderNode[] = [];
  for (const node of nodes) {
    if (node.isLeaf) out.push(node);
    else out.push(...collectCascaderLeaves(node.children));
  }
  return out;
}

/** Collect EVERY node (parents + leaves) under `nodes`, depth-first. */
export function collectCascaderNodes(nodes: ReadonlyArray<SnCascaderNode>): SnCascaderNode[] {
  const out: SnCascaderNode[] = [];
  for (const node of nodes) {
    out.push(node);
    out.push(...collectCascaderNodes(node.children));
  }
  return out;
}

/**
 * Split an index-path key into its ancestor chain (root first, self last).
 * `"0-1-2"` → `["0", "0-1", "0-1-2"]` — the expanded-columns spine.
 */
export function keyChainOf(key: string): string[] {
  const parts = key.split('-');
  const chain: string[] = [];
  for (let i = 1; i <= parts.length; i += 1) {
    chain.push(parts.slice(0, i).join('-'));
  }
  return chain;
}

/**
 * Default filter — case-insensitive substring match on the full path text
 * (labels joined with the display separator). Matching a parent label
 * therefore keeps every leaf below it. Kept exported for tests.
 */
export function defaultCascaderFilter(pattern: string, pathText: string): boolean {
  if (pattern === '') return true;
  return pathText.toLowerCase().includes(pattern.toLowerCase());
}

/**
 * Stable comparable identity of one path (multiple-mode set membership).
 * JSON keeps string vs number values distinct, so `'1'` and `1` never
 * collide as sibling keys. Pure + deterministic.
 */
export function cascaderPathKey(values: ReadonlyArray<SnCascaderValue>): string {
  return JSON.stringify(values);
}

/**
 * Every selectable (non-disabled) leaf beneath `node` — itself included
 * when it is a selectable leaf. Drives the multiple-mode checkbox cascade:
 * checking a parent commits exactly this set of leaf paths.
 */
export function collectSelectableLeaves(node: SnCascaderNode): SnCascaderNode[] {
  const leaves = node.isLeaf ? [node] : collectCascaderLeaves(node.children);
  return leaves.filter((leaf) => !leaf.disabled);
}
