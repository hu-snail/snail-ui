# 模板总览

模板是可安装的页面级组合：它们把组件库里的基础组件按真实场景拼好，安装后直接挂载即可使用，不需要重复实现页面结构。

## 与组件的区别

| | 组件 | 模板 |
| --- | --- | --- |
| 粒度 | 单个交互单元（按钮、输入框、列表） | 整块页面或页面区块 |
| 职责 | 渲染与交互 | 组合 + 页面级行为（调度、排队、中断） |
| 安装 | 与组件库同包 | 独立的 `@snui/templates` 包 |
| 加载 | 按需命名导入 | 按模板子路径导入，只加载用到的那个 |

模板内部完全复用组件库的基础组件，不重复实现按钮、输入框、下拉等基础单元。

## AI 套件

模板目前只有「AI 套件」这一个分类：它按使用粒度分成一个伞形模板和四个可单独使用的子模板。

| 模板 | 组件 | 平台 | 解决什么问题 |
| --- | --- | --- | --- |
| [AI 助手](/templates/ai/assistant) | `SnAiAssistant` | Web | 一页装下整套 AI 套件：对话 + 页头的模型配置抽屉，开箱即用 |
| [AI 对话页](/templates/ai/chat) | `SnAiChat` | Web / uni-app | 完整的对话界面，含排队调度与中断控制。Web 端不带模型配置抽屉 |
| [AI 输入框](/templates/ai/prompt) | `SnAiPrompt` | Web | 功能完整的输入区：附件、选择器、思考程度、排队 |
| [消息列表](/templates/ai/message-list) | `SnAiMessageList` / `SnAiMessage` | Web / uni-app | 转录展示：思考折叠、流式输出、工具行、错误重试 |
| [模型配置](/templates/ai/model-config) | `SnModelConfig` | Web | 厂商与模型管理，以及生成参数调节 |

Web 与 uni-app 的差异不再单独分页说明，而是写在每个模板页的「端差异」一节里，用平台标签标出各自的可用范围。

## 统一模板与按需子模板

`SnAiAssistant` 是「AI 套件」的伞形模板：内部就是 `SnAiChat`，再加上模型配置入口与抽屉。它接受 `SnAiChat` 的全部 props 与事件，因此从对话页换到助手只需改标签名；`:show-model-config="false"` 还能让它退化成纯对话页。

`SnAiChat` 仍然保留，作为**纯对话页**（不要配置入口）的选择。需要更细粒度时，三个子模板可以单独引：

```ts
// 只要输入区：页面自己拥有转录区
import { SnAiPrompt } from '@snui/templates/web/prompt'

// 只要配置面板：自己套抽屉或独立设置页
import { SnModelConfig } from '@snui/templates/web/model-config'

// 只要转录区：自己接流式数据
import { SnAiMessageList } from '@snui/templates/web/message-list'
```

一句话原则：**整页用助手 / 对话页，只有一块用子模板。**

## 按需加载

每个模板都是独立的子路径导出，加载方式分三步：

```ts
// 1) 只导入用到的那个模板：它的 JS 和它自己的样式会一起被带上
import { SnAiChat } from '@snui/templates/web/chat'

// 2) 共享 token 层在应用入口导入一次
import '@snui/templates/styles'

// 3) 需要自己控制代码分割时，也可以单独引某个模板的样式文件
import '@snui/templates/styles/web-chat.css'
```

样式**按模板**产出，没有「所有模板的样式桶」：引一个模板只会带上它自己的 CSS。

| 单模板样式文件 | 对应模板 |
| --- | --- |
| `@snui/templates/styles/web-assistant.css` | `@snui/templates/web/assistant` |
| `@snui/templates/styles/web-chat.css` | `@snui/templates/web/chat` |
| `@snui/templates/styles/web-prompt.css` | `@snui/templates/web/prompt` |
| `@snui/templates/styles/web-message-list.css` | `@snui/templates/web/message-list` |
| `@snui/templates/styles/web-model-config.css` | `@snui/templates/web/model-config` |
| `@snui/templates/styles/uni-chat.css` | `@snui/templates/uni/chat` |
| `@snui/templates/styles/uni-message-list.css` | `@snui/templates/uni/message-list` |

需要多个模板时也可以引端的整包，但它会把该端所有模板的 JS 一起带上，不如逐个子路径导入精确：

```ts
import { SnAiAssistant, SnAiPrompt } from '@snui/templates/web'
```

## 模板支持 props

模板与组件一样接受 props，用同一个模板可以派生出不同的外观与行为。例如对话页可以只换标题与风格：

```vue
<SnAiChat title="代码助手" theme="ios" :run="run" />

<SnAiAssistant title="文档助手" theme="default" :run="run" show-header />
```

`theme` 映射到风格包体系（`default` / `dark` / `ios` / `doodle` / `sticky-note`）；更细的调整通过覆盖 `--sn-web-*`（Web）/ `--sn-mp-*`（uni-app）token 完成，各页的「主题与 token 定制」一节给出了具体例子。
