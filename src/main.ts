import VDynamicForm from "~/components/VDynamicForm.vue";
import { OptionsInterface, PluginInterface } from "../types";

// It is bad practice to mix default and named exports in the same module, though it is allowed by the specification.
export const VuetifyDynamicFormPlugin = new class Plugin
  implements PluginInterface<OptionsInterface> {
  vuetify;
  installed = false;

  install(VueFuncConstructor, options?: OptionsInterface) {
    VueFuncConstructor.prototype.vuetifyDynamicFormPlugin = VuetifyDynamicFormPlugin;
    VueFuncConstructor.prototype.$dynamicFormOptions = {
      interactionMode: options?.interactionMode || "aggressive"
    };
    this.installed = true;
    VueFuncConstructor.component('VDynamicForm', VDynamicForm)
  }
}();

export default VuetifyDynamicFormPlugin;
export { VDynamicForm, VuetifyDynamicFormPlugin as Plugin };

// Auto installation (useful if installed via CDN)
(function autoInstall() {
  let globalScope: any = null;

  if (typeof window !== "undefined") {
    globalScope = window;
  } else if (typeof global !== "undefined") {
    // @ts-ignore
    globalScope = global;
  }
  if (globalScope && globalScope.Vue) {
    // Automatic installation if Vue has been added to the global scope.
    globalScope.Vue.use(VuetifyDynamicFormPlugin, {
      ...globalScope.vuetifyDynamicFormPluginOptions
    });
    globalScope.Vue.component("VDynamicForm", VDynamicForm);
  }
})();
