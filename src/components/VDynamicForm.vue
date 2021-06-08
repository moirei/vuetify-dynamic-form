<template>
  <div class="v-dynamic-form">
    <validation-observer
      v-slot="{ invalid }"
      ref="observer"
      class="w-full max-w-lg"
    >
      <form @submit.prevent="submit">
        <div class="v-dynamic-form--inputs">
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
                      v-bind="{ ...field, errors, invalid }"
                    >
                      <component
                        :is="getComponent(field.type)"
                        v-model="form[field.input]"
                        v-bind="field.props"
                        :error-messages="errors"
                        :disabled="loading || disabled || field.props.disabled"
                        :readonly="readonly || field.props.readonly"
                      ></component>
                    </slot>
                  </validation-provider>
                </slot>
              </component>
            </component>
          </div>
        </div>
        <slot
          v-if="!hideActions"
          name="actions"
          v-bind="{ submit, clear, invalid }"
        >
          <div class="v-dynamic-form--actions">
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading || disabled || invalid"
              type="submit"
              @click="submit"
              >Submit</v-btn
            >
            <v-btn @click="clear" class="ml-2">Clear</v-btn>
          </div>
        </slot>
      </form>

      <!-- dummy state propergate -->
      <state-buffer :invalid="invalid" v-on="$listeners" />
    </validation-observer>
  </div>
</template>

<script>
import {
  VTextField,
  VSelect,
  VCheckbox,
  VSlider,
  VRangeSlider,
  VSwitch,
  VTextarea,
  VRadio,
} from "vuetify/lib";
import { get, pick, startCase, max, chain } from "lodash";

const StateBuffer = {
  name: "StateBuffer",
  props: ["invalid"],
  watch: {
    invalid(value) {
      this.$emit("update:valid", !value);
    },
  },
  render() {
    return "span";
  },
};

export default {
  name: "VDynamicForm",
  props: {
    value: {},
    hideName: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    hideActions: { type: Boolean, default: false },
    defaults: { type: Object, default: () => ({}) },
    inputFields: Object,
    valid: Boolean,
  },
  components: {
    StateBuffer,
    VTextField,
    VSelect,
    VCheckbox,
    VSlider,
    VRangeSlider,
    VSwitch,
    VTextarea,
    VRadio,
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
          props: options.props || {},
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
