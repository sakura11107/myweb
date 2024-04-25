import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";

import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import router from "./router/router.js";


const app = createApp(App)
app.use(ElementPlus);
app.use(createPinia());
app.use(router);

app.mount('#app')