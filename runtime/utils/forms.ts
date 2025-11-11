import { provide, inject } from "vue";
import { error } from "../_utils";
import type { FormContext } from "../types";

export const provideForm = (form: FormContext) => {
  provide("__form__", form);
};

export const injectForm = () => {
  const form = inject<FormContext>("__form__");
  if (!form) {
    error("Form undefined. VDynamicFormField must be used inside VDynamicForm");
  }
  return form;
};

