# Bar

Discrete comparison and composition. Rounding is **on by default**: bar tops are rounded, a stacked series rounds only its topmost segment, and a horizontal bar rounds its right end — rounding belongs on the visually outer edge, where it reads as design rather than as a rendering bug.

<div class="sn-chart-cases">

<ChartCase id="bar-group" />

<ChartCase id="bar-stack" />

<ChartCase id="bar-h" />

</div>

## What the panel changes

| Control    | Maps to                                                                       | Default      |
| ---------- | ----------------------------------------------------------------------------- | ------------ |
| Rounded    | `series[].itemStyle.borderRadius`                                             | on           |
| Legend     | `legend`                                                                      | on           |
| Trigger    | `tooltip.trigger`                                                             | `item`       |
| Decimals   | `tooltip.precision`                                                           | `0`          |
| Layout     | `layout`                                                                      | `default`    |
| Theme mode | `theme-mode`                                                                  | `auto`       |
| Palette    | follows the UI theme by default (primary + fading tints); a pick overrides it | follow theme |

The stacked case (cash in / spend) applies `[6, 6, 0, 0]` to the last series only and `0` to the rest. Turning rounding off makes every edge square — useful next to a screenshot from another data source.

## Related pages

- [Line](/en/echarts/line) — trends
- [Pie](/en/echarts/pie) — share of total
- [Usage](/en/echarts/usage) — full props / events / slots table
