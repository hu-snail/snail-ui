/**
 * Behaviour tests for the docs search engine + build-time indexer.
 *
 * Covered behaviour:
 *   - tokenize(): ASCII words + CJK unigram/bigram generation;
 *   - engine.search(): title-over-body ranking, CJK substring queries via
 *     bigrams, ASCII prefix expansion, AND-completeness ordering;
 *   - snippet + highlight ranges (merged, no nested spans);
 *   - indexer parseDoc(): route mapping, end bucket, markdown stripping,
 *     doc-pages title fallback.
 */

import { describe, expect, it } from 'vitest';
import { DocsSearchEngine, tokenize, type DocsSearchDoc } from './docs-search-engine';
import { extractDocText, extractHeadings, parseDoc } from './docs-search-source';

function doc(partial: Partial<DocsSearchDoc> & Pick<DocsSearchDoc, 'url' | 'title'>): DocsSearchDoc {
  return {
    end: 'other',
    category: '文档',
    headings: [],
    text: '',
    ...partial,
  };
}

describe('tokenize', () => {
  it('should split ASCII words case-insensitively', () => {
    expect(tokenize('Button Loading')).toEqual(['button', 'loading']);
  });

  it('should emit CJK unigrams and bigrams', () => {
    expect(tokenize('按钮')).toEqual(['按钮', '按', '按钮', '钮']);
  });

  it('should keep digits and letters as one token', () => {
    expect(tokenize('v2.1-beta')).toEqual(['v2', '1', 'beta']);
  });
});

describe('DocsSearchEngine', () => {
  const docs: DocsSearchDoc[] = [
    doc({
      url: '/components/web/button',
      title: 'Button 按钮',
      end: 'web',
      category: '组件',
      headings: ['基础用法', '尺寸'],
      text: '最常用的交互原语 SnButton 触发一个即时操作，提供 loading disabled 状态。Web 端直接引入。',
    }),
    doc({
      url: '/components/uni/button',
      title: 'Button 按钮（uni 端 / 移动端）',
      end: 'uni',
      category: '组件',
      headings: ['自动注册（easycom）'],
      text: 'sn-button 是移动端核心交互组件，基于 easycom 自动注册，rpx 单位跨设备缩放。',
    }),
    doc({
      url: '/guide/web/intro',
      title: '介绍',
      end: 'other',
      category: '指南',
      headings: ['两端差异'],
      text: 'snail-aui 是面向 Web 端与 uni-app 移动端的 AI-Native UI 框架生态，两端从开发到打包完全独立。',
    }),
  ];

  it('should return [] for empty / blank queries', () => {
    const engine = new DocsSearchEngine(docs);
    expect(engine.search('')).toEqual([]);
    expect(engine.search('   ')).toEqual([]);
  });

  it('should return [] when nothing matches', () => {
    const engine = new DocsSearchEngine(docs);
    expect(engine.search('zzz不存在')).toEqual([]);
  });

  it('should rank title hits above body-only hits for a CJK query', () => {
    const engine = new DocsSearchEngine(docs);
    const hits = engine.search('按钮');
    expect(hits.length).toBeGreaterThan(0);
    // 两端 button 页标题都含「按钮」，介绍页只在正文提到（若有命中也排在后面）。
    const urls = hits.map((h) => h.doc.url);
    expect(urls).toContain('/components/web/button');
    expect(urls.indexOf('/components/web/button')).toBeLessThan(
      Math.max(0, urls.indexOf('/guide/web/intro') === -1 ? Infinity : urls.indexOf('/guide/web/intro')),
    );
  });

  it('should match ASCII queries case-insensitively and via prefix expansion', () => {
    const engine = new DocsSearchEngine(docs);
    const hits = engine.search('snbut');
    expect(hits[0]?.doc.url).toBe('/components/web/button');
  });

  it('should rank pages containing all terms above partial matches', () => {
    const engine = new DocsSearchEngine(docs);
    const hits = engine.search('按钮 web');
    expect(hits[0]?.doc.url).toBe('/components/web/button');
  });

  it('should keep highlight ranges merged and ordered inside the snippet', () => {
    const searchOnly = new DocsSearchEngine([
      doc({
        url: '/components/uni/search',
        title: 'Search 搜索框（uni 端）',
        end: 'uni',
        text: 'sn-search 搜索框组件 支持防抖与清空，placeholder 可配置。',
      }),
    ]);
    const [hit] = searchOnly.search('搜索框');
    expect(hit).toBeDefined();
    for (const [start, end] of hit!.highlight) {
      expect(start).toBeLessThan(end);
      expect(end).toBeLessThanOrEqual(hit!.snippet.length);
    }
    // 区间有序且不重叠（无嵌套 mark）。
    for (let i = 1; i < hit!.highlight.length; i += 1) {
      expect(hit!.highlight[i]![0]).toBeGreaterThanOrEqual(hit!.highlight[i - 1]![1]);
    }
    // 高亮文字确实是查询词的一部分。
    for (const [start, end] of hit!.highlight) {
      expect(hit!.snippet.slice(start, end)).toMatch(/搜索|索框|框|搜索框/);
    }
  });

  it('should fall back to the doc lead when the hit lives in the title only', () => {
    const engine = new DocsSearchEngine(docs);
    const [hit] = engine.search('按钮');
    expect(hit?.snippet.length ?? 0).toBeGreaterThan(0);
  });
});

describe('docs-search-source', () => {
  it('should strip frontmatter / scripts / demos into plain prose', () => {
    const md = [
      '---',
      'outline: false',
      '---',
      '',
      '<script setup lang="ts">',
      "import Demo from 'x';",
      '</script>',
      '',
      '# Alert 提示（Web 端）',
      '',
      '`SnAlert` 是**行内反馈条**。',
      '',
      '```ts',
      "import { SnAlert } from '@snui/vue-web';",
      '```',
      '',
      '<Demo name="alert-basic" description="基础用法" />',
      '',
      '## 何时使用',
      '',
      '- 需要持续展示信息。',
    ].join('\n');

    const text = extractDocText(md);
    // <script> 块与 <Demo …> 标签整体剔除。
    expect(text).not.toContain("import Demo");
    expect(text).not.toContain('description=');
    expect(text).not.toContain('```');
    // 围栏内的代码文字保留（搜 import { SnButton } 这类内容有价值）。
    expect(text).toContain("@snui/vue-web");
    expect(text).toContain('Alert 提示（Web 端）');
    expect(text).toContain('行内反馈条');

    const headings = extractHeadings(md);
    expect(headings).toEqual(['何时使用']);
  });

  it('should map routes / end buckets / categories', () => {
    const parsed = parseDoc(
      'components/uni/button.md',
      '# Button 按钮（uni 端 / 移动端）\n\n内容。',
      '/tmp/root',
    );
    expect(parsed.url).toBe('/components/uni/button');
    expect(parsed.end).toBe('uni');
    expect(parsed.category).toBe('组件');
    expect(parsed.title).toBe('Button 按钮（uni 端 / 移动端）');
  });

  it('should map index routes and en locale categories', () => {
    const home = parseDoc('index.md', '# 首页', '/tmp/root');
    expect(home.url).toBe('/');
    expect(home.category).toBe('首页');

    const enDoc = parseDoc('en/components/web/button.md', '# Button (Web)', '/tmp/root');
    expect(enDoc.url).toBe('/en/components/web/button');
    expect(enDoc.end).toBe('web');
    expect(enDoc.category).toBe('Components');
  });
});
