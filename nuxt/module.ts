import {
  defineNuxtModule,
  addComponentsDir,
  addImportsDir,
  createResolver,
} from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "@moirei/vuetify-dynamic-form",
    configKey: "vuetifyDynamicForm",
  },
  setup() {
    const { resolve } = createResolver(import.meta.url);

    // Auto-import components
    addComponentsDir({
      path: resolve("../runtime/components/public"),
      global: true,
      pathPrefix: false,
    });

    // Auto-import composables
    addImportsDir(resolve("../runtime/composables"));
  },
});
