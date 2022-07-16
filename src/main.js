import Vue from "vue"
import App from "./App.vue"

import { Table, Icon, Tag, Divider, Button } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
Vue.use(Table).use(Icon).use(Tag).use(Divider).use(Button)

Vue.config.productionTip = false

new Vue({
    render: (h) => h(App),
}).$mount("#app")
