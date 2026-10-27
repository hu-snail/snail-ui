/**
 * sn-rich-text unit tests — uni-end HTML content renderer (AUI-MP-DS-006).
 *
 * Covers the reference surface: content parsing + filtering, the style chain
 * (tag-style / class-styles / inline), images (placeholder, preview, index),
 * links, tables, media, the empty-state slot and the exposed methods.
 *
 * Assertions stay on classes / attributes / text — happy-dom drops CSS
 * lengths it cannot parse, so `rpx` values are never asserted.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SnRichText from './sn-rich-text.vue';
import SnImagePreview from '../sn-image-preview/sn-image-preview.vue';
import SnPopup from '../sn-popup/sn-popup.vue';
import {
  parseRichText,
  decodeEntities,
  RichTextParseError,
  RICH_TEXT_MAX_CONTENT_LENGTH,
} from './sn-rich-text-parser';
import { sanitizeInlineStyle, mergeStyles, resolveNodeStyle } from './sn-rich-text-node-style';

/** Parser options used by most assertions. */
const OPTIONS = { allowDataImage: false, baseUrl: '' };

/** Minimal uni runtime shape the component reads through . */
interface UniStub {
  pageScrollTo?: (options: { scrollTop: number; duration: number }) => void;
}
afterEach(() => {
  delete (globalThis as { uni?: UniStub }).uni;
});

