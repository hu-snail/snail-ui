#!/usr/bin/env python3
"""Build the MiSans webfont subsets that apps/docs ships.

MiSans is distributed as 10 static weights, ~8 MB each (TTF, 29 093 glyphs).
Serving any of them whole is impossible for a docs site, so every face is
subset to the characters the site can actually render and compressed to WOFF2.

Per weight three Unicode-range tiers are emitted, so a page only downloads the
faces it genuinely needs:

  latin    Latin text, punctuation, symbols, CJK punctuation and fullwidth
           forms. Every page needs these (~25 KB).
  cjk      The CJK characters the docs use today (~180 KB). Only fetched by a
           page that actually renders Chinese — the English pages never are.
  cjk-ext  The rest of GB 2312 level 1 (~290 KB). Lazy insurance: fetched only
           when a page uses a common Chinese character the docs do not use yet,
           so new copy keeps rendering in MiSans instead of the OS fallback.

Weights emitted: 400 (body copy), 500 (section headings), 600 (page titles + bold).
MiSans' 600/700 read noticeably heavier than the OS CJK faces at the same CSS
weight, so the site is capped at Semibold rather than shipping the Bold cut.

Usage:
    python3 apps/docs/scripts/build-fonts.py --src /path/to/MiSans \
        [--script-src /path/to/AidianSignatureTi-Regular.ttf]

Requires a Python with `fonttools` and `brotli`
(`python3 -m pip install fonttools brotli`). This is a dev-time generator only:
nothing at build or runtime of the docs site depends on it.

Outputs (all regenerated, never hand-edited):
    .vitepress/theme/fonts/misans-*.woff2   + misans.generated.css
    .vitepress/theme/fonts/aidian-script-latin.woff2 + script.generated.css
"""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path

try:
    from fontTools import subset
    from fontTools.ttLib import TTFont
except ImportError:  # pragma: no cover - dev-time tool
    sys.exit(
        "fonttools is required: python3 -m pip install fonttools brotli",
    )

DOCS_ROOT = Path(__file__).resolve().parent.parent
FONT_DIR = DOCS_ROOT / ".vitepress" / "theme" / "fonts"
CSS_FILE = FONT_DIR / "misans.generated.css"
SCRIPT_CSS = FONT_DIR / "script.generated.css"

FONT_FAMILY = "MiSans Docs"

# Aidian SignatureTi is a hand-written script face with Latin-only coverage
# (120 glyphs: printable ASCII, zero CJK). It is a display accent for the
# English headline on the landing hero and nothing else — it may never be
# applied to running text, and Chinese must stay on MiSans.
SCRIPT_SOURCE = "AidianSignatureTi-Regular.ttf"
SCRIPT_FAMILY = "Aidian Script"
SCRIPT_DEST = "aidian-script-latin.woff2"

# The docs site only needs three cuts: body copy, section headings and the page
# title (+ bold runs). MiSans Semibold/Bold render noticeably heavier than the
# OS CJK faces at the same CSS weight, so headings sit on Medium and nothing
# asks for more than Semibold. Weights the site used to request above these
# (650 sidebar brand, 700 home hero) now resolve down to the nearest cut.
WEIGHTS = [
    (400, "MiSans-Regular"),
    (500, "MiSans-Medium"),
    (600, "MiSans-Semibold"),
]

# Blocks the `latin` tier owns. Kept separate from the CJK tiers so the English
# pages never pull the CJK payload, and explicit (non-overlapping) so a single
# family can hold several faces without range ambiguity.
LATIN_BLOCKS = [
    (0x0020, 0x007E),  # Basic Latin
    (0x00A0, 0x00FF),  # Latin-1 Supplement
    (0x0100, 0x017F),  # Latin Extended-A
    (0x2000, 0x206F),  # General Punctuation
    (0x2070, 0x209F),  # Super/subscripts
    (0x20A0, 0x20BF),  # Currency Symbols
    (0x2100, 0x214F),  # Letterlike Symbols
    (0x2190, 0x21FF),  # Arrows
    (0x2200, 0x22FF),  # Mathematical Operators
    (0x2460, 0x24FF),  # Enclosed Alphanumerics
    (0x25A0, 0x25FF),  # Geometric Shapes
    (0x2600, 0x27BF),  # Misc. Symbols + Dingbats
    (0x2B00, 0x2BFF),  # Misc. Symbols and Arrows
    (0x3000, 0x303F),  # CJK Symbols and Punctuation （，。「」
    (0xFE00, 0xFE0F),  # Variation Selectors
    (0xFE10, 0xFE1F),  # Vertical Forms
    (0xFE30, 0xFE4F),  # CJK Compatibility Forms
    (0xFF00, 0xFFEF),  # Halfwidth and Fullwidth Forms
]

SOURCE_EXTENSIONS = {
    ".md",
    ".vue",
    ".ts",
    ".mts",
    ".js",
    ".mjs",
    ".json",
    ".html",
    ".css",
    ".txt",
    ".yaml",
    ".yml",
}


