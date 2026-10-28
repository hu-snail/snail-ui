#!/usr/bin/env node
/**
 * 清理构建产物中的 macOS AppleDouble 垃圾（`._*` 文件）。
 *
 * 本仓库常见于外置/非原生卷（exFAT 等）：每个写入的文件都会伴生一个 4KB 的
 * `._x` 元数据文件。dist 里若混入这些文件，微信开发者工具会把它们一并打包
 * 上传（实测 2300+ 个 / 9MB），直接撑爆小程序包体限制。CI（Linux）不会产生
 * 这些文件，本地构建后统一清理。
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const distDir = path.dirname(fileURLToPath(new URL('../dist', import.meta.url)));

let removed = 0;
try {
  const out = execFileSync('find', [distDir, '-name', '._*', '-type', 'f', '-print', '-delete'], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });
  removed = out.split('\n').filter(Boolean).length;
} catch {
  // dist 不存在等情形：跳过
}

console.log(`[clean-dist-junk] removed ${removed} AppleDouble files from ${distDir}`);
