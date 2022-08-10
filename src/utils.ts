import Vue from "vue";
import {
  VCheckbox,
  VRadio,
  VRangeSlider,
  VSelect,
  VSlider,
  VSwitch,
  VTextarea,
  VTextField,
} from "vuetify/lib";
import { InputLine } from ".";

export const isServer = () => typeof window === "undefined";

export function isObject(obj: any): obj is object {
  return obj !== null && typeof obj === "object";
}

export function mergeDeep<T, S>(source: S, target: T): S & T {
  for (const key in target) {
    // @ts-ignore source and target may share keys
    const sourceProperty = source[key];
    const targetProperty = target[key];

    // Only continue deep merging if
    // both properties are objects
    if (isObject(sourceProperty) && isObject(targetProperty)) {
      // @ts-ignore source and target may share keys
      source[key] = mergeDeep(sourceProperty, targetProperty);
      continue;
    }

    // @ts-ignore source and target may share keys
    source[key] = targetProperty;
  }

  return source as any;
}

export const logger = {
  log(...msgs: any[]) {
    console.log("[v-dynamic-form]", ...msgs);
  },
  warn(...msgs: any[]) {
    console.warn("[v-dynamic-form]", ...msgs);
  },
  info(...msgs: any[]) {
    console.info("[v-dynamic-form]", ...msgs);
  },
  error(...msgs: any[]) {
    console.error("[v-dynamic-form]", ...msgs);
  },
};

export const isBool = <T, V = T extends boolean ? true : false>(v: T): V =>
  (typeof v === "boolean") as any;

export function getSlot(
  vm: Vue,
  name = "default",
  data?: object | (() => object),
  optional = false
) {
  if (Object.prototype.hasOwnProperty.call(vm.$scopedSlots, name)) {
    return vm.$scopedSlots[name]!(data instanceof Function ? data() : data);
  } else if (
    Object.prototype.hasOwnProperty.call(vm.$slots, name) &&
    (!data || optional)
  ) {
    return vm.$slots[name];
  }
  return undefined;
}

export const set = (obj: any, path: any, value: any) => {
  if (Object(obj) !== obj) return obj; // When obj is not an object
  // If not yet an array, get the keys from the string-path
  if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || [];

  const r = path
    .slice(0, -1)
    .reduce((acc: any, key: number | string, i: number) => {
      // Does the key exist and is its value an object?
      if (Object(acc[key]) === acc[key]) {
        return acc[key];
      }

      Vue.set(
        acc,
        key,
        Math.abs(path[i + 1]) >> 0 === +path[i + 1]
          ? [] // Yes: assign a new array object
          : {}
      );

      return acc[key];
    }, obj);

  Vue.set(r, path[path.length - 1], value);

  return obj; // Return the top-level object to allow chaining
};

export const getInputKeys = (
  inputFields: Record<string, InputLine>
): string[] => {
  const keys: string[] = [];

  Object.entries(inputFields).forEach(([field, options]: [string, any]) =>
    keys.push(options.key || field)
  );

  return keys;
};

export const getInputComponent = (input: string) => {
  if (input == "text") return VTextField;
  if (input == "select") return VSelect;
  if (input == "checkbox") return VCheckbox;
  if (input == "slider") return VSlider;
  if (input == "range-slider") return VRangeSlider;
  if (input == "switch") return VSwitch;
  if (input == "textarea") return VTextarea;
  if (input == "radio") return VRadio;
};