def is_cjk(codepoint: int) -> bool:
    return (
        0x4E00 <= codepoint <= 0x9FFF
        or 0x3400 <= codepoint <= 0x4DBF
        or 0xF900 <= codepoint <= 0xFAFF
    )


def gb2312_level1() -> set[int]:
    """GB 2312 level-1 hanzi (3 755 常用字, rows 0xB0-0xD7)."""
    out: set[int] = set()
    for high in range(0xB0, 0xD8):
        for low in range(0xA1, 0xFF):
            try:
                out.add(ord(bytes((high, low)).decode("gb2312")))
            except UnicodeDecodeError:
                continue
    return out


SKIP_DIR_NAMES = {"node_modules", "dist", ".turbo", "cache", ".temp", "coverage"}


def collect_site_codepoints(root: Path) -> set[int]:
    """Every character that appears anywhere in the docs sources."""
    found: set[int] = set()
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIR_NAMES]
        for name in filenames:
            if name.startswith("._"):  # exFAT/network-volume AppleDouble junk
                continue
            if os.path.splitext(name)[1] not in SOURCE_EXTENSIONS:
                continue
            try:
                text = (Path(dirpath) / name).read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            found.update(ord(ch) for ch in text)
    return found


def expand_blocks(blocks: list[tuple[int, int]]) -> set[int]:
    return {cp for start, end in blocks for cp in range(start, end + 1)}


def to_unicode_range(codepoints: set[int]) -> str:
    """Coalesce a codepoint set into a compact `unicode-range` descriptor."""
    points = sorted(codepoints)
    if not points:
        return ""
    parts: list[str] = []
    start = prev = points[0]
    for cp in points[1:]:
        if cp == prev + 1:
            prev = cp
            continue
        parts.append(f"U+{start:04X}" if start == prev else f"U+{start:04X}-{prev:04X}")
        start = prev = cp
    parts.append(f"U+{start:04X}" if start == prev else f"U+{start:04X}-{prev:04X}")
    return ", ".join(parts)


def build_options() -> subset.Options:
    options = subset.Options()
    options.flavor = "woff2"
    options.hinting = False  # dropped: hinting never survived the WOFF2 pipeline
    options.desubroutinize = True
    options.glyph_names = False
    options.legacy_kern = False
    options.notdef_outline = False
    options.recalc_bounds = True
    # Keep the source `head.modified` instead of stamping "now": that stamp is
    # the only non-deterministic byte in the output, and a byte-stable build is
    # what lets a regenerated face be verified against the committed one.
    options.recalc_timestamp = False
    options.prune_unicode_ranges = True
    # Latin kerning + the substitutions CJK text relies on; nothing else is
    # needed and MiSans carries a lot of it.
    options.layout_features = ["kern", "liga", "clig", "calt", "ccmp", "locl"]
    options.name_IDs = ["*"]
    options.name_legacy = True
    options.name_languages = ["*"]
    if "DSIG" not in options.drop_tables:
        options.drop_tables.append("DSIG")  # invalid once the font is subset
    return options


def subset_face(
    src: Path, dest: Path, codepoints: set[int], options: subset.Options
) -> int:
    font = subset.load_font(str(src), options)
    try:
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=sorted(codepoints))
        subsetter.subset(font)
        subset.save_font(font, str(dest), options)
    finally:
        font.close()
    return dest.stat().st_size


def human(num_bytes: int) -> str:
    return f"{num_bytes / 1024:.0f} KB"


