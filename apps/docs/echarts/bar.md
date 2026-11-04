# 柱状图

离散量的对比与构成。默认**圆角**：柱顶圆润、堆叠只圆最上一段、横向条形圆右端——圆角落在视觉上朝外的边缘才像设计，落在中间段像渲染错误。

<div class="sn-chart-cases">

<ChartCase id="bar-group" />

<ChartCase id="bar-stack" />

<ChartCase id="bar-h" />

</div>

## 面板里能改什么

| 控制项   | 落到哪里                                              | 默认      |
| -------- | ----------------------------------------------------- | --------- |
| 圆角     | `series[].itemStyle.borderRadius`                     | 开        |
| 图例     | `legend`                                              | 开        |
| 触发方式 | `tooltip.trigger`                                     | `item`    |
| 小数位   | `tooltip.precision`                                   | `0`       |
| 布局预设 | `layout`                                              | `default` |
| 主题模式 | `theme-mode`                                          | `auto`    |
| 主题色   | 默认跟随 UI 库主题（主色 + 逐级渐淡）；拾色后显式覆盖 | 跟随主题  |

堆叠案例（现金收入 / 消费收入）的圆角策略：`[6, 6, 0, 0]` 只给最后一个系列，其余系列为 `0`。关掉圆角会整体变直角，适合和别的数据源截图并排。

## 相关页面

- [折线图](/echarts/line) — 趋势形态
- [饼图](/echarts/pie) — 占比形态
- [使用文档](/echarts/usage) — Props / 事件 / 插槽全表
