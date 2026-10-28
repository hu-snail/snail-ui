/**
 * 首页 uni-templates 版位注册表（home-uni-templates.ts）的契约测试。
 *
 * 重点：`route` 必须与 apps/uni-templates/src/pages.json 的 subPackages
 * 声明一致（真实存在 + 位于分包），否则 iframe / 二维码落空。
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { uniTemplateDesc, uniTemplateTitle, uniTemplates } from './home-uni-templates';

/** apps/uni-templates 工程根（vitest root 为 apps/docs，按相对路径回溯）。 */
const uniTemplatesSrc = resolve(process.cwd(), '../uni-templates/src');

interface UniTemplatesPagesJson {
  pages: { path: string }[];
  subPackages: { root: string; pages: { path: string }[] }[];
}

const pagesJson = JSON.parse(
  readFileSync(resolve(uniTemplatesSrc, 'pages.json'), 'utf8'),
) as UniTemplatesPagesJson;

/** 分包内所有已注册路由（`root + '/' + path`）。 */
const registeredRoutes = new Set(
  pagesJson.subPackages.flatMap((sp) => sp.pages.map((p) => `${sp.root}/${p.path}`)),
);

describe('home uni-templates registry', () => {
  it('should keep template ids unique', () => {
    const ids = uniTemplates.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('should point at real subpages registered in pages.json (分包模板页)', () => {
    // 主包只保留目录页：模板不允许进入主包
    const mainRoutes = new Set(pagesJson.pages.map((p) => p.path));
    for (const t of uniTemplates) {
      expect(t.route, t.id).toMatch(/^subpages\/[a-z0-9-]+$/);
      expect(registeredRoutes.has(t.route), `${t.id} → ${t.route}`).toBe(true);
      expect(mainRoutes.has(t.route), `${t.id} 不得占用主包`).toBe(false);
      expect(t.h, t.id).toBeGreaterThanOrEqual(440);
      expect(t.h, t.id).toBeLessThanOrEqual(680);
    }
  });

  it('should resolve title & desc in both locales', () => {
    for (const t of uniTemplates) {
      expect(uniTemplateTitle(t.id, 'zh'), `${t.id} zh`).not.toBe(t.id);
      expect(uniTemplateTitle(t.id, 'en'), `${t.id} en`).not.toBe(t.id);
      expect(uniTemplateDesc(t.id, 'zh'), `${t.id} desc`).not.toBe('');
      expect(uniTemplateDesc(t.id, 'en'), `${t.id} desc`).not.toBe('');
    }
  });
});
