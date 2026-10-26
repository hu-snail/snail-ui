import { describe, it, expect } from 'vitest'
import { createMcpServer } from './mcp/server.js'
import { SKILL_VERSION, loadSkill } from './skill/skill.js'
import { buildAiMeta } from './meta/aggregator.js'

describe('@snui/ai', () => {
  describe('MCP server stub', () => {
    it('registers 4 tools', () => {
      const server = createMcpServer()
      expect(Object.keys(server.tools)).toEqual(
        expect.arrayContaining(['list_components', 'get_component_meta', 'get_style_pack', 'render_preview']),
      )
    })

    it('list_components returns SnButton + SnConfigProvider for web', async () => {
      const server = createMcpServer()
      const out = await server.dispatch('list_components', { end: 'web' })
      const names = (out as { components: Array<{ name: string }> }).components.map((c) => c.name)
      expect(names).toContain('SnButton')
      expect(names).toContain('SnConfigProvider')
    })

    it('get_component_meta returns full meta for SnButton', async () => {
      const server = createMcpServer()
      const meta = (await server.dispatch('get_component_meta', {
        name: 'SnButton',
        end: 'web',
      })) as { props: Array<{ name: string }> }
      const propNames = meta.props.map((p) => p.name)
      expect(propNames).toContain('type')
      expect(propNames).toContain('size')
    })

    it('get_style_pack returns snippet for ios', async () => {
      const server = createMcpServer()
      const pack = (await server.dispatch('get_style_pack', { name: 'ios' })) as { snippet: string }
      expect(pack.snippet).toContain('iosPack')
    })

    it('render_preview returns success=false (M3 stub)', async () => {
      const server = createMcpServer()
      const out = (await server.dispatch('render_preview', {
        vueCode: '<template></template>',
      })) as { success: boolean; error: string }
      expect(out.success).toBe(false)
      expect(out.error).toMatch(/not implemented/i)
    })

    it('throws on unknown tool name', async () => {
      const server = createMcpServer()
      await expect(server.dispatch('nope', {})).rejects.toThrow('unknown tool')
    })
  })

  describe('Skill loader', () => {
    it('exposes a non-empty skill string', () => {
      const text = loadSkill()
      expect(text.length).toBeGreaterThan(500)
      expect(text).toContain('snail-aui')
    })

    it('SKILL_VERSION is a semver-shaped string', () => {
      expect(SKILL_VERSION).toMatch(/^\d+\.\d+\.\d+$/)
    })
  })

  describe('ai-meta builder', () => {
    it('produces version + generated + 4 sections', () => {
      const meta = buildAiMeta(new Date('2026-10-03T00:00:00Z'))
      expect(meta.version).toBe('1.0')
      expect(meta.generated).toBe('2026-10-03T00:00:00.000Z')
      expect(meta.web.library).toBe('@snui/vue-web')
      expect(meta.uni.library).toBe('@snui/uni')
      expect(meta.stylePacks.length).toBeGreaterThan(0)
      expect(meta.tokens.semantic).toContain('--sn-color-action-primary')
      expect(meta.tokens.component).toContain('--sn-button-radius')
    })
  })
})