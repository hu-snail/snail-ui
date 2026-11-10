/** Form · Web (Web) — English page data. Props from form SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const formDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Form · Web' }],
  title: 'Form · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Form orchestrator ' },
    { t: 'code', s: 'SnForm' },
    { t: 'text', s: ' + field wrapper ' },
    { t: 'code', s: 'SnFormItem' },
    { t: 'text', s: '. Provide/inject plumbing, unified validate / reset / submit.' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/form',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Form · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Form } from '@snui/vue-web';
</script>

<template>
  <Form />
</template>`,
  },
  demos: [
    { name: 'form-basic', title: 'Basic', blurb: 'Basic model + v-model + submit handler.' },
    {
      name: 'form-rules',
      title: 'FormRule (validation)',
      blurb: 'Every FormRule kind: required / type / pattern / length / custom validator / async.',
    },
    {
      name: 'form-label',
      title: 'Label position & width',
      blurb: 'labelPosition: left / right / top + labelWidth.',
    },
    {
      name: 'form-icon',
      title: 'Inline label icon',
      blurb: 'icon / iconName props render an icon inside the label (SnIcon + lucide).',
    },
    {
      name: 'form-reset-submit',
      title: 'Reset / validate / submit',
      blurb:
        'formRef.validate() / validateField() / resetFields() / clearValidate(), html-type submit.',
    },
    {
      name: 'form-disabled',
      title: 'Disabled form',
      blurb: 'SnForm.disabled cascades into every FormItem.',
    },
    {
      name: 'form-cell',
      title: 'Cell-style (border / ellipsis / clickable / isLink)',
      blurb:
        'Cell list: border divider, ellipsis long label, clickable row + click event, isLink right arrow, placeholder, description.',
    },
    {
      name: 'form-cell-style',
      title: 'Form-level size / valueAlign / asteriskPosition / hideAsterisk',
      blurb:
        'Form-level defaults: size / valueAlign / asteriskPosition / hideAsterisk cascade to all FormItems.',
    },
    {
      name: 'form-validation-flow',
      title: 'validateTrigger / resetOnChange / errorType',
      blurb:
        "validateTrigger 'blur' | 'change'; resetOnChange clears after submit; errorType 'message' | 'toast' | 'none'.",
    },
    {
      name: 'form-web-assembly',
      title: 'Composite form: date / radio / checkbox / selectors',
      blurb:
        'Select / radio / checkbox / number / date / time / switch with unified validation + submit.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'model',
        type: 'Record<string, unknown>',
        default: '—',
        desc: 'Reactive model the form validates. Items read from here and write back via v-model on SnInput (or the equivalent).',
      },
      {
        name: 'rules',
        type: 'FormRules',
        default: '() => ({})',
        desc: 'Validation rules keyed by field `prop` (matches SnFormItem.prop).',
      },
      {
        name: 'novalidate',
        type: 'boolean',
        default: 'true',
        desc: 'Native form novalidate — disable browser HTML5 validation.',
      },
      {
        name: 'showMessage',
        type: 'boolean',
        default: 'true',
        desc: 'Show the message line below each FormItem.',
      },
      {
        name: 'statusIcon',
        type: 'boolean',
        default: 'false',
        desc: 'Show an icon next to the message (success / warning / error).',
      },
      {
        name: 'labelPosition',
        type: "'left' | 'right' | 'top'",
        default: "'right'",
        desc: 'Label position for child FormItems.',
      },
      {
        name: 'labelWidth',
        type: 'number | string',
        default: "'auto'",
        desc: 'Label width for child FormItems (number = px, string = CSS length).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable the entire form — propagated to every FormItem.',
      },
      {
        name: 'validateTrigger',
        type: "'blur' | 'change'",
        default: "'blur'",
        desc: 'When to fire field-level validation. `blur` validates on blur; `change` validates on every input change. Defaults to `blur`.',
      },
      {
        name: 'resetOnChange',
        type: 'boolean',
        default: 'true',
        desc: "Reset every field's error state when the model is mutated externally (e.g. after a successful submit). Defaults to `true` to mirror Element Plus / Ant Design forms.",
      },
      {
        name: 'errorType',
        type: "'message' | 'toast' | 'none'",
        default: "'message'",
        desc: 'Error display strategy: - `message` — inline message under the offending field (default) - `toast`   — emit `validate` event and let the host show a toast - `none`    — silently validate (return value is still authoritative)',
      },
      {
        name: 'border',
        type: 'boolean',
        default: 'false',
        desc: 'Add a horizontal divider between every FormItem.',
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
        desc: 'Right-align the field value within the cell (when items render as a list / menu). Mirrors wd-form `value-align`.',
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
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Form · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Form } from '@snui/vue-web';",
    chipCopy: "import { Form } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Form', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'rate', link: '/en/components/web/rate' },
    next: { text: 'transfer', link: '/en/components/web/transfer' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