describe('sn-rich-text parser', () => {
  describe('tree building', () => {
    it('builds block nodes with inline text runs', () => {
      const { root } = parseRichText('<h2>标题</h2><p>正文 <strong>加粗</strong></p>', OPTIONS);
      expect(root).toHaveLength(2);
      expect(root[0]?.tag).toBe('h2');
      expect(root[0]?.children[0]?.text).toBe('标题');
      const paragraph = root[1];
      expect(paragraph?.tag).toBe('p');
      expect(paragraph?.children.map((c) => c.tag)).toEqual(['text', 'strong']);
    });

    it('closes unclosed tags implicitly', () => {
      const { root } = parseRichText('<p>a<p>b', OPTIONS);
      expect(root.map((n) => n.tag)).toEqual(['p', 'p']);
    });

    it('drops stray close tags without throwing', () => {
      const { root } = parseRichText('</div><p>正文</p>', OPTIONS);
      expect(root).toHaveLength(1);
      expect(root[0]?.tag).toBe('p');
    });

    it('keeps unknown tags as generic containers', () => {
      const { root } = parseRichText('<article><p>x</p></article>', OPTIONS);
      expect(root[0]?.tag).toBe('article');
      expect(root[0]?.children[0]?.tag).toBe('p');
    });

    it('marks list items with ordered context', () => {
      const { root } = parseRichText('<ol><li>一</li><li>二</li></ol>', OPTIONS);
      const items = root[0]?.children ?? [];
      expect(items.map((li) => li.list?.index)).toEqual([1, 2]);
      expect(items[0]?.list?.ordered).toBe(true);
    });

    it('collapses whitespace outside pre', () => {
      const { root } = parseRichText('<p>a\n\n   b</p>', OPTIONS);
      expect(root[0]?.children[0]?.text).toBe('a b');
    });

    it('preserves whitespace inside pre', () => {
      const { root } = parseRichText('<pre>a\n  b</pre>', OPTIONS);
      expect(root[0]?.children[0]?.text).toBe('a\n  b');
    });

    it('turns br into a break node', () => {
      const { root } = parseRichText('<p>a<br>b</p>', OPTIONS);
      expect(root[0]?.children.map((c) => c.tag)).toEqual(['text', 'br', 'text']);
    });
  });

  describe('filtering', () => {
    it('drops script and style content entirely', () => {
      const { root } = parseRichText(
        '<script>alert(1)</' + 'script><style>.a{}</style><p>ok</p>',
        OPTIONS,
      );
      expect(root).toHaveLength(1);
      expect(root[0]?.tag).toBe('p');
    });

    it('drops event handler attributes', () => {
      const { root } = parseRichText('<p onclick="steal()">x</p>', OPTIONS);
      expect(root[0]?.attrs.onclick).toBeUndefined();
    });

    it('drops iframe and svg', () => {
      const { root } = parseRichText('<iframe src="x"></iframe><svg></svg><p>t</p>', OPTIONS);
      expect(root.map((n) => n.tag)).toEqual(['p']);
    });

    it('rejects javascript: link addresses', () => {
      const { root } = parseRichText('<a href="javascript:alert(1)">x</a>', OPTIONS);
      expect(root[0]?.attrs.href).toBe('');
    });

    it('keeps mailto / tel / anchor links', () => {
      const { root } = parseRichText(
        '<a href="mailto:a@b.c">m</a><a href="tel:123">t</a><a href="#top">h</a>',
        OPTIONS,
      );
      expect(root.map((n) => n.attrs.href)).toEqual(['mailto:a@b.c', 'tel:123', '#top']);
    });
  });

  describe('style sanitizing', () => {
    it('keeps allowlisted declarations', () => {
      expect(sanitizeInlineStyle('color:red;text-align:center')).toBe(
        'color:red;text-align:center',
      );
    });

    it('drops positioning and url() values', () => {
      expect(sanitizeInlineStyle('position:fixed;background:url(a.png)')).toBe('');
    });

    it('drops expression() values', () => {
      expect(sanitizeInlineStyle('width:expression(alert(1))')).toBe('');
    });

    it('merges layers with the rightmost winning', () => {
      expect(mergeStyles('color:red', 'color:blue')).toBe('color:blue');
    });

    it('resolves tag-style before class-styles before inline', () => {
      const node = { tag: 'p', classes: ['eyebrow'], style: 'color:#000' };
      const resolved = resolveNodeStyle(node, { p: 'color:red' }, { eyebrow: 'color:green' });
      expect(resolved).toBe('color:#000');
    });

    it('maps editor alignment classes', () => {
      const node = { tag: 'p', classes: ['ql-align-center'], style: '' };
      expect(resolveNodeStyle(node, {}, {})).toBe('text-align:center');
    });
  });

  describe('images', () => {
    it('indexes images in document order including filtered ones', () => {
      const { imageCount, images } = parseRichText(
        '<p><img src="a.png"><img src="javascript:bad"></p>',
        OPTIONS,
      );
      expect(imageCount).toBe(2);
      expect(images.map((i) => i.index)).toEqual([0, 1]);
      expect(images[0]?.src).toBe('a.png');
      expect(images[1]?.src).toBe('');
    });

    it('prefers original-src for preview when valid', () => {
      const { images } = parseRichText('<img src="thumb.png" original-src="full.png">', OPTIONS);
      expect(images[0]?.src).toBe('thumb.png');
      expect(images[0]?.previewSrc).toBe('full.png');
    });

    it('falls back to src when original-src is filtered', () => {
      const { images } = parseRichText(
        '<img src="thumb.png" original-src="javascript:bad">',
        OPTIONS,
      );
      expect(images[0]?.previewSrc).toBe('thumb.png');
    });

    it('excludes data-preview="false" images from the preview list', () => {
      const { images } = parseRichText('<img src="a.png" data-preview="false">', OPTIONS);
      expect(images[0]?.previewable).toBe(false);
    });

    it('marks images inside a valid link as linked, not previewable', () => {
      const { images } = parseRichText('<a href="https://x.dev"><img src="a.png"></a>', OPTIONS);
      expect(images[0]?.inLink).toBe(true);
      expect(images[0]?.previewable).toBe(false);
    });

    it('treats images in a filtered link as standalone', () => {
      const { images } = parseRichText('<a href="javascript:bad"><img src="a.png"></a>', OPTIONS);
      expect(images[0]?.inLink).toBe(false);
      expect(images[0]?.previewable).toBe(true);
    });

    it('drops base64 images unless allow-data-image is on', () => {
      const data = 'data:image/png;base64,iVBORw0KGgo=';
      expect(parseRichText(`<img src="${data}">`, OPTIONS).images[0]?.src).toBe('');
      const allowed = parseRichText(`<img src="${data}">`, { allowDataImage: true, baseUrl: '' });
      expect(allowed.images[0]?.src).toBe(data);
    });

    it('resolves relative addresses against base-url', () => {
      const { images } = parseRichText('<img src="pic.png">', {
        allowDataImage: false,
        baseUrl: 'https://cdn.dev/assets/',
      });
      expect(images[0]?.src).toBe('https://cdn.dev/assets/pic.png');
    });
  });

  describe('anchors', () => {
    it('keeps a valid heading id', () => {
      const { root } = parseRichText('<h2 id="intro">出发</h2>', OPTIONS);
      expect(root[0]?.anchorId).toBe('intro');
    });

    it('generates ids for headings without one', () => {
      const { root } = parseRichText('<h2>无 id</h2>', OPTIONS);
      expect(root[0]?.anchorId).toBe('sn-rt-h-1');
    });

    it('gives duplicate ids a numbered suffix', () => {
      const { root } = parseRichText('<h2 id="a">1</h2><h2 id="a">2</h2>', OPTIONS);
      expect(root[0]?.anchorId).toBe('a');
      expect(root[1]?.anchorId).toBe('sn-rt-h-2');
    });

    it('does not anchor table rows', () => {
      const { root } = parseRichText('<table><tr id="r"><td>x</td></tr></table>', OPTIONS);
      expect(root[0]?.children[0]?.anchorId).toBeUndefined();
    });
  });

  describe('tables', () => {
    it('resolves colspan into a grid', () => {
      const { root } = parseRichText(
        '<table><tr><th colspan="2">标题</th></tr><tr><td>a</td><td>b</td></tr></table>',
        OPTIONS,
      );
      const meta = root[0]?.table;
      expect(meta?.columnCount).toBe(2);
      expect(meta?.rows[0]?.[0]?.colSpan).toBe(2);
      expect(meta?.rows[1]?.map((c) => c.col)).toEqual([0, 1]);
    });

    it('skips cells covered by rowspan', () => {
      const { root } = parseRichText(
        '<table><tr><td rowspan="2">a</td><td>b</td></tr><tr><td>c</td></tr></table>',
        OPTIONS,
      );
      expect(root[0]?.table?.rows[1]?.map((c) => c.col)).toEqual([1]);
    });

    it('reads colgroup widths into the grid', () => {
      const { root } = parseRichText(
        '<table><colgroup><col width="20%"><col width="80%"></colgroup><tr><td>a</td><td>b</td></tr></table>',
        OPTIONS,
      );
      expect(root[0]?.table?.columnWidths.slice(0, 2)).toEqual(['20%', '80%']);
    });
  });

  describe('media', () => {
    it('assigns an addressable id to video and audio', () => {
      const { root } = parseRichText('<video id="trip" src="a.mp4"></video>', OPTIONS);
      expect(root[0]?.media).toEqual({ kind: 'video', id: 'trip', src: 'a.mp4', poster: '' });
    });

    it('strips whitespace ids so they stay unaddressable', () => {
      const { root } = parseRichText('<audio id="my track" src="a.mp3"></audio>', OPTIONS);
      expect(root[0]?.media?.id).toBe('');
    });

    it('keeps only the first of duplicate media ids', () => {
      const { root } = parseRichText(
        '<audio id="m" src="a.mp3"></audio><audio id="m" src="b.mp3"></audio>',
        OPTIONS,
      );
      expect(root[0]?.media?.id).toBe('m');
      expect(root[1]?.media?.id).toBe('');
    });

    it('falls back to a child source element', () => {
      const { root } = parseRichText('<video><source src="b.mp4"></video>', OPTIONS);
      expect(root[0]?.media?.src).toBe('b.mp4');
    });
  });

  describe('limits', () => {
    it('rejects content over 200000 UTF-16 units', () => {
      const big = 'a'.repeat(RICH_TEXT_MAX_CONTENT_LENGTH + 1);
      expect(() => parseRichText(big, OPTIONS)).toThrow(RichTextParseError);
    });

    it('rejects nesting deeper than 128 levels', () => {
      const deep = `${'<div>'.repeat(200)}x${'</div>'.repeat(200)}`;
      expect(() => parseRichText(deep, OPTIONS)).toThrow(/128 levels/);
    });

    it('reports the limit code on the error', () => {
      try {
        parseRichText(`${'<div>'.repeat(200)}x`, OPTIONS);
        expect.unreachable('should have thrown');
      } catch (error) {
        expect((error as RichTextParseError).code).toBe('DEPTH_LIMIT_EXCEEDED');
      }
    });
  });

  describe('entities', () => {
    it('decodes named entities', () => {
      expect(decodeEntities('a &amp; b &lt;c&gt; &nbsp;d')).toBe('a & b <c>  d');
    });

    it('decodes decimal and hex numeric entities', () => {
      expect(decodeEntities('&#65;&#x42;')).toBe('AB');
    });

    it('leaves unknown entities untouched', () => {
      expect(decodeEntities('&unknownentity;')).toBe('&unknownentity;');
    });
  });
});

