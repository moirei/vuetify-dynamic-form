import type { Component } from "vue";
import {
  VCheckbox,
  VRadio,
  VRangeSlider,
  VSelect,
  VSlider,
  VSwitch,
  VTextarea,
  VTextField,
} from "vuetify/components";
// VNumberInput may not be available in all Vuetify versions - use VTextField as fallback
let VNumberInput: Component | string | undefined;
import {
  get,
  groupBy,
  isString,
  isUndefined,
  max,
  sortBy,
  upperFirst,
} from "./utils/helpers";
import type { FieldInput, FieldInputs, InputLine, Schema } from "./types";

type FieldDefaults = Pick<
  FieldInput,
  | "disabled"
  | "readonly"
  | "loading"
  | "validateOnBlur"
  | "validateOnChange"
  | "validateOnInput"
  | "validateOnModelUpdate"
>;

export const getInputComponent = (
  input?: string
): Component | string | undefined => {
  if (input == "text") return VTextField;
  if (input == "select") return VSelect;
  if (input == "checkbox") return VCheckbox;
  if (input == "slider") return VSlider;
  if (input == "range-slider") return VRangeSlider;
  if (input == "switch") return VSwitch;
  if (input == "textarea") return VTextarea;
  if (input == "number") return VNumberInput || VTextField;
  if (input == "radio") return VRadio;
};

export const isEvent = (value: any): value is Event =>
  typeof value == "object" && value instanceof Event;

export const error = (message: string): never => {
  throw new Error(`[v-dynamic-form] ${message}`);
};

export const castValue = (value: any, cast: FieldInput["cast"]): unknown => {
  if (cast) {
    if (cast === "boolean") {
      return !!value;
    }
    if (cast === "integer") {
      return parseInt(value);
    }
    if (cast === "number") {
      return Number(value);
    }
    if (cast === "string") {
      return String(value);
    }
  }
  return value;
};

const parseRules = (rules: FieldInput["rules"]): any => {
  if (Array.isArray(rules)) {
    return rules.join("|");
  }
  return rules;
};

const extractFieldDefaults = (
  field: FieldInput,
  defaults: any
): FieldDefaults => {
  const extract = <K extends keyof FieldDefaults>(key: K): FieldDefaults[K] =>
    defaults[key] ||
    (!isUndefined(get(field.props, key))
      ? get(field.props, key)
      : get(defaults, key));

  return {
    loading: extract("loading"),
    disabled: extract("disabled"),
    readonly: extract("readonly"),
    validateOnBlur: extract("validateOnBlur"),
    validateOnChange: extract("validateOnChange"),
    validateOnInput: extract("validateOnInput"),
    validateOnModelUpdate: extract("validateOnModelUpdate"),
  };
};

export const parseFieldsInput = (
  inputs: FieldInputs,
  defaultProps: any,
  defaults: FieldDefaults
) => {
  const fields: FieldInput[] = [];

  const schema: Record<string, Schema | string | undefined> = {};
  const casts: Record<string, FieldInput["cast"]> = {};

  const inputsRecord = Array.isArray(inputs)
    ? Object.fromEntries(
        inputs.map((item, idx) => [item.key || String(idx), item])
      )
    : (inputs as Record<string, FieldInput>);

  for (const key in inputsRecord) {
    const input: FieldInput = Object.assign(
      {},
      inputsRecord[key] as FieldInput
    );
    if (isString(key)) {
      if (!input.name) {
        input.name = upperFirst(key);
      }
      if (!input.key) {
        input.key = key;
      }
    }
    if (!input.hidden) {
      schema[input.key] = parseRules(input.rules);
    }
    fields.push(input);
  }

  const getComponent = ({ type, component, props: fieldProps }: FieldInput) => {
    if (component) return component;

    // Auto-detect textarea if rows prop is present and type is not specified
    if (!type && fieldProps?.rows) {
      return VTextarea;
    }

    const inputComponent = getInputComponent(type);
    // Default to VTextField if no type specified
    return inputComponent || VTextField;
  };

  const groupItems = (items: InputLine[]): Record<string, InputLine[]> => {
    const n: number = max(items.map((item: any) => item.line || 0)) || 0;

    const chain = (x: InputLine[]) => {
      const a = x.map((item, i): InputLine => {
        if (item.line === undefined) {
          item.line = n + i;
        } else {
          const lineNum = Number(item.line);
          if (isNaN(lineNum)) {
            item.line = n + i;
          } else {
            item.line = lineNum + n;
          }
        }
        return item;
      });

      const b = sortBy(a, "line");
      const c = groupBy(b, "line");

      return c;
    };

    return chain(items);
  };

  const inputItems = fields.map((field): InputLine => {
    const key = field.key || field.name;
    if (!key) {
      error("Input field name or key is required");
    }

    const name = upperFirst(field.name || field.key);

    if (field.cast) {
      casts[String(key)] = field.cast;
    }

    return {
      ...field,
      name,
      key: key!,
      label: field.label || field.props?.label,
      hidden: field.hidden || false,
      component: getComponent(field),
      ...extractFieldDefaults(field, defaults),
      props: {
        ...defaultProps,
        ...(field.hideName &&
        (defaultProps?.hideDetails || field.props?.hideDetails)
          ? {
              label: field.label || field.props?.label || name,
              placeholder: field.label || field.props?.placeholder || name,
            }
          : {}),
        ...field.props,
      },
    } as InputLine;
  });

  const lines = groupItems(inputItems);

  return {
    schema,
    lines,
    casts,
  };
};
