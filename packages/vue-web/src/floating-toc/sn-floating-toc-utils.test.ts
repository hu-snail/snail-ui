import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  clampLevel,
  findActiveHref,
  hrefToId,
  readScrollTop,
  resolveScrollContainer,
  scrollToSection,
} from './sn-floating-toc-utils';

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

function stubRect(el: HTMLElement, top: number, height = 100): void {
  el.getBoundingClientRect = () =>
    ({ top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top }) as DOMRect;
}

describe('sn-floating-toc-utils', () => {
  describe('findActiveHref', () => {
    // Real page sections never start at 0 — the page has a hero above them.
    // Starting #a at 0 would make it "reached" at scroll 0 for every
    // non-negative bound, which is not what a page looks like.
    const offsets = [
      { href: '#a', top: 100, height: 400 },
      { href: '#b', top: 500, height: 400 },
      { href: '#c', top: 900, height: 400 },
    ];

    it('should return null when no section is registered', () => {
      expect(findActiveHref([], 0, 0)).toBeNull();
    });

    it('should fall back to the first section before anything crosses the bound', () => {
      expect(findActiveHref(offsets, 0, 0)).toBe('#a');
      expect(findActiveHref(offsets, 0, 300)).toBe('#a');
    });

    it('should pick the last section whose top crossed the bound', () => {
      // Scrolled 550: #a is at -450, #b at -50, #c at 350.
      expect(findActiveHref(offsets, 550, 0)).toBe('#b');
      expect(findActiveHref(offsets, 950, 0)).toBe('#c');
    });

    it('should honour a positive bound by switching later', () => {
      // A 300px bound sits below the viewport top, so each section must rise
      // 300px further: #b (500) counts from 200 of scroll instead of 500,
      // #c (900) from 600 instead of 900.
      expect(findActiveHref(offsets, 250, 300)).toBe('#b');
      expect(findActiveHref(offsets, 650, 300)).toBe('#c');
      // ...and 250 is still short of #b's 200? No: 500 - 250 = 250 <= 300.
      expect(findActiveHref(offsets, 100, 300)).toBe('#a');
    });

    it('should honour a negative bound by switching earlier', () => {
      // A -300px bound lifts the line above the viewport top, so a section
      // must still be 300px below it: #b (500) counts from 550, #c from 950.
      expect(findActiveHref(offsets, 950, -300)).toBe('#b');
      expect(findActiveHref(offsets, 550, -300)).toBe('#a');
    });
  });

  describe('resolveScrollContainer', () => {
    it('should return the document when no section is registered', () => {
      expect(resolveScrollContainer([], undefined)).toBe(document);
    });

    it('should resolve a selector string', () => {
      const el = document.createElement('div');
      el.id = 'toc-scroller';
      document.body.appendChild(el);
      expect(resolveScrollContainer([], '#toc-scroller')).toBe(el);
    });

    it('should fall back to the document for an unknown selector', () => {
      expect(resolveScrollContainer([], '#does-not-exist')).toBe(document);
    });

    it('should prefer an explicit element', () => {
      const el = document.createElement('div');
      expect(resolveScrollContainer([], el)).toBe(el);
    });

    it('should find the nearest scrollable ancestor of the sections', () => {
      const scroller = document.createElement('div');
      scroller.style.overflowY = 'auto';
      const section = document.createElement('section');
      scroller.appendChild(section);
      document.body.appendChild(scroller);
      expect(resolveScrollContainer([{ element: section }], undefined)).toBe(scroller);
    });
  });

  describe('readScrollTop', () => {
    it('should read window scroll for a document container', () => {
      vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120);
      expect(readScrollTop(document)).toBe(120);
    });

    it('should read scrollTop for an element container', () => {
      const el = document.createElement('div');
      el.scrollTop = 42;
      expect(readScrollTop(el)).toBe(42);
    });
  });

  describe('scrollToSection', () => {
    it('should scroll the document to the section offset', () => {
      const section = document.createElement('section');
      section.id = 'intro';
      document.body.appendChild(section);
      stubRect(section, 500);
      const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});

      scrollToSection('#intro', document);

      expect(spy).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' });
    });

    it('should scroll a custom container by the section offset', () => {
      const container = document.createElement('div');
      stubRect(container, 100);
      const section = document.createElement('section');
      section.id = 'usage';
      container.appendChild(section);
      document.body.appendChild(container);
      stubRect(section, 300);
      container.scrollTop = 20;
      const spy = vi.fn();
      container.scrollTo = spy;

      scrollToSection('#usage', container);

      // 20 (current) + (300 - 100) (offset within the container) = 220.
      expect(spy).toHaveBeenCalledWith({ top: 220, behavior: 'smooth' });
    });

    it('should do nothing for a missing target', () => {
      const spy = vi.spyOn(window, 'scrollTo');
      scrollToSection('#missing', document);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('hrefToId', () => {
    it('should strip the leading hash', () => {
      expect(hrefToId('#intro')).toBe('intro');
    });

    it('should decode URI components', () => {
      expect(hrefToId('#a%20b')).toBe('a b');
    });

    it('should pass through a bare id', () => {
      expect(hrefToId('intro')).toBe('intro');
    });
  });

  describe('clampLevel', () => {
    it('should default to level 1', () => {
      expect(clampLevel(undefined)).toBe(1);
    });

    it('should clamp to the 1..3 CSS budget', () => {
      expect(clampLevel(0)).toBe(1);
      expect(clampLevel(2)).toBe(2);
      expect(clampLevel(9)).toBe(3);
    });
  });
});
