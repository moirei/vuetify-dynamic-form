import type { App } from "vue";
import VDynamicForm from "../runtime/components/public/VDynamicForm";
import TipInfo from "../runtime/components/private/TipInfo";

export { default as VDynamicForm } from "../runtime/components/public/VDynamicForm";
export { default as VDynamicFormField } from "../runtime/components/private/VDynamicFormField";
export { default as TipInfo } from "../runtime/components/private/TipInfo";
export {
  defineFormInput,
  defineFormInputs,
} from "../runtime/composables/dynamic-forms";
export type * from "../runtime/types";

export default {
  install(app: App) {
    app.component("VDynamicForm", VDynamicForm);
    app.component("TipInfo", TipInfo);
  },
};
