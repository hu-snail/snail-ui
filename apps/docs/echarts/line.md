# 折线图

趋势与对比的第一选择。每个案例都带**配置面板**：调属性（平滑 / 图例 / 触发方式 / 小数位）、换布局预设、改主题色，然后**一键复制**项目可直接粘贴的配置代码。

<div class="sn-chart-cases">

<ChartCase id="line-basic" />

<ChartCase id="line-multi" />

</div>

## 面板里能改什么

| 控制项   | 落到哪里                                                     | 默认               |
| -------- | ------------------------------------------------------------ | ------------------ |
| 平滑     | `series[].smooth`                                            | 开（圆润）         |
| 图例     | `legend`（关时归一化为 `{ show: false }`，不再占 grid 空间） | 开                 |
| 触发方式 | `tooltip.trigger`                                            | `item`             |
| 小数位   | `tooltip.precision`                                          | `0`                |
| 布局预设 | `layout`                                                     | `default`          |
| 主题模式 | `theme-mode`                                                 | `auto`（跟随宿主） |
| 主题色   | 默认跟随 UI 库主题（主色 + 逐级渐淡）；拾色后显式覆盖        | 跟随主题           |

## 相关页面

- [面积图](/echarts/area) — 折线的填充形态
- [柱状图](/echarts/bar) — 离散量对比
- [使用文档](/echarts/usage) — Props / 事件 / 插槽全表
