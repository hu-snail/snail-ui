import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { i18n } from './i18n';
import { createAppRouter } from './router';
import { setupRouterGuard } from './router/guard';
import '@snui/vue-web/styles';
import './styles/index.css';

const app = createApp(App);
const router = createAppRouter();

setupRouterGuard(router);

app.use(createPinia());
app.use(i18n);
app.use(router);
app.mount('#app');
