/**
 * Build-time docs search indexer — scans the markdown corpus into a compact
 * document set for the client-side search engine (`docs-search-engine.ts`).
 *
 * ## Why build-time, not runtime
 *
 * VitePress compiles every `.md` into a Vue component; the raw markdown is
 * not retrievable at runtime (the same reason `raw-doc-source.ts` exists for
 * the copy button — but that plugin only ships the *current* page). A search
 * over 600+ pages needs every page's text up front, so the index is built in
 * Node during dev/build and delivered to the client through a virtual module
 * (see `docs-search-index-plugin.ts`).
 *
 * ## What is indexed per page
 *
 *   - `title` — frontmatter `title` > first `# ` heading > the web component
 *     pages' `doc-pages/<name>.ts` `title:` field (button.md renders through
 *     `SnDocPage` and has no H1) > filename;
 *   - `headings` — h2/h3 texts (section names like 基础用法 / 尺寸);
 *   - `text` — prose extracted from the markdown: frontmatter, script/style
 *     blocks, fenced code, `<Demo …>` tags and markdown syntax are stripped;
 *   - `end` — `web` | `uni` | `other`, derived from the path so the search
 *     panel can offer the Web / uni-app capsule filter on component results;
 *   - `category` — human label shown next to each hit.
 *
 * This module is Node-only (fs) and must never be imported by client code —
 * the client consumes only the JSON payload via the virtual module.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path';

/** One searchable document (the virtual-module payload shape). */
export interface DocsSearchDoc {
  /** Site-absolute route, e.g. `/components/web/button`. */
  url: string;
  title: string;
  /** Platform bucket for the capsule filter (`web` / `uni` / non-component). */
  end: 'web' | 'uni' | 'other';
  /** Sidebar-style label rendered as a chip on each hit. */
  category: string;
  /** h2/h3 section titles (searchable, weighted between title and body). */
  headings: string[];
  /** Stripped prose (hard-capped — see MAX_TEXT_LENGTH). */
  text: string;
}

/** Hard cap per-page body text; prose beyond this is search-dead but the
 * titles/headings still match, keeping the whole index a few hundred KB. */
const MAX_TEXT_LENGTH = 6000;

/** Paths never exposed through the search (meta / internal pages). */
const EXCLUDED = new Set(['404.md']);

/** Web component pages whose H1 lives in `.vitepress/utils/doc-pages/<n>.ts`. */
const DOC_PAGES_DIR = '.vitepress/utils/doc-pages';

/** Frontmatter title / first-H1 / doc-pages title fallback chain. */
function resolveTitle(relPath: string, body: string, root: string): string {
  const fm = body.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fmTitle = fm?.[1]
    ?.match(/^title:\s*(.+)$/m)?.[1]
    ?.trim()
    .replace(/^['"]|['"]$/g, '');
  if (fmTitle) return fmTitle;

  const h1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
  if (h1) return h1;

  // Web 组件页走 <SnDocPage>（无 H1），标题在 doc-pages/<name>.ts 的
  // `title: '...'` 字段里 —— 同名文件正则取第一个顶层 title。
  const stem = posix.basename(relPath, '.md');
  if (relPath.startsWith('components/web/')) {
    try {
      const source = readFileSync(join(root, DOC_PAGES_DIR, `${stem}.ts`), 'utf8');
      const title = source.match(/\n  title: '([^']+)'/)?.[1];
      if (title) return title;
    } catch {
      // No doc-page entry for this stem — fall through to the filename.
    }
  }
  return stem;
}

/** Strip one markdown document down to searchable prose. Pure (no fs). */
export function extractDocText(body: string): string {
  let text = body;
  // Frontmatter（本函数收到的 body 可能含未剥离的 frontmatter）。
  text = text.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
  // Script / style 块整体移除（imports、setup 代码不是读者视角的内容）。
  text = text.replace(/<script\b[\s\S]*?<\/script>/g, '');
  text = text.replace(/<style\b[\s\S]*?<\/style>/g, '');
  // 围栏代码块：代码本身检索噪音大（示例重复），仅去掉围栏保留代码文字。
  text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, '$1');
  // 行内代码反引号。
  text = text.replace(/`([^`]*)`/g, '$1');
  // 图片 → alt 文本；链接 → 链接文字。
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1');
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // HTML 标签（<Demo …>、<SnConfigProvider …> 等）。
  text = text.replace(/<[^>]+>/g, ' ');
  // 标题井号 / 引用符 / 表格分隔 / 强调记号。
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/^>\s?/gm, '');
  text = text.replace(/\|/g, ' ');
  text = text.replace(/[*_~]/g, '');
  // 换行归一 + 截断。
  text = text.replace(/\s+/g, ' ').trim();
  if (text.length > MAX_TEXT_LENGTH) text = text.slice(0, MAX_TEXT_LENGTH);
  return text;
}

/** h2/h3 headings of a (frontmatter-stripped) markdown body. Pure. */
export function extractHeadings(body: string): string[] {
  const stripped = body
    .replace(/<script\b[\s\S]*?<\/script>/g, '')
    .replace(/```[^\n]*\n[\s\S]*?\n```/g, '');
  const headings: string[] = [];
  for (const match of stripped.matchAll(/^#{2,3}\s+(.+)$/gm)) {
    const raw = match[1] ?? '';
    const clean = raw
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[`*_~]/g, '')
      .trim();
    if (clean) headings.push(clean);
  }
  return headings;
}

