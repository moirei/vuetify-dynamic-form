import Vue, { Component } from "vue";
import { ValidationObserver, ValidationProvider } from "vee-validate";
import VDynamicForm from "./components/VDynamicForm.vue";

interface Options {
  interactionMode?: "aggressive" | "eager" | "passive" | "lazy";
}

const install = function (app: typeof Vue, options: Options = {}) {
  app.prototype.$dynamicFormOptions = {
    interactionMode: options?.interactionMode || "aggressive",
  };
  app.component("ValidationProvider", ValidationProvider);
  app.component("ValidationObserver", ValidationObserver);
  app.component("VDynamicForm", VDynamicForm);
};

const Plugin = { VDynamicForm, install };

export default Plugin;
export { VDynamicForm, Plugin };

export interface InputLine {
  name: string;
  input: string;
  rules: string | string[];
  mode: string;
  hideName: boolean;
  props: any;
  line: number | string;
  component: string | Component;
  col?: any;
  hidden?: boolean;
  vid?: string;
  key: string | string[];
}

declare module "vue/types/vue" {
  interface Vue {
    $dynamicFormOptions: Options;
  }
}
