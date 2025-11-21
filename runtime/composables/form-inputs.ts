import { computed, toRaw } from "vue";
import { useForm as useVeeValidateForm } from "vee-validate";
import { FieldInputWithoutKey } from "~/types";
import { isString, parseRules, upperFirst } from "../utils/helpers";

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
  return !("inputs" in options);
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
