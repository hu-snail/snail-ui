<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DocArticle from '@/components/docs/DocArticle.vue';
import type { DocSection } from '@/components/docs/doc-article-types';

const { locale } = useI18n();

const sections = computed<DocSection[]>(() =>
  locale.value === 'zh-CN'
    ? [
        {
          heading: '请求封装',
          paragraphs: ['所有请求都经过 `src/request/http.ts` 的单一 alova 实例，统一处理：'],
          list: [
            '自动附加 Bearer Token（登录后由 auth store 写入）',
            '`{ code, message, data }` 响应约定：code === 0 放行，其余抛出 ApiError',
            '401 全局处理：清空本地会话、注销动态路由并跳转登录页',
            '错误码通过 `api.error.*` 文案空间本地化（describeError）',
          ],
        },
        {
          heading: '定义一个接口',
          paragraphs: ['在 `src/api/` 下新增模块，通过 httpGet / httpPost 直接拿到 data 载荷：'],
          code: `import { httpGet, httpPost } from '../request/http';
import type { UserInfo } from './types';

export const userApi = {
  fetchProfile: (): Promise<UserInfo> => httpGet<UserInfo>('/api/user/profile'),
  updateProfile: (patch: Partial<UserInfo>): Promise<UserInfo> =>
    httpPost<UserInfo>('/api/user/profile', patch),
};`,
        },
        {
          heading: 'Mock 服务',
          paragraphs: [
            'mock 定义在 `src/mock/index.ts`，@alova/mock 以 adapter 形式挂载，未命中 mock 规则的 URL 会穿透到真实 fetch。',
            '业务错误保持 HTTP 200，通过响应包 code 表达（与真实后端同一契约）；鉴权失败返回 code 401。',
          ],
          code: `// src/mock/index.ts
export const mockGroups = defineMock({
  '[POST]/api/auth/login': ({ data }) => {
    const user = users.get(String(data?.username));
    if (user === undefined || user.password !== data?.password) return fail(1001);
    return ok({ token: issueToken(user.username), user: toUserInfo(user) });
  },
});`,
        },
        {
          heading: '切换真实后端',
          paragraphs: [
            '设置环境变量 VITE_USE_MOCK=false 并在 vite.config.ts 为 alova 配置真实 baseURL 即可。',
            '请求封装、Token 注入、401 逻辑均无需改动 —— api 层与 mock 层是可替换的。',
          ],
        },
      ]
    : [
        {
          heading: 'Request layer',
          paragraphs: [
            'Every request goes through the single alova instance in `src/request/http.ts`, which handles:',
          ],
          list: [
            'Bearer-token injection (written by the auth store after login)',
            '`{ code, message, data }` envelope: code === 0 resolves, anything else throws ApiError',
            'Global 401 handling: local session cleared, dynamic routes dropped, redirected to /login',
            'Error codes localized via the `api.error.*` namespace (describeError)',
          ],
        },
        {
          heading: 'Define an API',
          paragraphs: [
            'Add a module under `src/api/`; httpGet / httpPost return the data payload directly:',
          ],
          code: `import { httpGet, httpPost } from '../request/http';
import type { UserInfo } from './types';

export const userApi = {
  fetchProfile: (): Promise<UserInfo> => httpGet<UserInfo>('/api/user/profile'),
  updateProfile: (patch: Partial<UserInfo>): Promise<UserInfo> =>
    httpPost<UserInfo>('/api/user/profile', patch),
};`,
        },
        {
          heading: 'Mock service',
          paragraphs: [
            'Mocks live in `src/mock/index.ts`; @alova/mock mounts as an adapter and unmatched URLs fall through to real fetch.',
            'Business errors keep HTTP 200 and travel via the envelope code (same contract as a real backend); auth failures return code 401.',
          ],
          code: `// src/mock/index.ts
export const mockGroups = defineMock({
  '[POST]/api/auth/login': ({ data }) => {
    const user = users.get(String(data?.username));
    if (user === undefined || user.password !== data?.password) return fail(1001);
    return ok({ token: issueToken(user.username), user: toUserInfo(user) });
  },
});`,
        },
        {
          heading: 'Switch to a real backend',
          paragraphs: [
            'Set VITE_USE_MOCK=false and configure a real baseURL for alova in vite.config.ts.',
            'Nothing else changes — token injection, 401 handling and the api layer are transport-agnostic.',
          ],
        },
      ],
);
</script>

<template>
  <DocArticle :sections="sections" />
</template>
