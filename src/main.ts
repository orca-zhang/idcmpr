import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { Button, Cell, CellGroup, Field, NoticeBar } from 'vant';

const app = createApp(App);
app.use(Button);
app.use(Cell);
app.use(CellGroup);
app.use(Field);
app.use(NoticeBar);
app.mount('#app')
