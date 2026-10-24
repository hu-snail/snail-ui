# Upload 上传（uni 端 / 移动端）

`sn-upload` 是 `@snui/uni` 的上传组件：瓦片网格 + 每个文件的状态 + 体积 / 数量限制 + 上传进度。easycom 自动注册（`components/sn-upload/sn-upload.vue` → `<sn-upload>`），几何值使用 `rpx`。选择文件与传输属于宿主能力（AGENTS.md §60），组件只通过一个窄接口、带存在性判断地调用 `uni.chooseImage` / `chooseVideo` / `chooseMessageFile` / `uploadFile`——不碰 `document` / `window` / `fetch`；运行时缺失时发出 `chooseerror` 而不是抛错。

## 基础用法

sn-upload 基础上传：v-model:file-list 持有列表，limit 限数量，maxSize 限体积（超出触发 oversize）。

<Demo name="upload-mp-basic" description="sn-upload 基础上传：v-model:file-list 持有列表，limit 限数量，maxSize 限体积（超出触发 oversize）。" />

## 禁用与状态（`disabled` / `accept` / `showLimitNum`）

disabled 锁掉选择与删除；accept 切换选择器（image / video / file）；列表项按 status 显示进度与失败态。

<Demo name="upload-mp-disabled-status" description="disabled 锁掉选择与删除；accept 切换选择器（image / video / file）；列表项按 status 显示进度与失败态。" />

## 多选、来源与数量上限（`multiple` / `sourceType` / `sizeType` / `accept` / `limit` / `showLimitNum`）

`multiple` 让选择器一次多选；`source-type` 限定相册 / 相机；`size-type` 限定原图 / 压缩；`accept` 决定走哪个选择器 API；`limit` + `show-limit-num` 渲染计数并在满额时收起选择瓦片。

<Demo name="upload-mp-multiple-source" description="multiple 一次多选；sourceType / sizeType 收窄来源与尺寸；accept 切换选择器 API；limit + showLimitNum 满额后收起选择瓦片。" />

## 前置钩子与体积上限（`beforeUpload` / `beforeChoose` / `beforeRemove` / `beforePreview` / `maxSize`）

四个钩子都是「返回 false 即否决」：`before-choose` 在打开选择器前、`before-upload` 在文件进入列表前、`before-remove` 在删除前、`before-preview` 在预览前。`max-size` 超限时发出 `oversize` 并跳过该文件。

<Demo name="upload-mp-before-hooks" description="beforeChoose / beforeUpload / beforeRemove / beforePreview 四个否决钩子（预览里可直接验证删除被拦）；maxSize 超限改发 oversize。" />

## 缩略图模式与三层自定义类（`imageMode` / `customEvokeClass` / `customPreviewClass` / `customClass` / `customStyle`）

`image-mode` 透传给缩略图的 `<image mode>`；`custom-evoke-class` 改选择瓦片、`custom-preview-class` 改文件瓦片、`custom-class` / `custom-style` 改根节点。

<Demo name="upload-mp-preview-custom" description="imageMode aspectFit / aspectFill 切换缩略图填充；customEvokeClass、customPreviewClass、customClass / customStyle 三层独立。" />

## 请求参数与自定义传输（`action` / `header` / `name` / `formData` / `buildFormData` / `uploadMethod` / `autoUpload`）

`action` / `header` / `name` / `form-data` 是 `uni.uploadFile` 参数；`build-form-data` 按文件拼 multipart；`upload-method` 直接接管传输（示例用延时 Promise 模拟，不发网络请求）；`auto-upload=false` 时由 expose 的 `submit()` 触发。

<Demo name="upload-mp-request-method" description="action / header / name / formData 是 uni.uploadFile 参数；buildFormData 按文件拼 multipart；uploadMethod 用延时 Promise 模拟传输；autoUpload=false 时由 submit() 触发。" />

## 事件与计数开关（`change` / `remove` / `progress` / `showLimitNum=false`）

`change` 在列表每次变化时同 tick 触发（含删除）；`remove` 带被删项与剩余列表；`progress` 目前是保留事件（组件按 `percent` 渲染遮罩）；`show-limit-num=false` 关掉计数。

