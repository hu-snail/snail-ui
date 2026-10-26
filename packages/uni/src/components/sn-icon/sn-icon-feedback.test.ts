import { describe, expect, it } from 'vitest';
import {
  FeedbackDanger,
  FeedbackInfo,
  FeedbackSuccess,
  FeedbackWarning,
  resolveFeedbackIcon,
} from './sn-icon-feedback';
import type { IconData } from './sn-icon.vue';

/**
 * The feedback glyphs are the semantic status marks rendered by sn-dialog /
 * sn-toast / sn-notify / sn-notice-bar / sn-loadmore. The lookup contract is
 * keyed by the `type` string those components expose; unknown names must
 * return null so the caller can fall back to a registry lookup.
 */
describe('sn-icon-feedback', () => {
  it('resolves every documented status name to icon data', () => {
    for (const name of ['success', 'info', 'warning', 'danger'] as const) {
      const icon = resolveFeedbackIcon(name);
      expect(icon, name).not.toBeNull();
      expect(icon?.viewBox).toBe('0 0 24 24');
      expect(icon?.paths.length).toBeGreaterThan(0);
    }
  });

  it('maps the error alias onto the danger glyph', () => {
    expect(resolveFeedbackIcon('error')).toBe(FeedbackDanger);
  });

  it('returns null for unknown names so callers can fall back to the registry', () => {
    expect(resolveFeedbackIcon('nope')).toBeNull();
    expect(resolveFeedbackIcon('')).toBeNull();
  });

  it('exposes each glyph as importable IconData (bare path data, no element markup)', () => {
    const glyphs: [string, IconData][] = [
      ['success', FeedbackSuccess],
      ['info', FeedbackInfo],
      ['warning', FeedbackWarning],
      ['danger', FeedbackDanger],
    ];
    for (const [name, icon] of glyphs) {
      for (const d of icon.paths) {
        expect(d.startsWith('<'), `${name} path must be bare d data`).toBe(false);
      }
    }
  });
});
