/**
 * uni-templates 部署站地址 —— docs 首页 uni-templates iframe/二维码的目标。
 *
 * 与 uni-demo（组件演示）分离的独立工程（apps/uni-templates）：主包只有
 * 模板目录，场景模板页全部在 `subpages` 分包，可发布 H5 与微信小程序。
 * H5 与 uni-demo 合并部署在同一个 Pages 项目站的 /uni-templates/ 子路径
 * （见 .github/workflows/uni-sites-deploy.yml —— GitHub Pages 每仓库只有
 * 一个站点，两个 workflow 各自 deploy 会互相覆盖）。
 *
 * 默认指向同一 Pages 项目站的 /uni-templates/ 子路径；本地联调时用环境变量覆盖为本地
 * uni-templates dev server：
 *
 *   UNI_TEMPLATES_PREVIEW_BASE=http://localhost:5174 pnpm dev
 *
 * 值在构建期经 config.ts 的 `vite.define` 注入为 `__UNI_TEMPLATES_BASE__`，
 * 客户端代码不读 process.env。
 */
declare const __UNI_TEMPLATES_BASE__: string;

/** 部署站根地址（带尾斜杠）。 */
export const UNI_TEMPLATES_BASE =
  typeof __UNI_TEMPLATES_BASE__ === 'string' ? __UNI_TEMPLATES_BASE__ : '/';

/**
 * uni-templates 内某模板页的 hash 路由地址。
 *
 * @param route 分包页面路径，形如 `subpages/login`（来自 home-uni-templates.ts）。
 */
export function uniTemplatesPageUrl(route: string): string {
  return `${UNI_TEMPLATES_BASE}#/${route}`;
}
