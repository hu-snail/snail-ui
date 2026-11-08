# @snui/admin-basic — 中后台管理启动模板

基于 `@snui/vue-web`（snail-aui web 端组件库）的中后台管理启动模板。登录后由后端菜单驱动动态路由，内置 mock 服务、中英文国际化与暗色 / 主色主题切换。

## 功能

- **登录 / 注册**：SnForm 校验，mock 签发 token，注册后自动登录
- **首页 dashboard**：统计卡片（SnStatistic）+ 最近动态表格（SnDataTable）
- **左侧菜单 + 动态路由**：登录后拉取 `/api/menu`，`menuToRoutes` 注册路由并渲染 SnMenu，登出 / 401 自动摘除
- **文档模块**：侧边栏独立「文档」菜单组（快速开始 / 接口请求 / 动态路由 / 主题定制 / 国际化），内容中英双语
- **深浅色主题**：`<html>` 切换 `.dark` 类，token 级联全站生效
- **主题色切换**：头部取色器覆盖 `--aui-color-action-primary / -hover / -soft` 三个 token
- **国际化**：vue-i18n（zh-CN / en-US），语言偏好持久化，中英文 key 树一致性有测试守卫
- **请求封装**：alova 单实例，Token 注入、`{ code, message, data }` 响应约定、401 全局登出、错误码 i18n
- **mock 服务**：@alova/mock adapter，未命中 URL 穿透真实 fetch；`VITE_USE_MOCK=false` 切换真实后端
- **组件自动导入**：unplugin-vue-components + `SnUIResolver`，页面无需手动 import 组件

## 运行

```bash
pnpm install
pnpm --filter @snui/admin-basic dev      # 开发
pnpm --filter @snui/admin-basic build   # 构建
pnpm --filter @snui/admin-basic test    # 单测
```

## 演示账号

| 账号  | 密码   | 角色     |
| ----- | ------ | -------- |
| admin | 123456 | 管理员   |
| user  | 123456 | 普通用户 |

## 新增一个动态页面

1. `src/views/` 下新建页面组件
2. `src/router/dynamic.ts` 的 `VIEW_COMPONENTS` 注册 `key → 懒加载函数`
3. mock（或真实后端）菜单数据追加 `{ key, path, i18nKey, icon }` 节点，并在 `src/i18n/` 补菜单文案

详见应用内「文档 → 动态路由」。