<Demo name="upload-mp-events-counter" description="change 每次列表变化触发；remove 带被删项；progress 为保留事件；showLimitNum=false 关掉计数；accept=media / all 切换选择器。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `fileList` | `UploadFileItem[]` | `[]` | 文件列表（`v-model:file-list`） |
| `action` / `header` / `formData` / `name` | `string` / `Record` / `Record` / `string` | `''` / `{}` / `{}` / `'file'` | `uni.uploadFile` 参数 |
| `multiple` | `boolean` | `false` | 是否支持多选 |
| `disabled` | `boolean` | `false` | 禁用选择与行操作 |
| `limit` | `number` | `0` | 最大文件数（0 不限制） |
| `showLimitNum` | `boolean` | `true` | 显示 `current / limit` 计数 |
| `maxSize` | `number` | `Number.MAX_VALUE` | 单文件字节上限 |
| `sourceType` / `sizeType` | `UploadSourceType[]` / `UploadSizeType[]` | `['album','camera']` / `['original','compressed']` | 选择器选项 |
| `beforeUpload` / `beforeChoose` / `beforeRemove` / `beforePreview` | function | `undefined` | 前置钩子 |
| `buildFormData` | `(file) => Record` | `undefined` | 自定义 multipart 构建 |
| `accept` | `'image' \| 'video' \| 'media' \| 'file' \| 'all'` | `'image'` | 选择器 API 选择 |
| `imageMode` | `'scaleToFill' \| 'aspectFit' \| 'aspectFill' \| 'widthFix'` | `'aspectFit'` | 预览填充模式 |
| `customEvokeClass` / `customPreviewClass` | `string` | `''` | 瓦片自定义类名 |
| `autoUpload` | `boolean` | `true` | 选择后自动上传 |
| `uploadMethod` | `(file) => Promise<response>` | `undefined` | 自定义传输实现 |
| `customClass` / `customStyle` | `string` | `''` | 根节点自定义类名 / 样式 |

> **未实现**：`reupload`、`extension`、`compressed` / `maxDuration`（视频后处理）、`loadingType` / `loadingColor` / `loadingSize`、`statusKey`、`successStatus`、`onPreviewFail`，以及 `preview-cover` 插槽。

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:fileList` | 列表变化时 | `(list: UploadFileItem[])` |
| `change` | 列表变化时（同 tick） | `{ fileList }` |
| `remove` | 移除文件时 | `{ file, fileList }` |
| `success` / `fail` | 传输结束时 | `{ file, response \| error }` |
| `progress` | 预留给字节级进度 | `{ file, percent }` |
| `oversize` | 文件超过 maxSize 时 | `{ file, maxSize }` |
| `chooseerror` | 选择器失败（或运行时缺失）时 | `(error)` |

## Exposed API

| 成员 | 签名 | 说明 |
| --- | --- | --- |
| `submit` | `() => Promise<void>` | 上传所有 pending / fail 文件 |
| `abort` | `(task?) => void` | 中止单个或全部任务 |

## Slots

本组件不提供插槽。

## 主题变量

| 变量 | 用途 |
| --- | --- |
| ``--sn-mp-color-background-soft`` | 文件瓦片底色 |
| ``--sn-mp-color-background-sunken`` | 空缩略图 |
| ``--sn-mp-color-background-overlay`` | 进度遮罩 / 删除底板 |
| ``--sn-mp-color-border-default`` | 选择瓦片虚线 |
| ``--sn-mp-color-feedback-danger`` | 失败瓦片描边 |
| ``--sn-mp-color-text-tertiary`` | 选择图标与计数 |
| ``--sn-mp-color-text-on-primary`` | 进度 / 删除图标 |
| ``--sn-mp-radius-lg` / `-md`` | 瓦片 / 删除按钮圆角 |

## 无障碍

- 根节点 `role="group"`。
- 选择瓦片 `role="button"`，带 `aria-label="choose file"` 与可聚焦 `tabindex="0"`。
- 删除按钮 `role="button"`，带逐文件 `aria-label`。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` / `page.sn-theme-dark` 下文字、底板、边框与状态色自动翻转。验证方式：

