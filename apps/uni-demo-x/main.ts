// gen-x: source apps/uni-demo/src/main.ts sha256:28bda2a44d5282e6 —— 生成产物勿手改；源码改动后重跑 pnpm -F @snui/uni-demo-x gen
import { createSSRApp } from 'vue';
import App from './App.uvue';

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
