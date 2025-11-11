import { defineComponent, h, computed } from "vue";
import type { PropType, VNode } from "vue";
import { resolveComponent } from "vue";
import { VTextField } from "vuetify/components";
import type { FieldInput } from "../../types";
import { get, isString, throttle } from "../../utils/helpers";
import { castValue, isEvent } from "../../_utils";
import { injectForm } from "../../utils/forms";
import TipInfo from "./TipInfo";

export default defineComponent({
  name: "VDynamicFormField",
  props: {
    options: { type: Object as PropType<FieldInput>, required: true },
    posTop: { type: Boolean, default: false },
    posBottom: { type: Boolean, default: false },
    posLeft: { type: Boolean, default: false },
    posRight: { type: Boolean, default: false },
  },
  setup(props) {
    const form = injectForm();
    if (!form) {
      throw new Error("Form context not found");
    }
    const defineField = form.defineField.bind(form);
    const errors = form.errors;
    const setFieldError = form.setFieldError.bind(form);

    const [model, modelAttrs] = defineField(props.options.key, {
      label: props.options.name || props.options.label,
      validateOnBlur: props.options.validateOnBlur,
      validateOnChange: props.options.validateOnChange,
      validateOnInput: props.options.validateOnInput,
      validateOnModelUpdate: props.options.validateOnModelUpdate,
    });

    const errorMessages = computed(() => {
      const msg = errors.value[props.options.key];
      if (msg) {
        return [msg];
      }
      return undefined;
    });

    const getInputValue = (value: any) => {
      if (isEvent(value)) {
        value = get(value.target, "value");
      }
      return castValue(value, props.options.cast);
    };

    const handleChange = (value: any) => {
      model.value = getInputValue(value);
    };

    const updateValid = throttle((valid: boolean) => {
      const name = props.options.name || props.options.key;
      setFieldError(props.options.key, valid ? [] : `${name} is invalid`);
    }, 300);

    return {
      model,
      modelAttrs,
      errorMessages,
      handleChange,
      updateValid,
    };
  },
  render() {
    const slot = this.$slots[this.options.key + ":field"];
    if (slot) {
      return slot({
        input: this.options,
        props: this.options.props,
        modelValue: this.model,
        errors: this.errorMessages,
        modelAttrs: this.modelAttrs,
        handleChange: this.handleChange,
        "onUpdate:modelValue": this.handleChange,
        pos: {
          top: this.posTop,
          bottom: this.posBottom,
          left: this.posLeft,
          right: this.posRight,
        },
      });
    }

    const component: any = isString(this.options.component)
      ? resolveComponent(this.options.component)
      : this.options.component;

    // If component is undefined or the string "input", use VTextField as default
    const finalComponent =
      !component || component === "input" ? VTextField : component;

    const nodeClass = [
      "v-dynamic-form-field",
      {
        "v-dynamic-form-field--top": this.posTop,
        "v-dynamic-form-field--bottom": this.posBottom,
        "v-dynamic-form-field--left": this.posLeft,
        "v-dynamic-form-field--right": this.posRight,
      },
    ];

    if (this.options.class) {
      nodeClass.push(this.options.class);
    }

    const props: any = {
      ...this.modelAttrs,
      ...this.options.props,
      modelValue: this.model,
      errorMessages: this.errorMessages,
      loading: this.options.loading,
      disabled: this.options.disabled,
      readonly: this.options.readonly,
      "onUpdate:modelValue": this.handleChange,
      "onUpdate:valid": this.updateValid,
    };

    if (!this.options.wheelEvents) {
      props.onMousewheel = function () {
        this?.blur();
      };
    }

    let node: VNode;

    if (this.options.hideName) {
      props.class = nodeClass;
    }

    if (this.options.confirmEdit) {
      node = h(finalComponent, props);
    } else {
      node = h(finalComponent, props);
    }

    if (!this.options.hideName) {
      const name = this.options.name || this.options.label || this.options.key;
      let nameNodeChildren: any;
      if (this.options.tipInfo) {
        const tipProps =
          typeof this.options.tipInfo === "string"
            ? { text: this.options.tipInfo }
            : this.options.tipInfo;
        const tip = h(TipInfo, tipProps);
        nameNodeChildren = [`${name} `, tip];
      } else {
        nameNodeChildren = name;
      }
      const nameNode = h(
        "div",
        { class: "v-dynamic-form--input-subtitle text-subtitle-2 mb-1" },
        nameNodeChildren
      );

      return h("div", { class: nodeClass }, [nameNode, node]);
    }

    return node;
  },
});
