/**
 * llms-txt generator unit tests.
 */

import { describe, it, expect } from 'vitest'
import { parseAiDescription } from './llms-txt.js'

// Note: pipes inside TypeScript union types are escaped with `\|` because the
// sample is a real Markdown table. We build the string by joining literal
// segments to avoid the `\|` regex escape tripping ESLint's no-useless-escape.
const PIPE = '|'
const BACKSLASH = '\\'
const SAMPLE_BUTTON_MD = [
  '# SnButton — AI-Friendly Component Description',
  '',
  '> Human-readable description. Primary button component.',
  '',
  '## Purpose',
  '',
  'Trigger actions.',
  '',
  '## Props',
  '',
  `${PIPE} Name ${PIPE} Type ${PIPE} Default ${PIPE} Description ${PIPE}`,
  `${PIPE}---${PIPE}---${PIPE}---${PIPE}---${PIPE}`,
  `${PIPE} type ${PIPE} 'primary' ${BACKSLASH}${PIPE} 'default' ${PIPE} 'default' ${PIPE} Variant. ${PIPE}`,
  `${PIPE} size ${PIPE} 'small' ${BACKSLASH}${PIPE} 'medium' ${BACKSLASH}${PIPE} 'large' ${PIPE} 'medium' ${PIPE} Size. ${PIPE}`,
  '',
  '## Events',
  '',
  `${PIPE} Name ${PIPE} Payload ${PIPE} Description ${PIPE}`,
  `${PIPE}---${PIPE}---${PIPE}---${PIPE}`,
  `${PIPE} click ${PIPE} (event: MouseEvent) => void ${PIPE} Fired on click. ${PIPE}`,
  '',
  '## Slots',
  '',
  `${PIPE} Name ${PIPE} Description ${PIPE}`,
  `${PIPE}---${PIPE}---${PIPE}`,
  `${PIPE} default ${PIPE} Button label. ${PIPE}`,
  '',
  '## Tokens Consumed',
  '',
  `${PIPE} Token ${PIPE} CSS Variable ${PIPE}`,
  `${PIPE}---${PIPE}---${PIPE}`,
  `${PIPE} --sn-color-action-primary ${PIPE} action primary ${PIPE}`,
  '',
].join('\n')

describe('parseAiDescription', () => {
  it('extracts description from blockquote', () => {
    const parsed = parseAiDescription(SAMPLE_BUTTON_MD)
    expect(parsed.description).toContain('Primary button')
  })

  it('extracts props', () => {
    const parsed = parseAiDescription(SAMPLE_BUTTON_MD)
    expect(parsed.props).toHaveLength(2)
    expect(parsed.props[0]).toEqual({ name: 'type', type: "'primary' | 'default'" })
  })

  it('extracts events', () => {
    const parsed = parseAiDescription(SAMPLE_BUTTON_MD)
    expect(parsed.events).toHaveLength(1)
    expect(parsed.events[0]?.name).toBe('click')
  })

  it('extracts slots', () => {
    const parsed = parseAiDescription(SAMPLE_BUTTON_MD)
    expect(parsed.slots).toContain('default')
  })

  it('extracts tokens', () => {
    const parsed = parseAiDescription(SAMPLE_BUTTON_MD)
    expect(parsed.tokens).toContain('--sn-color-action-primary')
  })

  it('handles empty input', () => {
    const parsed = parseAiDescription('')
    expect(parsed.props).toEqual([])
    expect(parsed.events).toEqual([])
    expect(parsed.slots).toEqual([])
    expect(parsed.tokens).toEqual([])
  })
})
