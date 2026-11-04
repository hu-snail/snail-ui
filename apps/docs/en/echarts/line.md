# Line

The first choice for trends and comparison. Every case ships a **config panel**: tune properties (smooth / legend / trigger / decimals), switch the layout preset, change the palette, then **copy the config** as a ready-to-paste SFC.

<div class="sn-chart-cases">

<ChartCase id="line-basic" />

<ChartCase id="line-multi" />

</div>

## What the panel changes

| Control    | Maps to                                                                            | Default                   |
| ---------- | ---------------------------------------------------------------------------------- | ------------------------- |
| Smooth     | `series[].smooth`                                                                  | on (rounded)              |
| Legend     | `legend` (off normalises to `{ show: false }`, so the grid stops reserving a band) | on                        |
| Trigger    | `tooltip.trigger`                                                                  | `item`                    |
| Decimals   | `tooltip.precision`                                                                | `0`                       |
| Layout     | `layout`                                                                           | `default`                 |
| Theme mode | `theme-mode`                                                                       | `auto` (follows the host) |
| Palette    | follows the UI theme by default (primary + fading tints); a pick overrides it      | follow theme              |

## Related pages

- [Area](/en/echarts/area) — the filled form of a line
- [Bar](/en/echarts/bar) — discrete comparison
- [Usage](/en/echarts/usage) — full props / events / slots table
