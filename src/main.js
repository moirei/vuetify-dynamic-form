import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VDynamicForm from "./index";

Vue.use(Vuetify);
Vue.use(VDynamicForm);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  vuetify: new Vuetify(),
}).$mount("#app");
