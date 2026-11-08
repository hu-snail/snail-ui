import { describe, expect, it } from 'vitest';
import { resolveTreeLineLayout } from './tree-line-layout';

describe('resolveTreeLineLayout', () => {
  it('returns an empty layout for an empty visible list', () => {
    expect(resolveTreeLineLayout([])).toEqual([]);
  });

  it('draws no connectors on root-level rows', () => {
    const layout = resolveTreeLineLayout([0, 0, 0]);
    expect(layout).toEqual([
      { verticals: [], horizontalIndex: null },
      { verticals: [], horizontalIndex: null },
      { verticals: [], horizontalIndex: null },
    ]);
  });

  it('connects a nested branch and terminates the last child at the row center', () => {
    // src > components > {button, css, input}, src > hooks, public, README
    const layout = resolveTreeLineLayout([0, 1, 2, 2, 2, 1, 0, 0]);

    expect(layout[1]).toEqual({ verticals: [{ index: 0, half: false }], horizontalIndex: 0 });
    expect(layout[2]).toEqual({
      verticals: [
        { index: 0, half: false },
        { index: 1, half: false },
      ],
      horizontalIndex: 1,
    });
    // input.tsx is the last child of components — its own connector is half.
    expect(layout[4]).toEqual({
      verticals: [
        { index: 0, half: false },
        { index: 1, half: true },
      ],
      horizontalIndex: 1,
    });
    // hooks is the last child of src — the level-0 guide terminates here too.
    expect(layout[5]).toEqual({ verticals: [{ index: 0, half: true }], horizontalIndex: 0 });
  });

  it('keeps an ancestor guide running while a sibling branch follows', () => {
    const layout = resolveTreeLineLayout([0, 1, 2, 2, 1, 0]);
    // Deep rows under the first child keep the level-0 guide (another
    // level-1 sibling is still coming).
    expect(layout[2]?.verticals).toContainEqual({ index: 0, half: false });
    expect(layout[3]?.verticals).toContainEqual({ index: 0, half: false });
  });

  it('stops the ancestor guide once the last branch is entered', () => {
    // Only one child branch under the root: no level-0 guide on grandchildren.
    const layout = resolveTreeLineLayout([0, 1, 2, 2, 0]);
    expect(layout[1]?.verticals).toEqual([{ index: 0, half: true }]);
    expect(layout[2]?.verticals).toEqual([{ index: 1, half: false }]);
    expect(layout[3]?.verticals).toEqual([{ index: 1, half: true }]);
  });

  it('does not invent guides for missing intermediate depths', () => {
    const layout = resolveTreeLineLayout([0, 1, 3, 1, 0]);
    expect(layout[2]?.horizontalIndex).toBe(2);
    // Level 2 was never visited, so only the known levels get a line.
    expect(layout[2]?.verticals).toEqual([
      { index: 0, half: false },
      { index: 2, half: true },
    ]);
    expect(layout[3]?.verticals).toEqual([{ index: 0, half: true }]);
  });

  it('is deterministic for the same visible depths', () => {
    const depths = [0, 1, 2, 1, 0];
    expect(resolveTreeLineLayout(depths)).toEqual(resolveTreeLineLayout(depths));
  });

  describe('guide mode', () => {
    it('draws a full-height guide at every ancestor level and no horizontal', () => {
      // apps > frontend > package.json / src > app > layout.tsx / page.tsx
      const depths = [0, 1, 2, 2, 3, 4, 4];
      const layout = resolveTreeLineLayout(depths, 'guide');

      expect(layout[0]).toEqual({ verticals: [], horizontalIndex: null });
      expect(layout[1]).toEqual({
        verticals: [{ index: 0, half: false }],
        horizontalIndex: null,
      });
      // layout.tsx (depth 4) keeps every ancestor guide, including the levels
      // whose branches have already produced their last child.
      expect(layout[5]).toEqual({
        verticals: [
          { index: 0, half: false },
          { index: 1, half: false },
          { index: 2, half: false },
          { index: 3, half: false },
        ],
        horizontalIndex: null,
      });
      // page.tsx is the last row: its own-level guide is still full height.
      expect(layout[6]?.verticals).toEqual([
        { index: 0, half: false },
        { index: 1, half: false },
        { index: 2, half: false },
        { index: 3, half: false },
      ]);
    });

    it('connects sibling branches with an unbroken guide', () => {
      // apps > { frontend, api > src }: the level-0 guide runs through api's
      // subtree as well, so it never terminates at the last branch's root.
      const depths = [0, 1, 2, 1, 2];
      const layout = resolveTreeLineLayout(depths, 'guide');
      expect(layout[3]?.verticals).toEqual([{ index: 0, half: false }]);
      expect(layout[4]?.verticals).toEqual([
        { index: 0, half: false },
        { index: 1, half: false },
      ]);
    });

    it('never marks a half-height guide', () => {
      const layout = resolveTreeLineLayout([0, 1, 2, 3, 1], 'guide');
      expect(layout.every((row) => row.verticals.every((line) => line.half === false))).toBe(true);
    });
  });
});
