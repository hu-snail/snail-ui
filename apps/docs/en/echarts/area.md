# Area

The filled form of a line: volume and composition over time. The fill is a translucent `areaStyle`, not a gradient object, so the copied config stays pure JSON and drops straight into a project.

<div class="sn-chart-cases">

<ChartCase id="area-soft" />

<ChartCase id="area-multi" />

<ChartCase id="area-stack" />

</div>

## What the panel changes

| Control    | Maps to                                                                       | Default      |
| ---------- | ----------------------------------------------------------------------------- | ------------ |
| Smooth     | `series[].smooth`                                                             | on           |
| Legend     | `legend`                                                                      | on           |
| Trigger    | `tooltip.trigger`                                                             | `item`       |
| Decimals   | `tooltip.precision`                                                           | `0`          |
| Layout     | `layout`                                                                      | `default`    |
| Theme mode | `theme-mode`                                                                  | `auto`       |
| Palette    | follows the UI theme by default (primary + fading tints); a pick overrides it | follow theme |

The fill itself comes from `areaStyle.opacity` derived from the series colour — no gradient to hand-configure.

## Related pages

- [Line](/en/echarts/line) — the unfilled form
- [Bar](/en/echarts/bar) — discrete comparison
- [Usage](/en/echarts/usage) — full props / events / slots table
