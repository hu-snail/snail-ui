# Upload · Web（PC 端）

文件上传。按钮 / 拖拽区 / 输入框 / 弹窗四种触发形态，本地列表状态机，customRequest 驱动上传并回报进度。

## 基础用法

<Demo name="upload-web-basic" description="点击/拖放选文件入列（无 customRequest 直接 done）。" />

## 拖拽上传（dragger）

`dragger` 把紧凑的触发按钮换成整块虚线拖放区：点击整区打开选择器，拖拽到组件任意位置都会高亮并入列。上传过程中 `customRequest` 往条目上写 `percentage`，内置列表就渲染出确定性进度条（不带 `percentage` 时仍是不确定的转圈）。

<Demo name="upload-web-dragger" description="dragger 拖放区 + 进度动画 + 点击条目名称或眼镜图标预览。" />

## 输入框 + 上传

只读 `SnInput` 回显已选文件名，旁边的 `SnUpload` 负责选择与上传；宿主侧自绘列表可以接 `SnProgress` 显示进度动画，点击文件名打开真正的预览弹窗。

<Demo name="upload-web-input" description="输入框回显 + Progress 进度动画 + 点击文件名打开预览弹窗。" />

## 弹窗上传

把上传器放进弹窗，`完成` 时把已完成的文件提交回页面；适合「上传附件」这类先集中选择、再一次性确认的场景。

<Demo name="upload-web-dialog" description="弹窗内拖拽上传，完成后回填页面。" />

## 自定义上传（customRequest）

<Demo name="upload-web-custom" description="Promise resolve/reject 推进 uploading → done/error。" />

## 图片列表（listType）

<Demo name="upload-web-image" description="listType='image' 缩略图 + objectURL 自动回收。" />

## 上传前校验（beforeUpload）与上限（max）

<Demo name="upload-web-bounds" description="beforeUpload 拒绝不入列；max 到界隐藏触发。" />

## 禁用

<Demo name="upload-web-states" description="disabled。" />

## 进度与预览

- **进度**：驱动在 `customRequest` 里往条目写 `percentage`（0–100，越界会被收敛），`showProgress` 打开时该条目渲染确定性进度条；不写就退回转圈。
- **预览**：条目可预览时（`listType='image'` 有缩略图，或宿主传了 `onPreview`）列表右侧出现眼镜按钮，条目名称也变成可点。两条路径都会派发 `preview` 事件；`onPreview` 与 `@preview` 指向同一个处理函数，只调用一次。

## API

### SnUpload Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| multiple | `boolean` | `false` | 多文件 |
| accept | `string` | — | 原生 accept |
| disabled / readonly | `boolean` | `false` | 禁用 / 只读 |
| max | `number` | — | 文件数上限（到界隐藏触发） |
| showFileList | `boolean` | `true` | 显示文件列表 |
| listType | `'text'\|'image'` | `'text'` | 列表形态 |
| dragger | `boolean` | `false` | 虚线拖放区替代紧凑触发按钮（追加式偏离，见 ai-description.md） |
| customRequest | `(file, fileList) => Promise` | — | 自定义上传（未传不发网络请求直接 done） |
| showProgress | `boolean` | `true` | 上传中且带 `percentage` 时渲染确定性进度条 |
| defaultUpload | `boolean` | `true` | false 时只入列等手动 submit |
| beforeUpload | `(file) => boolean \| Promise` | — | 拒绝则不入列 |
| onPreview | `(file) => void` | — | 点击预览回调（与 `@preview` 等价） |

### SnUploadFile

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id / name / size / type / file / status | — | 条目基础信息与状态机状态 |
| url | `string \| undefined` | `listType='image'` 的 objectURL 缩略图（移除 / 卸载时回收） |
| percentage | `number \| undefined` | 上传进度百分比，由 customRequest 写入 |

事件：`change(fileList)` / `remove(file)` / `preview(file)`；defineExpose：`submit()`。状态机：pending → uploading → done / error。分片 / 目录上传为 out-of-scope（见 ai-description.md）。

完整契约见组件 `ai-description.md`。