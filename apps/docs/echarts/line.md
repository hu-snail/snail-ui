# 折线图

趋势与对比的第一选择。每个案例都带**配置面板**：调属性（平滑 / 图例 / 触发方式 / 小数位）、换布局预设、改主题色，然后**一键复制**项目可直接粘贴的配置代码。

<div class="sn-chart-cases">

<ChartCase id="line-basic" />

<ChartCase id="line-multi" />

<ChartCase id="line-sharp" />

<ChartCase id="line-step" />

</div>

## 指标卡组合

设计稿里常见的「折线 + 指标读数」卡片：头部是大字读数 + 涨幅胶囊 + 粒度切换，图表区用 `areaStyle.color` 的线性渐变填充和虚线 axisPointer。渐变是运行时对象（`new graphic.LinearGradient`），进不了复制配置，所以用完整 Demo 呈现：

<Demo name="echarts-web-line-card" description="1:1 还原设计稿：指标头部 + 渐变面积折线 + 虚线轴指针；粒度切换在卡片右上角。" />

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
