# AUI-WEB-RESOLVER-001 — SnUIResolver `name: 'default'` 与 admin-basic 模板联调根因记录

日期：2026-11-03
任务：apps/admin-basic 中后台管理启动模板（auto-import + alova + 动态路由）

## 现象

admin-basic 通过 `unplugin-vue-components` + `SnUIResolver` 自动导入 `@snui/vue-web` 组件时：

1. **运行时**：生成的导入语句是 `import SnButton from '@snui/vue-web'`（default 导入），
   但 dist barrel 只有 named export → 组件解析为 undefined。
2. **类型**：生成的 `components.d.ts` 写成 `typeof import('@snui/vue-web')['default']`，
   解析到包的 default 导出（整包安装插件对象），vue-tsc 把模板 props
   对着 `App<any>` 校验，产生大量伪错误。

## 根因

`packages/vue-web/src/resolver.ts` 与 `packages/cli/src/resolver.ts` 的
`resolve()` 返回 `name: 'default'`。unplugin-vue-components 的契约是
`name` = 组件在 `from` 模块里的 **导出名**；@snui/vue-web 是 named-export
barrel，导出名就是组件 tag 名本身。

## 修复

- resolver 返回 `name`（即传入的组件名），两个变体同步修复；
- `packages/vue-web/src/resolver.test.ts` 增加回归断言：
  resolved name 必须等于 tag 名且存在于包导出中；
- vue-web dist 已重建（admin-basic 的 vite.config 从 dist 引用 resolver）。

## 教训（跨项目）

unplugin resolver 的 `name: 'default'` 只适用于「每文件一个 default 导出」的
库形态（如裸 SFC 路径导入）；对 barrel 包必须返回 named export 名。

## 关联

admin-basic 侧联调中还踩了两个独立坑（跨项目通用，已记入 Agent Memory）：

1. @alova/mock v2 + alova v3：`defineMock()` 的返回值是 wrapper，不能二次
   `defineMock(wrapper)`（mock 表键变成 enable/data，永不匹配）；mock handler
   返回值要被当作 StatusResponse 必须带 `statusText` 字段，否则整个返回对象
   会被当成 body。
2. 全局脚本形态的 `env.d.ts` 里写 `declare module 'vue-router'` 是**环境模块
   声明**，会把真实 vue-router 类型整体覆盖成空模块（`keyof typeof` = never，
   所有导出 TS2305）；模块增强必须放在「先 import 再 declare」的模块文件里。
