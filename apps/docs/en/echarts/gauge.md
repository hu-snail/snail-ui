# Gauge

Single-value progress and scores. Ticks and the pointer are hidden by default, leaving one rounded progress arc — the cleanest shape inside a KPI card.

<div class="sn-chart-cases">

<ChartCase id="gauge-basic" />

<ChartCase id="gauge-progress" />

</div>

## What the panel changes

| Control    | Maps to                                                                       | Default      |
| ---------- | ----------------------------------------------------------------------------- | ------------ |
| Rounded    | `progress.roundCap`                                                           | on           |
| Layout     | `layout`                                                                      | `default`    |
| Theme mode | `theme-mode`                                                                  | `auto`       |
| Palette    | follows the UI theme by default (primary + fading tints); a pick overrides it | follow theme |

A gauge has no category axis, no legend and no tooltip trigger, so the panel hides those controls — it only offers switches that mean something for the case type.

## Related pages

- [Pie](/en/echarts/pie) — multi-category share
- [Usage](/en/echarts/usage) — full props / events / slots table
