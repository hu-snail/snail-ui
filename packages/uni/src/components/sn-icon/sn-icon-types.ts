/**
 * Lucide 兼容图标数据形态：默认 24x24 viewBox + 一至多条 SVG
 * `<path d="...">` 字符串。描边用 `currentColor` 渲染，`color` prop /
 * CSS `color` 会级联生效。
 *
 * 独立成 `.ts` 文件的原因：uni-app x 产物（`@snui/uni-x`）里只有 `.uvue`，
 * `.ts` 协同文件（sn-icon-set / registry / catalog…）无法从 `.uvue` 导入
 * 类型；类型本体放在纯 ts 模块，SFC 与协同文件都从这里 import。
 */
export interface IconData {
  /** SVG viewBox。默认 '0 0 24 24'（lucide 标准网格）。 */
  viewBox?: string;
  /** 一至多条 SVG path data 字符串。 */
  paths: string[];
  /**
   * 渲染模式：`stroke`（默认，lucide 形态 —— 路径是轮廓线，用 `stroke`
   * 描出来）或 `fill`（实心字形 —— 路径是面，用 `fill` 填充）。
   *
   * Material Symbols / Material Icons 的 path 是**实心轮廓面**，按 stroke
   * 渲染会变成双线空壳，因此这类图标集必须标 `'fill'`。`fill` 模式下
   * `strokeWidth` 不参与渲染。
   */
  render?: 'stroke' | 'fill';
}
