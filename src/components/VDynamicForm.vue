<template>
  <validation-observer
    v-slot="{ invalid }"
    ref="observer"
    class="w-full max-w-lg"
  >
    <form @submit.prevent="submit">
      <div v-for="(fields, i) in lines" :key="`line-${i}`">
        <component :is="fields.length ? 'v-row' : 'div'">
          <component
            :is="fields.length ? 'v-col' : 'div'"
            v-for="field in fields"
            :key="`line-${i}--${field.input}`"
            v-bind="field.col"
            class="py-0"
          >
            <div v-if="!hideName" class="text-subtitle-2 mb-2">
              {{ field.name }}
            </div>
            <slot :name="`field:validation:${field.input}`" v-bind="field">
              <validation-provider
                v-slot="{ errors }"
                :name="field.name"
                :rules="field.rules"
              >
                <slot
                  :name="`field:${field.input}`"
                  v-bind="{ ...field, errors }"
                >
                  <component
                    :is="getComponent(field.type)"
                    v-model="form[field.input]"
                    v-bind="field.props"
                    :error-messages="errors"
                    :disabled="loading"
                  ></component>
                </slot>
              </validation-provider>
            </slot>
          </component>
        </component>
      </div>
      <slot name="actions" v-bind="{ submit, invalid }">
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="loading || invalid"
          type="submit"
          @click="submit"
          >Submit</v-btn
        >
        <v-btn @click="clear" class="ml-2">Clear</v-btn>
      </slot>
    </form>
  </validation-observer>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { get, pick, startCase, max, chain } from "lodash";

export default {
  name: "VDynamicForm",
  props: {
    value: {},
    hideName: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    defaults: { type: Object, default: () => ({}) },
    inputFields: { type: Object, required: true },
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  computed: {
    form: {
      set(value) {
        this.$emit("input", value);
      },
      get() {
        return this.value || this.defaults;
      },
    },
    lines() {
      const items = Object.entries(this.inputFields).map(
        ([field, options]) => ({
          ...options,
          name: options.name || startCase(field),
          input: field,
          rules: options.rules || "",
          mode: options.mode || "aggressive",
        })
      );
      const n = max(items.map((item) => item.line || 0));
      return chain(items)
        .map((item, i) => {
          if (item.line === undefined) {
            item.line = n + i;
          } else {
            item.line = item.line + n;
          }

          return item;
        })
        .sortBy("line")
        .groupBy("line")
        .value();
    },
  },
  methods: {
    getComponent(type) {
      if (type == "text") return "v-text-field";
      if (type == "select") return "v-select";
      if (type == "checkbox") return "v-checkbox";
      if (type == "slider") return "v-slider";
      if (type == "range-slider") return "v-range-slider";
      if (type == "switch") return "v-switch";
      if (type == "textarea") return "v-textarea";
      if (type == "radio") return "v-radio";
      return "input";
    },
    loadDataFrom(data) {
      this.form = {
        ...this.form,
        ...pick(data, Object.keys(this.inputFields)),
      };
    },
    async submit() {
      const valid = this.$refs.observer.validate();
      if (valid) {
        this.$emit("submit", this.form);
      }
    },
    clear() {
      for (const field in this.form || {}) {
        this.form[field] = get(this.defaults, field);
      }
      this.$refs.observer.reset();
    },
  },
};
</script>
