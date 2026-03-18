import { createApp } from 'vue';
import App from './App.vue';
import { createRouter } from './router';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/custom.scss';

const router = createRouter();
const app = createApp(App);
app.use(router);
app.use(VueSweetalert2);

router.isReady().then(() => app.mount('#app'));
