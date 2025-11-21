import { computed, toRaw } from "vue";
import { useForm as useVeeValidateForm } from "vee-validate";
import { FieldInputWithoutKey } from "../types";
import { isString, isObject, parseRules, upperFirst } from "../utils/helpers";

type FieldValidation = {
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnInput?: boolean;
  validateOnModelUpdate?: boolean;
};

type FieldInput = FieldValidation &
  Omit<
    FieldInputWithoutKey,
    "key" | "component" | "props" | "hidden" | "cast"
  > & {
    name?: string;
    label?: string;
  };

// Helper type to get required keys
type RequiredKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? never : K;
}[keyof T];

// Helper type to get optional keys
type OptionalKeys<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never;
}[keyof T];

// Type for inputs that requires all non-optional fields and makes optional fields optional
type FormInputs<T> = {
  [K in RequiredKeys<T>]: FieldInput | string;
} & {
  [K in OptionalKeys<T>]?: FieldInput | string;
};

type FormOptionsWithInput<T> = FieldValidation & {
  inputs: FormInputs<T>;
  initialState?: Partial<T>;
  validateOnMount?: boolean;
};

type FormOptions<T> = FormOptionsWithInput<T> | FormInputs<T>;

type Field<V> = {
  value: V;
  attrs: any;
};

const isFormOptionsInputs = (
  options: FormOptions<any>
): options is FormInputs<any> => {
  // If "inputs" doesn't exist, it's definitely FormInputs
  if (!("inputs" in options)) {
    return true;
  }

  const inputsValue = (options as any).inputs;

  // If "inputs" exists but is a string or FieldInput (not an object),
  // then "inputs" is a field name, so it's FormInputs
  if (!isObject(inputsValue)) {
    return true;
  }

  // If "inputs" is an object, check if it looks like FormInputs (record of FieldInput | string)
  // vs FormOptionsWithInput.inputs (which is also FormInputs, but nested)
  // We can distinguish by checking if the object has properties that are strings or FieldInput-like objects
  // AND if there are other FormOptionsWithInput-specific properties

  // Check for FormOptionsWithInput-specific properties that don't exist in FormInputs
  // These are unique to FormOptionsWithInput
  const hasFormOptionsProperties =
    "initialState" in options || "validateOnMount" in options;

  if (hasFormOptionsProperties) {
    return false; // Definitely FormOptionsWithInput
  }

  // If "inputs" is an object, check if it looks like a FormInputs record
  // FormInputs is Record<string, FieldInput | string>
  // FormOptionsWithInput.inputs is also FormInputs, but nested under "inputs" key
  const inputsKeys = Object.keys(inputsValue);

  if (inputsKeys.length === 0) {
    // Empty object - ambiguous, but if it has "inputs" key, assume FormOptionsWithInput
    return false;
  }

  // Check if the values look like form field definitions (string or FieldInput)
  const firstValue = (inputsValue as Record<string, any>)[inputsKeys[0]];

  // If first value is a string or an object with field-like properties,
  // then inputsValue is a FormInputs record, so options is FormOptionsWithInput
  const looksLikeFormInputsRecord =
    isString(firstValue) ||
    (isObject(firstValue) &&
      ("rules" in firstValue ||
        "name" in firstValue ||
        "label" in firstValue ||
        "type" in firstValue ||
        "component" in firstValue));

  // If it looks like a FormInputs record, then "inputs" is the FormOptionsWithInput.inputs property
  // Otherwise, "inputs" is a field name in FormInputs
  return !looksLikeFormInputsRecord;
};

const parseFieldsInput = (options: FormOptionsWithInput<any>) => {
  const fields: Record<string, FieldInput> = {};
  const schema: Record<string, any> = {};

  for (const key in options.inputs) {
    const input: FieldInput = isString(options.inputs[key])
      ? { rules: options.inputs[key] }
      : (options.inputs[key] as FieldInput);
    if (input.rules) {
      schema[key] = parseRules(input.rules);
    }

    const name = upperFirst(input.name || key);

    fields[key] = {
      validateOnBlur: options.validateOnBlur,
      validateOnChange: options.validateOnChange,
      validateOnInput: options.validateOnInput,
      validateOnModelUpdate: options.validateOnModelUpdate,
      ...input,
      name,
      label: input.label || name,
    };
  }

  return {
    fields,
    schema,
  };
};

export function useFormInputs<
  T extends Record<string, any>,
  K extends keyof T = keyof T
>(options: FormOptions<T>) {
  const opts: FormOptionsWithInput<T> = isFormOptionsInputs(options)
    ? {
        inputs: options,
        validateOnMount: false,
        initialState: {},
      }
    : options;

  const inputs = parseFieldsInput(opts);
  const schema = computed(() => inputs.schema);

  const {
    values,
    errors,
    errorBag,
    defineField,
    validate,
    isFieldDirty,
    isFieldValid,
    resetForm,
    setValues,
    ...form
  } = useVeeValidateForm<T>({
    validationSchema: schema,
    validateOnMount: opts.validateOnMount,
    initialValues: Object.assign({}, opts.initialState || {}) as any,
  });

  const valid = computed(() => form.meta.value.valid);
  const dirty = computed(() => form.meta.value.dirty);

  const fields: Record<K, Field<T[K]>> = new Proxy({} as any, {
    get(_target, prop: string): Field<T[K]> {
      const input = inputs.fields[prop];

      if (!input) {
        console.warn(`[vuetify-dynamic-form] input ${prop} not defined`);
      }

      const [value, attrs] = defineField(prop as any, {
        label: input?.label,
        validateOnBlur: input?.validateOnBlur,
        validateOnChange: input?.validateOnChange,
        validateOnInput: input?.validateOnInput,
        validateOnModelUpdate: input?.validateOnModelUpdate,
        props: (state) => ({
          // valid: state.valid,
          errorMessages: state.errors,
        }),
      });

      return {
        set value(v: any) {
          value.value = v;
        },
        get value() {
          return value.value;
        },
        get attrs() {
          return attrs.value;
        },
      };
    },
  });

  const setValue = (key: K, value: T[K]) => {
    setValues({
      ...toRaw(values.value),
      [key]: value,
    });
  };

  return {
    values,
    errors,
    errorBag,
    valid,
    dirty,
    fields,
    isFieldDirty,
    isFieldValid,
    validate,
    resetForm,
    setValues,
    setValue,
  };
}
