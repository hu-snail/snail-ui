# exFAT 卷 · AppleDouble（`._*`）污染 git 索引视图

> 现象：`git status` 报出上千个虚假条目 —— 「deleted」1132 个文件、staged
> rename、`error: non-monotonic index .git/objects/pack/._pack-*.idx`；
> 部分实际存在的源文件在 `ls` 里「消失」，随后又出现；`gen-x.mjs` 的
> `rmSync` 偶发 `ENOTEMPTY`。

## 根因

- 本仓库所在卷为 exFAT，macOS 会为每个文件写 `._*` AppleDouble 资源fork。
  `.git/objects/pack/._pack-*.idx` 一旦存在，git 读取 pack 索引时把它当成
  真实 idx 解析失败（non-monotonic），导致 status/diff 基于**不完整的对象
  视图**输出——大量「已删除/已修改」是假的，不可作为提交依据。
- HBuilderX watcher 或 Finder 在 gen-x 的 `rmSync` 删除期间重新生成 `._*`，
  目录删除后非空 → ENOTEMPTY（gen-x 已用 tmp+rename 规避写入侧）。

## 处置

- 任何 git 判读前先 `pnpm clean:appledouble`（含 `.git` 外全部 `._*`；
  注意 root script 只清 apps/packages，`.git/objects/pack` 内的需要手动
  `find .git -name '._*' -delete`——本次正是 pack 里的 `._idx` 作祟）。
- 清理后 git 视图恢复真实（约 1200 假条目 → 真实 56 条）。

## 教训

- 在该卷上，git status 的「mass deletion / staged rename」先怀疑 AppleDouble
  污染，再谈代码；绝不在污染状态下批量 commit / checkout / reset（§101）。
- 文件「时有时无」同理：先清 `._*` 重读，不要据此改代码或重跑生成。
