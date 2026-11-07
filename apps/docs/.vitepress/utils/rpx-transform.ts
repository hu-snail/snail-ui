import { fileURLToPath, URL } from 'node:url';
import type { Plugin } from 'vite';

/**
 * rpx → px：把 uni-app 的 `rpx` 单位换算成浏览器可用的 `px`（仅文档站）。
 *
 * ## 为什么必须有这一层
 *
 * uni 端组件的 CSS 全部用 `rpx` 写尺寸（`height: 72rpx` / `padding: 0 28rpx` /
 * `border-radius: 8rpx`）。浏览器 CSS 解析器**不认识** `rpx`，含 `rpx` 的声明
 * 会被整条丢弃 —— 结果是颜色（`var(--sn-mp-*)`）正常、但盒模型全部归零：
 * 按钮塌成纯文字、卡片没有内边距、开关轨道没有高度。
 *
 * 不能为了预览去改 `packages/uni` 的源码（`rpx` 正是真机自适应的基础），
 * 所以换算放在文档站构建期：`1rpx = 视口宽 / 750`，按 750 设计稿 → 375px 视口
 * 即 `1rpx = 0.5px`。
 *
 * ## 为什么是 PostCSS 而不是 vite 的 transform
 *
 * SFC 的 scoped 样式在 vite 里是**独立子模块**：`transform` 钩子拿到的 code 为空
 * （内容在 css 插件链里流转）。PostCSS 是 CSS 真正落地文本的稳定挂载点，且
 * `result.opts.from` 带着来源文件路径，正好用来限定作用范围。
 *
 * ## 作用范围
 *
 * 只处理来源落在 `packages/uni/` 下的样式（`@snui/uni-src` 别名解析出的 SFC
 * scoped 样式、`@snui/uni` 的 dist CSS）。`@snui/vue-web` 与站点样式一律不动 ——
 * 它们本来就是 px / rem。
 */

/** 750rpx 设计稿 → 375px 视口。 */
const RPX_RATIO = 0.5;

/** 匹配单位 token（数字 + rpx，允许小数与负号）。 */
const RPX_TOKEN = /(-?\d*\.?\d+)rpx\b/g;

/** 把一段 CSS 值里的 `N rpx` 换成 px。 */
function convert(value: string): string {
  return value.replace(RPX_TOKEN, (_match, raw: string) => {
    const px = Number(raw) * RPX_RATIO;
    return `${Number(px.toFixed(3))}px`;
  });
}

/** 仓库内的 uni 源码目录（绝对路径，统一成正斜杠后做包含判断）。 */
const UNI_SRC_DIR = fileURLToPath(new URL('../../../../packages/uni/', import.meta.url)).replace(
  /\\/g,
  '/',
);

/**
 * Vite 插件：把换算挂到 PostCSS，并按来源路径过滤。
 *
 * 通过 `config()` 返回 `css.postcss.plugins`，与站点原有的 PostCSS 配置合并
 * （VitePress 默认使用内置配置；追加 plugins 不会覆盖它）。
 */
export function rpxTransform(): Plugin {
  return {
    name: 'snui-rpx-to-px',
    config() {
      return {
        css: {
          postcss: {
            plugins: [
              {
                postcssPlugin: 'snui-rpx-to-px',
                /**
                 * `Once` 在每个样式文件开头调用一次，`helpers.result.opts.from`
                 * 是 CSS 的来源文件路径 —— 在这里过滤比每个 Declaration 都判断更省。
                 */
                Once(root: unknown, helpers: { result?: { opts?: { from?: string } } }) {
                  const from = (helpers?.result?.opts?.from ?? '').replace(/\\/g, '/');
                  const isUniCss = from.includes(UNI_SRC_DIR) || from.includes('@snui/uni');
                  if (!isUniCss) return;

                  const tree = root as {
                    walkDecls: (cb: (decl: { value: string }) => void) => void;
                    walkAtRules: (cb: (rule: { params: string }) => void) => void;
                  };

                  tree.walkDecls((decl) => {
                    if (!decl.value?.includes('rpx')) return;
                    const next = convert(decl.value);
                    if (next !== decl.value) decl.value = next;
                  });
                  tree.walkAtRules((rule) => {
                    if (!rule.params?.includes('rpx')) return;
                    const next = convert(rule.params);
                    if (next !== rule.params) rule.params = next;
                  });
                },
              },
            ],
          },
        },
      };
    },
  };
}
