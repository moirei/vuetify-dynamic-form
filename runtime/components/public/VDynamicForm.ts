import {
  defineComponent,
  h,
  ref,
  computed,
  watch,
  watchEffect,
  nextTick,
} from "vue";
import type { VNode, PropType, Slot } from "vue";
import defu from "defu";
import { useForm } from "vee-validate";
import { VCol, VRow } from "vuetify/components";
import VDynamicFormField from "../private/VDynamicFormField";
import { cloneDeep, pick } from "../../utils/helpers";
import type { FieldInputs } from "../../types";
import { parseFieldsInput } from "../../_utils";
import { provideForm } from "../../utils/forms";

export const props = {
  modelValue: { type: Object as PropType<Record<string, any>> },
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  defaultProps: {
    type: Object as PropType<any>,
    default: () => ({}),
  },
  defaults: { type: Object as PropType<any>, default: () => ({}) },
  inputs: { type: [Object, Array] as PropType<FieldInputs>, required: true },
  tag: { type: String, default: "form" },
  validateOnBlur: { type: Boolean, default: true },
  validateOnChange: { type: Boolean, default: true },
  validateOnInput: { type: Boolean, default: true },
  validateOnModelUpdate: { type: Boolean, default: true },
  validateOnMount: { type: Boolean, default: false },
};

export const emits = [
  "update:modelValue",
  "update:valid",
  "update:dirty",
  "update:errors",
  "submit",
];

export default defineComponent({
  name: "VDynamicForm",
  props,
  emits: emits,
  setup(props, ctx) {
    const updatingLocal = ref(false);
    const updatingExternal = ref(false);

    const fields = computed(() => {
      return parseFieldsInput(props.inputs!, props.defaultProps, {
        loading: props.loading,
        disabled: props.disabled,
        readonly: props.readonly,
        validateOnBlur: props.validateOnBlur,
        validateOnChange: props.validateOnChange,
        validateOnInput: props.validateOnInput,
        validateOnModelUpdate: props.validateOnModelUpdate,
      });
    });

    const schema = computed(() => fields.value.schema);

    const form = useForm({
      validationSchema: schema,
      validateOnMount: props.validateOnMount,
      initialValues: defu(props.defaults || {}, props.modelValue || {}),
    });

    const updateValues = (value: any) => {
      if (updatingLocal.value) return;
      updatingExternal.value = true;
      nextTick(() => {
        form.setValues(value);
        nextTick(() => {
          updatingExternal.value = false;
        });
      });
    };

    const emitValues = (values: any) => {
      if (updatingExternal.value) return;
      updatingLocal.value = true;
      nextTick(() => {
        const newData = cloneDeep(values);
        const fieldKeys = Object.keys(fields.value.schema);
        ctx.emit("update:modelValue", {
          ...props.modelValue,
          ...pick(newData, fieldKeys),
        });
        nextTick(() => {
          updatingLocal.value = false;
        });
      });
    };

    // bind external changes from model value to form values
    watch(() => props.modelValue, updateValues);

    // bind form values to external model value
    watch(form.values, emitValues);

    watchEffect(() => {
      ctx.emit("update:valid", form.meta.value.valid);
      ctx.emit("update:dirty", form.meta.value.dirty);
      ctx.emit("update:errors", form.errors.value);
    });

    provideForm(form);

    const handleSubmit = (event: Event) => {
      event.preventDefault();
      ctx.emit("submit", form.values.value);
    };

    const getFields = (slots: {
      readonly [x: string]: Slot | undefined;
    }): VNode[] => {
      const components: VNode[] = [];
      const lines = Object.entries(fields.value.lines).filter(
        ([_, inputs]: [string, any]) =>
          !!inputs.filter((input: any) => !input.hidden).length
      );

      lines.forEach(([_line, inputs]: [string, any], index: number) => {
        const items = inputs
          .filter((input: any) => !input.hidden)
          .map((input: any, inputIndex: number) => {
            const node = h(
              VDynamicFormField as any,
              {
                key: input.key,
                options: input,
                posTop: index == 0,
                posBottom: index == lines.length - 1,
                posLeft: inputIndex == 0,
                posRight: inputIndex == inputs.length - 1,
              },
              slots
            );

            return {
              input,
              node,
            };
          });

        const mapItemsToCol = () =>
          items.map((item: any) =>
            h(VCol, { ...item.input.col }, () => item.node)
          );

        if (items.length > 1) {
          components.push(
            h(
              VRow,
              { noGutters: true, class: "v-dynamic-form-field-group gap-2" },
              mapItemsToCol
            )
          );
        } else {
          components.push(...items.map((item: any) => item.node));
        }
      });

      return components;
    };

    return () => {
      const slots = ctx.slots;
      const { before, after, ...restSlots } = slots;
      const nodes = getFields(restSlots);

      if (before) {
        nodes.unshift(before() as any);
      }
      if (after) {
        nodes.push(after() as any);
      }

      const renderProps: any = { class: "v-dynamic-form" };

      // Add submit event listener if tag is "form"
      if (props.tag === "form") {
        renderProps.onSubmit = handleSubmit;
      }

      return h(props.tag, renderProps, nodes);
    };
  },
});
