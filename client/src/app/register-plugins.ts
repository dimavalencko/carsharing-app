import type { App } from 'vue';

// Import plugins
import i18n from '@app/i18n';
import router from './router';
import store from './store';

function registerPlugins(app: App<Element>) {
  app.use(i18n);
  app.use(router);
  app.use(store);
}

export default registerPlugins;
