#!/usr/bin/env node
/**
 * build:h5 编排 —— 部署 base 注入 + uni build。
 *
 * GitHub Pages 项目站（https://<owner>.github.io/<repo>/）要求资源与路由
 * base 前缀一致。manifest.json 是静态 JSON，uni 编译器不读环境变量，因此在
 * 构建前把 UNI_H5_BASE 写入 h5.router.base，构建结束后恢复原文件；资源 base
 * 由 vite.config.ts 读取同一个环境变量。未设置 UNI_H5_BASE 时按 '/' 构建，
 * 与本地 dev 行为一致。
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const base = process.env.UNI_H5_BASE || '/';
const manifestPath = fileURLToPath(new URL('../src/manifest.json', import.meta.url));
const original = readFileSync(manifestPath, 'utf8');

const manifest = JSON.parse(original);
manifest.h5 = {
  ...(manifest.h5 ?? {}),
  router: { ...(manifest.h5?.router ?? {}), mode: 'hash', base },
};
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

try {
  const result = spawnSync('pnpm', ['exec', 'uni', 'build'], { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
} finally {
  writeFileSync(manifestPath, original);
}
