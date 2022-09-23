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
            <component :is="fields.length > 1 ? 'v-row' : 'div'">
              <component
                :is="fields.length > 1 ? 'v-col' : 'div'"
                v-for="field in fields"
                :key="`line-${i}--${field.input}`"
                v-bind="field.col"
                v-show="!field.hidden"
              >
                <div
                  v-if="!field.hideName"
                  class="v-dynamic-form--input-subtitle text-subtitle-2 mb-1"
                >
                  {{ field.name }}
                </div>
                <slot :name="`field:validation:${field.input}`" v-bind="field">
                  <validation-provider
                    tag="div"
                    v-slot="{ errors }"
                    :name="field.name"
                    :rules="field.rules"
                    :vid="field.vid"
                    :persist="true"
                  >
                    <slot
                      :name="`field:${field.input}`"
                      v-bind="{ ...field, errors, invalid }"
                    >
                      <component
                        :is="field.component"
                        @input="v => setFormField(field.key, v)"
                        :value="getFormField(field.key)"
                        v-bind="field.props"
                        :error-messages="errors"
                        :disabled="field.disabled"
                        :readonly="field.readonly"
                      />
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
      <state-buffer :invalid="invalid" @update:valid="forwardValid" />
    </validation-observer>
  </div>
</template>

<script lang="ts">
import { Prop } from "vue/types/options";
import {
  get,
  startCase,
  max,
  chain,
  isUndefined,
  cloneDeep,
  tap,
} from "lodash";
import { getInputComponent, getInputKeys, set } from "../utils";
import { InputLine } from "../types";

const StateBuffer = {
  name: "StateBuffer",
  props: ["invalid"],
  watch: {
    invalid(value) {
      this.$emit("update:valid", !value);
    },
  },
  render(h) {
    return h("div", {
      attrs: {
        style: "visibility: hidden",
      },
    });
  },
}

export default {
  name: "VDynamicForm",
  props: {
    value: {},
    hideName: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    hideActions: { type: Boolean, default: false },
    defaults: { type: Object as Prop<any>, default: () => ({}) },
    inputFields: { type: Object, default: () => ({}) },
    interactionMode: { type: String },
    tag: { type: String, default: "div" },
    nestedFields: { type: Boolean, default: false },
    disableObjectRewrite: { type: Boolean, default: false },
    valid: Boolean,
  },
  components: {
    StateBuffer,
  },
  computed: {
    form: {
      set(value: any) {
        this.$emit("input", value);
      },
      get(): any {
        return this.value || Object.assign({}, this.defaults);
      },
    },
    lines() {
      const dynamicFormOptions =
        this.$dynamicFormOptions || this.$parent?.$dynamicFormOptions || {};

      const items: InputLine[] = Object.entries(this.inputFields).map(
        ([field, options]: [string, any]) => ({
          ...options,
          name: options.name || startCase(field),
          input: field,
          key: options.key || field,
          rules: options.rules || "",
          mode:
            options.mode ||
            this.interactionMode ||
            dynamicFormOptions.interactionMode,
          vid: options.vid || field,
          hideName: this.hideName || options.hideName || options["hide-name"],
          props: options.props || {},
          component: this.getComponent(options),
          disabled:
            this.loading ||
            (!isUndefined(options.props?.disabled)
              ? options.props?.disabled
              : this.disabled),
          readonly: !isUndefined(options.props?.readonly)
            ? options.props?.readonly
            : this.readonly,
        })
      );
      const n: number = max(items.map((item: any) => item.line || 0)) || 0;

      return chain(items)
        .map((item, i) => {
          if (item.line === undefined) {
            item.line = n + i;
          } else {
            item.line = Number(item.line) + n;
          }
          return item;
        })
        .sortBy("line")
        .groupBy("line")
        .value();
    },
  },
  methods: {
    getComponent({ type, component }: any) {
      if (component) return component;
      return getInputComponent(type);
    },
    loadDataFrom(data: any) {
      getInputKeys(this.inputFields).forEach((key) => {
        this.setFormField(key, get(data, key));
      });
    },
    async submit() {
      const valid = await this.validate();
      if (valid) {
        this.$emit("submit", this.form);
      }
    },
    clear() {
      getInputKeys(this.inputFields).forEach((key) => {
        this.setFormField(key, get(this.defaults, key));
      });
      this.reset();
    },
    reset() {
      if (this.$refs.observer) {
        // @ts-ignore observer not typed
        this.$refs.observer.reset();
      }
    },
    async validate(silent?: boolean) {
      if (this.$refs.observer) {
        // @ts-ignore observer not typed
        return this.$refs.observer.validate(silent);
      }
    },
    getFormField(field: string | string[]) {
      if (this.nestedFields) {
        return get(this.form, field);
      }
      return this.form[String(field)];
    },
    setFormField(field: string | string[], value: any) {
      if (this.disableObjectRewrite) {
        if (this.nestedFields) {
          set(this.form, field, value);
        } else {
          this.$set(this.form, String(field), value);
        }
      } else {
        const form = tap(cloneDeep(this.form), (f) => {
          if (this.nestedFields) {
            set(f, field, value);
          } else {
            this.$set(f, String(field), value);
          }
        });
        this.$emit("input", form);
      }
    },
    forwardValid(valid){
      this.$emit("update:valid", valid)
    }
  },
};
</script>

<style lang="scss" scoped>
.v-dynamic-form--input-subtitle + span,
.v-dynamic-form--input-subtitle + div {
  .v-input.v-input--selection-controls {
    margin-top: 0;
  }
}
</style>