def build_script_face(src: Path, options: subset.Options) -> int:
    """Subset Aidian SignatureTi to printable ASCII and emit its @font-face sheet."""
    if not src.is_file():
        sys.exit(f"missing script font: {src}")

    probe = TTFont(str(src), lazy=True)
    try:
        available = set(probe.getBestCmap())
    finally:
        probe.close()

    wanted = set(range(0x0020, 0x007F))
    subset_cps = wanted & available
    dropped = sorted(wanted - available)
    if dropped:
        print(f"  warning: script font lacks {len(dropped)} ASCII codepoint(s)")

    dest = FONT_DIR / SCRIPT_DEST
    size = subset_face(src, dest, subset_cps, options)
    print(f"  {dest.name:34} {len(subset_cps):5d} glyphs  {human(size)}")

    SCRIPT_CSS.write_text(
        "\n".join(
            [
                "/* GENERATED FILE — do not edit.",
                " *",
                " * Aidian SignatureTi — a hand-written display face, Latin only",
                " * (printable ASCII, no CJK). Built by apps/docs/scripts/build-fonts.py",
                " * from the upstream TTF.",
                " *",
                " * Display use only: the landing hero headline and nothing else. It has",
                " * no CJK and no bold, so any Chinese in a heading that uses this family",
                " * must be handed to MiSans explicitly (see SnDocsHome.vue).",
                " */",
                "",
                "@font-face {",
                f"  font-family: '{SCRIPT_FAMILY}';",
                "  font-style: normal;",
                "  font-weight: 400;",
                "  font-display: swap;",
                f"  src: url('./{SCRIPT_DEST}') format('woff2');",
                f"  unicode-range: {to_unicode_range(subset_cps)};",
                "}",
                "",
            ]
        ),
        encoding="utf-8",
    )
    return size


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--src",
        required=True,
        help="Directory holding the original MiSans-*.ttf files",
    )
    parser.add_argument(
        "--docs-root",
        default=str(DOCS_ROOT),
        help="Docs site root scanned for the characters in use (default: apps/docs)",
    )
    parser.add_argument(
        "--script-src",
        default=None,
        help="Path to AidianSignatureTi-Regular.ttf (enables the display accent)",
    )
    args = parser.parse_args()

    src_dir = Path(args.src).expanduser().resolve()
    for _, stem in WEIGHTS:
        if not (src_dir / f"{stem}.ttf").is_file():
            sys.exit(f"missing source font: {src_dir / (stem + '.ttf')}")

    # --- 1. The three tiers -------------------------------------------------
    site = collect_site_codepoints(Path(args.docs_root).resolve())
    cmap = set()
    probe = TTFont(str(src_dir / f"{WEIGHTS[0][1]}.ttf"), lazy=True)
    try:
        cmap = set(probe.getBestCmap())
    finally:
        probe.close()

    latin_wanted = expand_blocks(LATIN_BLOCKS) | {cp for cp in site if not is_cjk(cp)}
    docs_cjk = {cp for cp in site if is_cjk(cp)}
    gb1 = gb2312_level1()

    tiers = {
        # Only real glyphs are kept, but the declared range stays the full block
        # list so punctuation/symbol coverage never depends on today's copy.
        "latin": (latin_wanted & cmap, expand_blocks(LATIN_BLOCKS) | (latin_wanted & cmap)),
        "cjk": (docs_cjk & cmap, docs_cjk & cmap),
        "cjk-ext": ((gb1 - docs_cjk) & cmap, (gb1 - docs_cjk) & cmap),
    }

    missing = sorted(cp for cp in site if cp not in cmap and cp > 0x20)
    if missing:
        print(
            "warning: {} site character(s) are absent from MiSans and will fall "
            "back to the OS font: {}".format(
                len(missing), " ".join(chr(cp) for cp in missing[:40])
            )
        )

    # --- 2. Subset + compress ---------------------------------------------
    FONT_DIR.mkdir(parents=True, exist_ok=True)
    options = build_options()
    report: list[tuple[str, int]] = []

    expected = {
        f"misans-{weight}-{tier}.woff2" for weight, _stem in WEIGHTS for tier in tiers
    }

    for weight, stem in WEIGHTS:
        for tier, (subset_cps, _ranges) in tiers.items():
            dest = FONT_DIR / f"misans-{weight}-{tier}.woff2"
            size = subset_face(src_dir / f"{stem}.ttf", dest, subset_cps, options)
            report.append((dest.name, size))
            print(f"  {dest.name:34} {len(subset_cps):5d} glyphs  {human(size)}")
    # A weight dropped from WEIGHTS must not linger: the generated CSS stops
    # referencing it, but a leftover .woff2 would still ship in the build.
    for stale in sorted(FONT_DIR.glob("misans-*.woff2")):
        if stale.name not in expected:
            stale.unlink()
            print(f"  removed stale {stale.name}")


    # --- 3. @font-face sheet ----------------------------------------------
    lines = [
        "/* GENERATED FILE — do not edit.",
        " *",
        " * Produced by apps/docs/scripts/build-fonts.py from the upstream MiSans",
        " * TTFs. Regenerate with:",
        " *",
        " *     python3 apps/docs/scripts/build-fonts.py --src <MiSans dir>",
        " *",
        " * One face per weight × Unicode tier. The tiers are what keeps a",
        " * self-hosted CJK font affordable: `latin` is a few KB and always used,",
        " * `cjk` covers the characters the docs use, and `cjk-ext` covers the rest",
        " * of GB 2312 level 1 and is only fetched when a page needs a character",
        " * the docs do not use yet.",
        " */",
        "",
    ]
    for weight, _stem in WEIGHTS:
        for tier, (_subset_cps, ranges) in tiers.items():
            lines += [
                "@font-face {",
                f"  font-family: '{FONT_FAMILY}';",
                "  font-style: normal;",
                f"  font-weight: {weight};",
                "  font-display: swap;",
                f"  src: url('./misans-{weight}-{tier}.woff2') format('woff2');",
                f"  unicode-range: {to_unicode_range(ranges)};",
                "}",
                "",
            ]
    CSS_FILE.write_text("\n".join(lines), encoding="utf-8")

    # --- 4. The script display accent --------------------------------------
    if args.script_src:
        script_total = build_script_face(Path(args.script_src).expanduser().resolve(), options)
        report.append((SCRIPT_DEST, script_total))

    total = sum(size for _, size in report)
    print(
        f"\n{len(report)} files, {human(total)} total; wrote "
        f"{CSS_FILE.relative_to(DOCS_ROOT)}"
        + (f" + {SCRIPT_CSS.relative_to(DOCS_ROOT)}" if args.script_src else "")
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
