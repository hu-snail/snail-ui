/**
 * Read a page's own Markdown source back out of its hidden carrier element.
 *
 * `config.ts` embeds every page's raw Markdown as
 * `<div hidden data-sn-doc-source="…">` so "copy this page" hands over exactly
 * what the author wrote — headings, prose and `<Demo />` tags included.
 *
 * The payload is base64 (see `utils/raw-doc-source.ts` for why escaping alone
 * is not enough: Vue's template tokenizer re-parses attribute values, so any
 * `<` in the Markdown collides with the page's own attribute names). Decoding
 * is the exact inverse — base64 → UTF-8 bytes → string.
 */
import { RAW_DOC_SOURCE_ATTR } from './raw-doc-source';

const SOURCE_SELECTOR = `div[${RAW_DOC_SOURCE_ATTR}]`;

export function readPageSource(): string {
  const el = document.querySelector<HTMLElement>(SOURCE_SELECTOR);
  const payload = el ? el.getAttribute(RAW_DOC_SOURCE_ATTR) : null;
  if (!payload) return '';

  try {
    const binary = atob(payload);
    const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return '';
  }
}

/**
 * `navigator.clipboard` only exists in a secure context, and it can also be
 * present yet reject (permissions policy). The published site is https, but an
 * `http://` preview — or an embedded context — would otherwise fail every time.
 * The fallback uses the selection-based copy, which still works there; no
 * `await` runs before `execCommand`, so the call stays inside the click's
 * user-gesture window.
 */
export async function writeClipboardText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // fall through to the legacy path
    }
  }

  const scratch = document.createElement('textarea');
  scratch.value = text;
  scratch.setAttribute('readonly', '');
  // Off-screen but still selectable — `display: none` could not be selected.
  scratch.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
  document.body.appendChild(scratch);
  try {
    scratch.select();
    if (!document.execCommand('copy')) throw new Error('copy rejected');
  } finally {
    document.body.removeChild(scratch);
  }
}
