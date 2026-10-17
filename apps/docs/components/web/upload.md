# Upload · Web（PC 端）

文件上传。按钮 + 拖放区双触发，本地列表状态机，customRequest 驱动上传。

## 基础用法

<Demo name="upload-web-basic" description="点击/拖放选文件入列（无 customRequest 直接 done）。" />

## 自定义上传（customRequest）

<Demo name="upload-web-custom" description="Promise resolve/reject 推进 uploading → done/error。" />

## 图片列表（listType）

<Demo name="upload-web-image" description="listType='image' 缩略图 + objectURL 自动回收。" />

## 上传前校验（beforeUpload）与上限（max）

<Demo name="upload-web-bounds" description="beforeUpload 拒绝不入列；max 到界隐藏触发。" />

## 禁用

<Demo name="upload-web-states" description="disabled。" />

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
| customRequest | `(file, fileList) => Promise` | — | 自定义上传（未传不发网络请求直接 done） |
| defaultUpload | `boolean` | `true` | false 时只入列等手动 submit |
| beforeUpload | `(file) => boolean \| Promise` | — | 拒绝则不入列 |

事件：`change(fileList)` / `remove(file)`；defineExpose：`submit()`。状态机：pending → uploading → done / error。拖拽/分片/目录上传为 out-of-scope（见 ai-description.md）。

完整契约见组件 `ai-description.md`。
