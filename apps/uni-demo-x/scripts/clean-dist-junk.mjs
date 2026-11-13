#!/usr/bin/env node
/**
 * 清理构建产物中的 macOS AppleDouble 垃圾（`._*` 文件）。
 *
 * 本仓库位于 exFAT 外置卷：编译器往 `unpackage/dist` 写入的每个文件都会伴生
 * 一个 `._x` 元数据文件。HBuilderX 编译没有后置钩子，所以每次点"重新编译"后
 * 都会重新长出数千个，微信开发者工具文件树里看起来像"组件源码混进 pages"，
 * 而且打包上传时会占包体。
 *
 * 用法：HBuilderX 编译完成后执行 `pnpm -F @snui/uni-demo-x clean:dist`
 * （或根目录 `pnpm clean:appledouble`，覆盖整个仓库）。
 */
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../unpackage/dist');

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
