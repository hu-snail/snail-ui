import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { defineComponentContract, type ComponentContract } from './component-contract.js';
import { ButtonContract, ButtonPropsSchema } from './button-contract.js';

describe('@snui/protocol — ComponentContract', () => {
  describe('defineComponentContract', () => {
    it('returns a frozen object', () => {
      const c = defineComponentContract<unknown>({
        name: 'sample',
        version: '1.0.0',
        props: z.unknown(),
        events: {},
        tokens: {},
        accessibility: { role: 'generic', keyboard: [] },
        capabilities: [],
      });
      expect(Object.isFrozen(c)).toBe(true);
    });

    it('rejects non-semver version', () => {
      expect(() =>
        defineComponentContract<unknown>({
          name: 'sample',
          version: '1.0',
          props: z.unknown(),
          events: {},
          tokens: {},
          accessibility: { role: 'generic', keyboard: [] },
          capabilities: [],
        }),
      ).toThrow(/semver/);
    });

    it('rejects non-kebab-case name', () => {
      expect(() =>
        defineComponentContract<unknown>({
          name: 'SampleName',
          version: '1.0.0',
          props: z.unknown(),
          events: {},
          tokens: {},
          accessibility: { role: 'generic', keyboard: [] },
          capabilities: [],
        }),
      ).toThrow(/kebab/);
    });
  });

  describe('Button satisfies ComponentContract<ButtonProps>', () => {
    it('has the required fields per AGENTS.md §31', () => {
      expect(ButtonContract.name).toBe('button');
      expect(ButtonContract.version).toMatch(/^\d+\.\d+\.\d+/);
      expect(ButtonContract.props).toBe(ButtonPropsSchema);
      expect(ButtonContract.tokens).toBeDefined();
      expect(ButtonContract.accessibility.role).toBe('button');
      expect(ButtonContract.capabilities).toContain('click');
      expect(ButtonContract.ai?.patchable).toContain('variant');
      expect(ButtonContract.ai?.readonly).toContain('role');
    });

    it('passes type check as ComponentContract<ButtonProps>', () => {
      // This block exists at compile time: re-assert the type explicitly.
      const _typed: ComponentContract<z.infer<typeof ButtonPropsSchema>> = ButtonContract;
      expect(_typed.name).toBe('button');
    });

    it('runtime metadata lines up with the schema keys', () => {
      const schemaKeys = Object.keys(ButtonPropsSchema.shape).sort();
      const patchable = [...(ButtonContract.ai?.patchable ?? [])].sort();
      // Every patchable AI field must exist in the schema (no phantom fields).
      for (const k of patchable) {
        expect(schemaKeys).toContain(k);
      }
    });
  });
});