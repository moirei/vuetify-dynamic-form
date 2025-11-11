import type { Component } from "vue";
import type { useForm } from "vee-validate";

// Helper type for Partial with specific keys required
type PartialProp<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

// yup schema
export type Schema = any;

export type FieldInputWithoutKey = PartialProp<FieldInput, "key">;

export type FieldInputsWithoutKey = Record<string, FieldInputWithoutKey>;

export type FieldInputs = FieldInputsWithoutKey | FieldInput[];

export type InputLine = {
  label?: string;
  name: string;
  key: string | string[];
  hideName?: boolean;
  rules?: string | string[] | Schema | { (): unknown } | Record<string, any>;
  props?: any;
  class?: any;
  tipInfo?:
    | string
    | {
        text: string;
        [props: string]: any;
      };
  line?: number | string;
  component: string | Component;
  col?: any;
  hidden?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  /** Enable wheel events. By default, wheel effects are disabled so that inputs aren't changed when scrolling through forms. */
  wheelEvents?: boolean;
  confirmEdit?: boolean;
};

export type FieldInput = Partial<
  InputLine & {
    type:
      | "text"
      | "select"
      | "checkbox"
      | "slider"
      | "range-slider"
      | "switch"
      | "textarea"
      | "number"
      | "radio";
    cast: "string" | "number" | "boolean" | "integer";
    validateOnBlur: boolean;
    validateOnChange: boolean;
    validateOnInput: boolean;
    validateOnModelUpdate: boolean;
  }
> & {
  // key is required
  key: string;
};

export type FormContext = ReturnType<typeof useForm>;
