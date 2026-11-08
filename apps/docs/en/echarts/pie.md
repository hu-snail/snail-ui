# Pie

Share of total and composition. The doughnut with rounded slices is the default look of this set; the rose variant maps value to radius, which suits ordered shares like brands and channels.

<div class="sn-chart-cases">

<ChartCase id="pie-ring" />

<ChartCase id="pie-rose" />

</div>

## What the panel changes

| Control    | Maps to                                                                       | Default      |
| ---------- | ----------------------------------------------------------------------------- | ------------ |
| Rounded    | `series[].itemStyle.borderRadius`                                             | on           |
| Legend     | `legend`                                                                      | on           |
| Decimals   | `tooltip.precision`                                                           | `0`          |
| Layout     | `layout`                                                                      | `default`    |
| Theme mode | `theme-mode`                                                                  | `auto`       |
| Palette    | follows the UI theme by default (primary + fading tints); a pick overrides it | follow theme |

The pie tooltip trigger is fixed to `item` (there is no shared axis to hover), so the panel shows no trigger switch.

## Related pages

- [Bar](/en/echarts/bar) — absolute amounts
- [Gauge](/en/echarts/gauge) — single-value progress
- [Usage](/en/echarts/usage) — full props / events / slots table
