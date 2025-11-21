import { FieldInput } from "~/types";

export const get = (
  obj: any,
  path: string | string[],
  defaultValue?: any
): any => {
  const keys = Array.isArray(path) ? path : path.split(".");
  let result = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  return result ?? defaultValue;
};

export const isString = (value: any): value is string =>
  typeof value === "string";

export const isUndefined = (value: any): value is undefined =>
  value === undefined;

export const isObject = (value: any): value is object =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const cloneDeep = <T>(value: T): T => {
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Date) return new Date(value.getTime()) as T;
  if (value instanceof Array) return value.map((item) => cloneDeep(item)) as T;
  if (typeof value === "object") {
    const cloned = {} as T;
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        (cloned as any)[key] = cloneDeep((value as any)[key]);
      }
    }
    return cloned;
  }
  return value;
};

export const max = (array: number[]): number | undefined => {
  if (array.length === 0) return undefined;
  return Math.max(...array);
};

export const sortBy = <T>(
  array: T[],
  iteratee: string | ((item: T) => any)
): T[] => {
  const getValue =
    typeof iteratee === "string"
      ? (item: T) => (item as any)[iteratee]
      : iteratee;

  return [...array].sort((a, b) => {
    const aVal = getValue(a);
    const bVal = getValue(b);
    if (aVal < bVal) return -1;
    if (aVal > bVal) return 1;
    return 0;
  });
};

export const groupBy = <T>(
  array: T[],
  iteratee: string | ((item: T) => string)
): Record<string, T[]> => {
  const getKey =
    typeof iteratee === "string"
      ? (item: T) => String((item as any)[iteratee])
      : iteratee;

  return array.reduce((result, item) => {
    const key = getKey(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

export const upperFirst = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let previous = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(this, args);
      }, remaining);
    }
  };
};

export const omit = <T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = {} as Omit<T, K>;
  for (const key in obj) {
    if (!keys.includes(key as unknown as K)) {
      (result as any)[key] = obj[key];
    }
  }
  return result;
};

export const parseRules = (rules: FieldInput["rules"]): any => {
  if (Array.isArray(rules)) {
    return rules.join("|");
  }
  return rules;
};
