import { isObject } from "../utils/helpers";
import { markRaw } from "vue";
import type { FieldInputWithoutKey, FieldInputsWithoutKey } from "../types";

export const defineFormInput = <T extends FieldInputWithoutKey>(
  input: T
): T => {
  if (input.component && isObject(input.component)) {
    input.component = markRaw(input.component);
  }
  return input;
};

export const defineFormInputs = <T extends FieldInputsWithoutKey>(
  inputs: T
): T => {
  for (const name in inputs) {
    inputs[name] = defineFormInput(inputs[name] as any);
  }
  return inputs;
};
