import { ValidationProvider, ValidationObserver } from "vee-validate";
import VDynamicForm from "@/components/VDynamicForm.vue";

const install = function(Vue) {
  Vue.component("ValidationProvider", ValidationProvider);
  Vue.component("ValidationObserver", ValidationObserver);
  Vue.component("VDynamicForm", VDynamicForm);
};

const Plugin = { VDynamicForm, install };

export default Plugin;
export { VDynamicForm, Plugin };