describe('sn-rich-text component', () => {
  const mountRich = (
    props: Record<string, unknown>,
    slots?: Record<string, string>,
  ): ReturnType<typeof mount> => mount(SnRichText, { props, slots });

  describe('content', () => {
    it('renders headings and paragraphs', () => {
      const wrapper = mountRich({ content: '<h2>标题</h2><p>正文</p>' });
      expect(wrapper.text()).toContain('标题');
      expect(wrapper.text()).toContain('正文');
    });

    it('renders the default slot when content is empty', () => {
      const wrapper = mountRich({ content: '' }, { default: '暂无内容' });
      expect(wrapper.text()).toContain('暂无内容');
    });

    it('renders the default slot when content filters to nothing', () => {
      const wrapper = mountRich({ content: '<script>x</' + 'script>' }, { default: '空' });
      expect(wrapper.text()).toContain('空');
    });

    it('replaces the slot once content arrives', async () => {
      const wrapper = mountRich({ content: '' }, { default: '空' });
      await wrapper.setProps({ content: '<p>新内容</p>' });
      expect(wrapper.text()).toContain('新内容');
      expect(wrapper.text()).not.toContain('空');
    });

    it('emits load with the image count', () => {
      const wrapper = mountRich({ content: '<p>a</p><img src="x.png">' });
      const events = wrapper.emitted('load');
      expect(events?.[0]).toEqual([{ imageCount: 1 }]);
    });

    it('emits error for oversized content and shows the slot', () => {
      const big = 'a'.repeat(RICH_TEXT_MAX_CONTENT_LENGTH + 1);
      const wrapper = mountRich({ content: big }, { default: '太大' });
      const events = wrapper.emitted('error');
      expect(events?.[0]?.[0]).toMatchObject({ source: 'parse', code: 'CONTENT_TOO_LARGE' });
      expect(wrapper.text()).toContain('太大');
    });
  });

  describe('styles', () => {
    it('applies tag-style to the matching tag', () => {
      const wrapper = mountRich({
        content: '<p>居中</p>',
        tagStyle: { p: 'text-align:center' },
      });
      const paragraph = wrapper.find('.sn-rich-text--p');
      expect(paragraph.attributes('style')).toContain('text-align');
    });

    it('applies class-styles to content classes', () => {
      const wrapper = mountRich({
        content: '<p class="eyebrow">眉题</p>',
        classStyles: { eyebrow: 'letter-spacing:3px' },
      });
      expect(wrapper.find('.sn-rich-text--p').attributes('style')).toContain('letter-spacing');
    });

    it('lets the inline style win over the maps', () => {
      const wrapper = mountRich({
        content: '<p class="eyebrow" style="color:#123456">x</p>',
        tagStyle: { p: 'color:red' },
        classStyles: { eyebrow: 'color:green' },
      });
      expect(wrapper.find('.sn-rich-text--p').attributes('style')).toContain('#123456');
    });
  });

  describe('links', () => {
    it('emits link-click with the href', async () => {
      const wrapper = mountRich({ content: '<p><a href="https://x.dev">链接</a></p>' });
      await wrapper.find('.sn-rich-text--link').trigger('click');
      expect(wrapper.emitted('link-click')?.[0]).toEqual([{ href: 'https://x.dev' }]);
    });

    it('does not emit for a filtered href', async () => {
      const wrapper = mountRich({ content: '<p><a href="javascript:bad">x</a></p>' });
      await wrapper.find('.sn-rich-text__run').trigger('click');
      expect(wrapper.emitted('link-click')).toBeUndefined();
    });
  });

  describe('images', () => {
    it('emits image-click and opens the built-in viewer at the tapped image', async () => {
      const wrapper = mountRich({ content: '<img src="https://x.dev/a.png">' });
      await wrapper.find('.sn-rich-text__image').trigger('click');
      expect(wrapper.emitted('image-click')?.[0]).toEqual([
        { src: 'https://x.dev/a.png', index: 0 },
      ]);
      // The built-in WeChat-style viewer is now open (popup model flipped).
      const viewer = wrapper.findComponent(SnImagePreview);
      expect(viewer.findComponent(SnPopup).props('modelValue')).toBe(true);
    });

    it('skips the built-in viewer when preview-image is off', async () => {
      const wrapper = mountRich({
        content: '<img src="https://x.dev/a.png">',
        previewImage: false,
      });
      await wrapper.find('.sn-rich-text__image').trigger('click');
      expect(wrapper.emitted('image-click')).toBeDefined();
      const viewer = wrapper.findComponent(SnImagePreview);
      expect(viewer.findComponent(SnPopup).props('modelValue')).toBe(false);
    });

    it('routes a linked image tap to link-click', async () => {
      const wrapper = mountRich({
        content: '<a href="https://x.dev"><img src="https://x.dev/a.png"></a>',
      });
      await wrapper.find('.sn-rich-text__image').trigger('click');
      expect(wrapper.emitted('link-click')?.[0]).toEqual([{ href: 'https://x.dev' }]);
      expect(wrapper.emitted('image-click')).toBeUndefined();
    });

    it('falls back to alt text when the source is filtered', () => {
      const wrapper = mountRich({ content: '<img alt="无法加载">' });
      expect(wrapper.find('.sn-rich-text__image-fallback-text').text()).toBe('无法加载');
    });

    it('emits image-load with the real size', async () => {
      const wrapper = mountRich({ content: '<img src="https://x.dev/a.png">' });
      await wrapper.find('.sn-rich-text__image').trigger('load', {
        detail: { width: 320, height: 240 },
      });
      expect(wrapper.emitted('image-load')?.[0]).toEqual([
        { src: 'https://x.dev/a.png', index: 0, width: 320, height: 240 },
      ]);
    });

    it('emits a structured error when the image fails', async () => {
      const wrapper = mountRich({ content: '<img src="https://x.dev/a.png">' });
      await wrapper.find('.sn-rich-text__image').trigger('error');
      expect(wrapper.emitted('error')?.[0]?.[0]).toMatchObject({
        source: 'image',
        src: 'https://x.dev/a.png',
        index: 0,
      });
    });
  });

  describe('media', () => {
    it('renders a video player for video content', () => {
      const wrapper = mountRich({ content: '<video id="v" src="https://x.dev/a.mp4"></video>' });
      expect(wrapper.find('.sn-rich-text__video-player').exists()).toBe(true);
    });

    it('emits media-play when the video reports play', async () => {
      const wrapper = mountRich({ content: '<video id="v" src="https://x.dev/a.mp4"></video>' });
      await wrapper.find('.sn-rich-text__video-player').trigger('play');
      expect(wrapper.emitted('media-play')?.[0]).toEqual([
        { id: 'v', type: 'video', src: 'https://x.dev/a.mp4' },
      ]);
    });

    it('emits media-timeupdate with seconds', async () => {
      const wrapper = mountRich({ content: '<video id="v" src="https://x.dev/a.mp4"></video>' });
      await wrapper.find('.sn-rich-text__video-player').trigger('timeupdate', {
        detail: { currentTime: 5, duration: 30 },
      });
      expect(wrapper.emitted('media-timeupdate')?.[0]?.[0]).toMatchObject({
        id: 'v',
        currentTime: 5,
        duration: 30,
      });
    });

    it('renders a play button for audio content', () => {
      const wrapper = mountRich({ content: '<audio id="m" title="阅读时光" src="a.mp3"></audio>' });
      expect(wrapper.find('.sn-rich-text__audio-button').text()).toBe('播放');
      expect(wrapper.find('.sn-rich-text__audio-title').text()).toBe('阅读时光');
    });
  });

  describe('exposed methods', () => {
    it('getText flattens the tree and keeps alt text', () => {
      const wrapper = mountRich({
        content: '<h2>标题</h2><p>正文<strong>加粗</strong></p><img src="a.png" alt="图片说明">',
      });
      const text = (wrapper.vm as unknown as { getText(): string }).getText();
      expect(text).toContain('标题');
      expect(text).toContain('正文加粗');
      expect(text).toContain('图片说明');
    });

    it('getHeadings is empty without enable-anchor', () => {
      const wrapper = mountRich({ content: '<h2 id="a">A</h2>' });
      expect((wrapper.vm as unknown as { getHeadings(): unknown[] }).getHeadings()).toEqual([]);
    });

    it('getHeadings lists levels and labels with enable-anchor', () => {
      const wrapper = mountRich({
        content: '<h2 id="a">出发</h2><h3>准备</h3>',
        enableAnchor: true,
      });
      const headings = (
        wrapper.vm as unknown as {
          getHeadings(): Array<{ id: string; level: number; text: string }>;
        }
      ).getHeadings();
      expect(headings).toEqual([
        { id: 'a', level: 2, text: '出发' },
        { id: 'sn-rt-h-2', level: 3, text: '准备' },
      ]);
    });

    it('playMedia rejects an unknown id', () => {
      const wrapper = mountRich({ content: '<p>x</p>' });
      expect((wrapper.vm as unknown as { playMedia(id: string): boolean }).playMedia('nope')).toBe(
        false,
      );
    });

    it('seekMedia rejects a negative target', () => {
      const wrapper = mountRich({ content: '<video id="v" src="https://x.dev/a.mp4"></video>' });
      const vm = wrapper.vm as unknown as { seekMedia(id: string, seconds: number): boolean };
      expect(vm.seekMedia('v', -1)).toBe(false);
    });

    it('getAnchorRect rejects an unknown id', async () => {
      const wrapper = mountRich({ content: '<h2 id="a">A</h2>', enableAnchor: true });
      const vm = wrapper.vm as unknown as { getAnchorRect(id: string): Promise<unknown> };
      await expect(vm.getAnchorRect('missing')).rejects.toThrow(/anchor not found/);
    });

    it('getAnchorRect rejects when the platform has no selector query', async () => {
      const wrapper = mountRich({ content: '<h2 id="a">A</h2>', enableAnchor: true });
      const vm = wrapper.vm as unknown as { getAnchorRect(id: string): Promise<unknown> };
      await expect(vm.getAnchorRect('a')).rejects.toThrow(/selector query/);
    });
  });
});
