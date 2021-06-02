<template>
  <v-card v-bind="$props" style="overflow: hidden">
    <validation-observer
      v-slot="{ invalid }"
      ref="observer"
      class="w-full max-w-lg"
      @submit.prevent="!invalid && submit()"
    >
      <v-card-title>
        <slot name="title">{{ title }}</slot>
        <v-spacer />
        <slot name="header-actions"></slot>
      </v-card-title>
      <v-card-subtitle v-if="subtitle">{{ subtitle }}</v-card-subtitle>
      <v-divider />
      <slot name="top"></slot>
      <v-card-text
        :class="{ 'v-card-body-heightlight': highlightBody }"
        :style="{
          'max-height': maxBodyHeight,
          'overflow-y': maxBodyHeight ? 'scroll' : '',
        }"
      >
        <slot>
          <div v-for="(fields, i) in lines" :key="`line-${i}`" class="mt-2">
            <component :is="fields.length ? 'v-row' : 'div'">
              <component
                :is="fields.length ? 'v-col' : 'div'"
                v-for="field in fields"
                :key="`line-${i}--${field.input}`"
                v-bind="field.col"
              >
                <div class="text-subtitle-2 mb-2">{{ field.name }}</div>
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
        </slot>
      </v-card-text>
      <v-divider />
      <v-card-actions :class="{ 'v-card-body-heightlight': !highlightBody }">
        <slot name="actions" v-bind="{ submit, valid }">
          <v-spacer />
          <v-btn
            small
            color="primary"
            :loading="loading"
            :disabled="loading || !is_valid"
            type="submit"
            @click="submit"
            >Submit</v-btn
          >
        </slot>
      </v-card-actions>
    </validation-observer>
  </v-card>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import mixin from "./mixin";
import { debounce, pick, startCase, max, chain } from "lodash";

export default {
  name: "VDynamicForm",
  mixins: [mixin],
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data: () => ({
    is_valid: false,
  }),
  mounted() {
    const pollReady = () => {
      if (this.loading) {
        setTimeout(pollReady, 300);
      } else {
        // start watching after input data is ready
        // skips attempts to validate initially empty form
        this.$watch("form", {
          deep: true,
          handler: "test",
        });
      }
    };

    setTimeout(pollReady, 300);
  },
  computed: {
    lines() {
      const items = Object.entries(this.inputFields).map(
        ([field, options]) => ({
          ...options,
          name: options.name || startCase(field),
          input: field,
          rules: options.rules || "",
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
      return "input";
    },
    test: debounce(function() {
      this.validate();
    }, 500),
    async validate() {
      let valid = false;
      if (this.$refs.observer) {
        valid = this.is_valid = await this.$refs.observer.validate();
        this.$emit("update:valid", valid);
      }
      return valid;
    },
    async submit() {
      await this.validate();
      this.$emit("input", this.form);
      if (this.valid) {
        this.$emit("submit", this.form);
      }
    },
    loadDataFrom(data) {
      this.form = {
        ...this.form,
        ...pick(data, Object.keys(this.inputFields)),
      };
    },
  },
};
</script>
