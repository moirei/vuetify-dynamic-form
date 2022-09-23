import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VDynamicForm from "./index";

const vuetify = new Vuetify();

Vue.use(Vuetify);
Vue.use(VDynamicForm, {
  vuetify
});

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  vuetify
}).$mount("#app");
