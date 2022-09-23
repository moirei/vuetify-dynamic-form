// !!! Do not use path aliases in this file (e.g. "~")
import Vue, { PluginObject } from "vue";
import { Framework } from "vuetify";

// Here you need to export everything (export), and not use namepsace

type InteractionMode = "aggressive" | "eager" | "passive" | "lazy";

export interface PluginInterface<T> extends PluginObject<T> {
  installed: boolean;
  install(VueFuncConstructor, options: T);
}

export interface OptionsInterface {
  interactionMode?: InteractionMode;
}

export interface DynamicFormOptions {
  interactionMode: InteractionMode;
}

declare module "vue/types/vue" {
  interface Vue {
    $dynamicFormOptions: DynamicFormOptions;
    vuetifyDynamicFormPlugin: PluginInterface<OptionsInterface>;
  }
}