/** Platform bucket from the site-relative path (bare = zh locale). */
function resolveEnd(bare: string): DocsSearchDoc['end'] {
  if (/^components\/web\//.test(bare) || /^en\/components\/web\//.test(bare)) return 'web';
  if (/^components\/uni\//.test(bare) || /^en\/components\/uni\//.test(bare)) return 'uni';
  return 'other';
}

/** Sidebar-style category chip from the path (zh label; en locale gets EN). */
function resolveCategory(bare: string): string {
  const en = bare.startsWith('en/');
  const table: ReadonlyArray<readonly [RegExp, string, string]> = [
    [/^components\/(web|uni)\//, '组件', 'Components'],
    [/^guide\//, '指南', 'Guide'],
    [/^theme\//, '主题', 'Theme'],
    [/^style-packs\//, '风格包', 'Style Packs'],
    [/^ai\//, 'AI', 'AI'],
    [/^ecosystem\//, '生态', 'Ecosystem'],
    [/^echarts\//, 'ECharts', 'ECharts'],
    [/^templates\//, '模板', 'Templates'],
  ];
  if (bare === '' || bare === 'index') return en ? 'Home' : '首页';
  for (const [re, zh, enLabel] of table) {
    const probe = en ? bare.slice('en/'.length) : bare;
    if (re.test(probe)) return en ? enLabel : zh;
  }
  return en ? 'Docs' : '文档';
}

/** Site-absolute route from the root-relative md path. */
function routeOf(relPath: string): string {
  let route = relPath.replace(/\.md$/, '');
  if (route.endsWith('/index')) route = route.slice(0, -'/index'.length);
  if (route === 'index') route = '';
  return `/${route}`;
}

/**
 * Parse one markdown file into a search doc. Pure apart from the doc-pages
 * title fallback (fs read for `components/web/button.md` only).
 */
export function parseDoc(relPath: string, source: string, root: string): DocsSearchDoc {
  const bare = relPath.replace(/\.md$/, '');
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---/, '');
  return {
    url: routeOf(relPath),
    title: resolveTitle(relPath, source, root),
    end: resolveEnd(bare),
    category: resolveCategory(bare),
    headings: extractHeadings(source),
    text: extractDocText(source),
  };
}

/** Recursively list `*.md` under `dir`, root-relative, POSIX separators. */
function listMarkdown(dir: string, root: string, out: string[]): void {
  for (const entry of readdirSync(dir)) {
    if (entry.startsWith('.')) continue; // .vitepress / .DS_Store …
    if (entry === 'node_modules' || entry === 'dist') continue; // 依赖与产物
    const abs = join(dir, entry);
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      listMarkdown(abs, root, out);
    } else if (entry.endsWith('.md') && !EXCLUDED.has(entry)) {
      out.push(posix.relative(root, abs).replaceAll('\\', '/'));
    }
  }
}

/** Build the full corpus for the docs site rooted at `root`. */
export function buildDocsSearchIndex(root: string): DocsSearchDoc[] {
  const files: string[] = [];
  listMarkdown(root, root, files);
  files.sort();
  const docs: DocsSearchDoc[] = [];
  for (const relPath of files) {
    try {
      const source = readFileSync(join(root, relPath), 'utf8');
      docs.push(parseDoc(relPath, source, root));
    } catch {
      // A page that vanished between the listing and the read is skipped;
      // search must never fail the build over one transient file.
    }
  }
  return docs;
}
