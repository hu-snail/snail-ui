/**
 * Static component index — feeds the docs site's Cmd+K command palette.
 *
 * Why a hand-maintained index instead of scanning demo files at build time?
 *   - 5 components + ~60 demo files is small enough to author manually
 *   - Gives us control over display labels, search keywords, and zh/en
 *     paths without parsing frontmatter
 *   - Demo filenames follow `<comp>-<kind>.vue` convention but the
 *     reverse mapping (filename → human-readable label) needs authoring
 *     anyway; a flat file is the simplest place to do that
 *
 * Update this file when a new component ships, when a demo filename
 * changes, or when new search keywords need surfacing.
 */

export interface ComponentEntry {
  /** Public API name (PascalCase). */
  name: string
  /** zh display label (e.g. "Button 按钮"). */
  label: string
  /** en display label. */
  labelEn: string
  /** Which end. */
  end: 'web' | 'uni'
  /** zh doc path. */
  path: string
  /** en doc path. */
  enPath: string
  /** Demo file basenames (no .vue) under apps/docs/.vitepress/demo/. */
  demos: string[]
  /** Optional extra keywords for fuzzy search. */
  keywords?: string[]
}

export const COMPONENT_INDEX: ReadonlyArray<ComponentEntry> = [
  {
    name: 'SnButton',
    label: 'Button 按钮',
    labelEn: 'Button',
    end: 'web',
    path: '/components/web/button',
    enPath: '/en/components/web/button',
    demos: [
      'button-web-basic',
      'button-web-size',
      'button-web-shape',
      'button-web-state',
      'button-web-variant',
      'button-web-emphasis',
      'button-web-color',
      'button-web-tag',
      'button-web-doodle',
      'button-web-icon-placement',
      'button-web-attr-type',
    ],
    keywords: ['按钮', 'cta', 'click', '提交'],
  },
  {
    name: 'SnDivider',
    label: 'Divider 分割线',
    labelEn: 'Divider',
    end: 'web',
    path: '/components/web/divider',
    enPath: '/en/components/web/divider',
    demos: ['divider-web'],
    keywords: ['分割', 'hr', 'separator', 'line'],
  },
  {
    name: 'SnIcon',
    label: 'Icon 图标',
    labelEn: 'Icon',
    end: 'web',
    path: '/components/web/icon',
    enPath: '/en/components/web/icon',
    demos: ['icon-web-basic', 'icon-web-size', 'icon-web-registry'],
    keywords: ['图标', 'lucide', 'svg', 'glyph'],
  },
  {
    name: 'SnInput',
    label: 'Input 输入框',
    labelEn: 'Input',
    end: 'web',
    path: '/components/web/input',
    enPath: '/en/components/web/input',
    demos: ['input-web-password-toggle', 'input-web-prefix-suffix', 'input-web-align-compact', 'input-web-custom'],
    keywords: ['输入', '文本框', 'textfield', 'form'],
  },
  {
    name: 'SnForm',
    label: 'Form 表单',
    labelEn: 'Form',
    end: 'web',
    path: '/components/web/form',
    enPath: '/en/components/web/form',
    demos: ['form-cell', 'form-cell-style', 'form-validation-flow'],
    keywords: ['表单', '校验', 'validation', 'field'],
  },
  {
    name: 'SnCard',
    label: 'Card 卡片',
    labelEn: 'Card',
    end: 'web',
    path: '/components/web/card',
    enPath: '/en/components/web/card',
    demos: ['card-web'],
    keywords: ['卡片', 'panel', 'container'],
  },
  {
    name: 'sn-button',
    label: 'sn-button 按钮',
    labelEn: 'sn-button',
    end: 'uni',
    path: '/components/uni/button',
    enPath: '/en/components/uni/button',
    demos: [
      'button-mp-basic',
      'button-mp-size',
      'button-mp-shape',
      'button-mp-state',
      'button-mp-variant',
      'button-mp-cell',
      'button-mp-custom',
      'button-mp-open-type',
      'button-mp-hover',
      'button-mp-form-type',
    ],
    keywords: ['按钮', 'cta', 'uni', '小程序'],
  },
  {
    name: 'sn-divider',
    label: 'sn-divider 分割线',
    labelEn: 'sn-divider',
    end: 'uni',
    path: '/components/uni/divider',
    enPath: '/en/components/uni/divider',
    demos: ['divider-mp'],
    keywords: ['分割', 'uni', '小程序'],
  },
  {
    name: 'sn-icon',
    label: 'sn-icon 图标',
    labelEn: 'sn-icon',
    end: 'uni',
    path: '/components/uni/icon',
    enPath: '/en/components/uni/icon',
    demos: ['icon-mp-basic', 'icon-mp-size', 'icon-mp-registry'],
    keywords: ['图标', 'uni', '小程序'],
  },
  {
    name: 'sn-input',
    label: 'sn-input 输入框',
    labelEn: 'sn-input',
    end: 'uni',
    path: '/components/uni/input',
    enPath: '/en/components/uni/input',
    demos: [
      'input-mp-basic',
      'input-mp-types',
      'input-mp-sizes',
      'input-mp-states',
      'input-mp-password-toggle',
      'input-mp-prefix-suffix',
      'input-mp-align-compact',
      'input-mp-runtime',
      'input-mp-bordered-bg-radius',
      'input-mp-clearable-count',
      'input-mp-slots',
      'input-mp-status',
    ],
    keywords: ['输入', 'uni', '小程序'],
  },
  {
    name: 'sn-form',
    label: 'sn-form 表单',
    labelEn: 'sn-form',
    end: 'uni',
    path: '/components/uni/form',
    enPath: '/en/components/uni/form',
    demos: [
      'form-mp-basic',
      'form-mp-cell',
      'form-mp-cell-style',
      'form-mp-rules',
      'form-mp-validation-flow',
      'form-mp-reset-submit',
      'form-mp-label',
      'form-mp-disabled',
      'form-mp-icon',
    ],
    keywords: ['表单', '校验', 'uni', '小程序'],
  },
]
