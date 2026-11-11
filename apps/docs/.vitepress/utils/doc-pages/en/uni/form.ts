/** Form (uni-app) — English page data. Props from sn-form.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const formDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Form' }],
  title: 'Form',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Hand ' },
    { t: 'code', s: 'model' },
    { t: 'text', s: " to the form and declare each field's path through " },
    { t: 'code', s: 'prop' },
    { t: 'text', s: '. On submit the whole form validates first, then the ' },
    { t: 'code', s: 'submit' },
    { t: 'text', s: ' event reports the result:' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-form',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Form.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Form } from '@snui/uni';
</script>

<template>
  <sn-form />
</template>`,
  },
  demos: [
    {
      name: 'form-mp-basic',
      title: 'Basic',
      blurb: 'model + v-model binding; full-form validation on submit; @submit reports valid.',
    },
    {
      name: 'form-mp-form-type',
      title: 'Form shapes: submit / reset',
      blurb:
        'Submit shape: submit() → validate → @submit; reset shape: resetFields() back to the initial snapshot.',
    },
    {
      name: 'form-mp-guard',
      title: 'Submit interception',
      blurb:
        'A failed validation blocks the data (counted as blocked); fixing the field lets the next submit pass.',
    },
    {
      name: 'form-mp-fields',
      title: 'Field type matrix',
      blurb:
        'text / digit / password / textarea / nested path profile.city / checkbox-group / switch in one form.',
    },
    {
      name: 'form-mp-custom',
      title: 'Custom slots',
      blurb:
        'label slot for a composite label, default slot for a custom priority picker, description slot for custom helper copy.',
    },
    {
      name: 'form-mp-status-icon',
      title: 'Status icon (statusIcon)',
      blurb: 'statusIcon: a glyph precedes the message.',
    },
    {
      name: 'form-mp-message-display',
      title: 'Error message display strategies',
      blurb: 'showMessage=false drops the message row / errorType=none silences it.',
    },
    {
      name: 'form-mp-disabled',
      title: 'Disabled form',
      blurb:
        'SnForm.disabled cascades into every FormItem; the submit button is disabled with them.',
    },
    {
      name: 'form-mp-cell-border',
      title: 'Cell dividers & truncation',
      blurb: 'border divider / ellipsis truncation.',
    },
    {
      name: 'form-mp-cell-clickable',
      title: 'Tappable rows (clickable / isLink)',
      blurb: 'clickable + isLink: the whole row is tappable and shows the arrow.',
    },
    {
      name: 'form-mp-cell-text',
      title: 'Placeholder & helper copy',
      blurb: 'placeholder fallback for empty rows / description helper copy.',
    },
    {
      name: 'form-mp-size',
      title: 'Size',
      blurb: 'size scaling: default medium vs size="small".',
    },
    {
      name: 'form-mp-value-align',
      title: 'Value alignment (valueAlign)',
      blurb: 'valueAlign right.',
    },
    {
      name: 'form-mp-asterisk',
      title: 'Required asterisk (asteriskPosition / hideAsterisk)',
      blurb: 'asteriskPosition and hideAsterisk.',
    },
    {
      name: 'form-mp-icon',
      title: 'Inline label icons',
      blurb: 'iconName from the registry; inline iconData SVG; iconSize scaling one icon.',
    },
    {
      name: 'form-mp-label',
      title: 'Label position and column width',
      blurb: 'labelPosition left / right / top × labelWidth.',
    },
    {
      name: 'form-mp-reset-submit',
      title: 'Reset and clear validation',
      blurb: 'resetFields / clearValidate / validate side by side, with the current values echoed.',
    },
    {
      name: 'form-mp-rules',
      title: 'Validation rules (FormRule)',
      blurb:
        'required / type / pattern / minLength+maxLength / min+max / validator / asyncValidator.',
    },
    {
      name: 'form-mp-validate',
      title: 'Programmatic validation',
      blurb:
        'validate() / validateField(prop) / validateField([props]) / clearValidate(prop), with the @validate error map echoed.',
    },
    {
      name: 'form-mp-title-width',
      title: 'Label column width (titleWidth)',
      blurb: 'titleWidth column.',
    },
    {
      name: 'form-mp-layout',
      title: 'Arrangement (layout / center)',
      blurb: 'layout horizontal vs vertical / center.',
    },
    {
      name: 'form-mp-schema',
      title: 'Form schema',
      blurb: 'schema on the context.',
    },
    {
      name: 'form-mp-validation-flow',
      title: 'Validation order',
      blurb:
        'Item-level rules (required → async) run first, then the form-level rules (pattern / type).',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'model', type: 'Record<string, unknown>', default: '—', desc: 'model' },
      { name: 'rules', type: 'FormRules', default: '() => ({})', desc: 'rules' },
      { name: 'showMessage', type: 'boolean', default: 'true', desc: 'showMessage' },
      { name: 'statusIcon', type: 'boolean', default: 'false', desc: 'statusIcon' },
      {
        name: 'labelPosition',
        type: "'left' | 'right' | 'top'",
        default: "'right'",
        desc: 'labelPosition',
      },
      { name: 'labelWidth', type: 'number | string', default: "'auto'", desc: 'labelWidth' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'disabled' },
      {
        name: 'validateTrigger',
        type: "'blur' | 'change'",
        default: "'blur'",
        desc: 'When to fire field-level validation.',
      },
      {
        name: 'resetOnChange',
        type: 'boolean',
        default: 'true',
        desc: "Reset every field's error state when the model is mutated externally.",
      },
      {
        name: 'errorType',
        type: "'message' | 'toast' | 'none'",
        default: "'message'",
        desc: 'Error display strategy: inline message / toast / silent.',
      },
      {
        name: 'border',
        type: 'boolean',
        default: 'false',
        desc: 'Add a hairline divider under every FormItem.',
      },
      {
        name: 'center',
        type: 'boolean',
        default: 'false',
        desc: "Vertically center every FormItem's control column.",
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Default size for descendant FormItems.',
      },
      {
        name: 'valueAlign',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Right-align the field value column (Cell-style menus).',
      },
      {
        name: 'asteriskPosition',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Asterisk position for required fields.',
      },
      {
        name: 'hideAsterisk',
        type: 'boolean',
        default: 'false',
        desc: 'Hide the asterisk on required fields.',
      },
      {
        name: 'ellipsis',
        type: 'boolean',
        default: 'false',
        desc: 'Truncate long labels with ellipsis.',
      },
      {
        name: 'schema',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: 'Form-level validation schema (`wd-form` `schema`). Declared for parity; rules are still supplied through `rules` / per-item `rules`, so this object is stored on the context and never interpreted here.',
      },
      {
        name: 'titleWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Left title column width (`wd-form` `title-width`). Inherited by items.',
      },
      {
        name: 'layout',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: 'Cell layout (`wd-form` `layout`): `horizontal` puts label and control side by side, `vertical` stacks them. Inherited by items.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Form ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Form } from '@snui/uni';",
    chipCopy: "import { Form } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-form', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-popover', link: '/en/components/uni/popover' },
    next: { text: 'sn-input', link: '/en/components/uni/input' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
