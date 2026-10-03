import { z } from 'zod';

/**
 * AUI UICapability — declarative capability/fallback declaration on a UINode.
 *
 * Per AUI-PROTOCOL-006 acceptance: platform / framework / feature / fallback.
 * Per AGENTS.md §59, capability detection lives in renderer; schema only
 * declares WHAT is needed and WHAT is the fallback. Resolution happens at
 * mount time in AUI-UNI-001 / cross-platform layer.
 *
 * Per AGENTS.md §84-85, fallback MUST be explicit and predictable (silent
 * behavior changes are forbidden). The schema enforces declared fallback as
 * a concrete component-type identifier.
 *
 * Forward references:
 *   - platform enum canonicalization  → AUI-UNI-001 (renderer detection)
 *   - requires list semantics → capability grammar (Phase 3)
 *   - fallback runtime resolution → AUI-WEB-001 / AUI-UNI-001
 */

const PLATFORM_ENUM = [
  'web',
  'h5',
  'mp-weixin',
  'mp-alipay',
  'mp-baidu',
  'mp-toutiao',
  'app',
  'ios',
  'android',
] as const;

const FRAMEWORK_ENUM = ['vue', 'react', 'flutter'] as const;

export const UICapabilitySchema = z
  .object({
    platform: z.array(z.enum(PLATFORM_ENUM)).min(1).optional(),

    framework: z.array(z.enum(FRAMEWORK_ENUM)).min(1).optional(),

    feature: z
      .string()
      .min(1, 'feature must be a non-empty string')
      .max(64, 'feature identifier must be 64 chars or less')
      .optional(),

    fallback: z
      .string()
      .min(1, 'fallback must be a non-empty component type')
      .max(64, 'fallback type must be 64 chars or less')
      .optional(),

    requires: z
      .array(
        z
            .string()
            .min(1, 'requires entry must be a non-empty identifier')
            .max(64),
      )
      .min(1, 'requires array must have at least one entry')
      .optional(),
  })
  .strict()
  .refine(
    (value) => {
      // Per §85: capability detection must be explicit. At least one of platform/framework/feature
      // must be declared for the capability to be useful.
      return Boolean(value.platform || value.framework || value.feature);
    },
    {
      message:
        'UICapability must declare at least one of platform, framework, or feature',
    },
  );

export type UICapability = z.infer<typeof UICapabilitySchema>;