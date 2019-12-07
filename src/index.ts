import Vue from 'vue';

import App from './components/app';
import config from './config';

const app = new Vue({
	el: '#app',
	render: h => h(App)
});

if (config.ENV !== 'production') {
	(window as any).app = app;
}
