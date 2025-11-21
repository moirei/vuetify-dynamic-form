# @moirei/vuetify-dynamic-form

> Dynamically create Vuetify 3 forms with Vue 3. Works seamlessly with and without Nuxt.

[![npm version](https://img.shields.io/npm/v/@moirei/vuetify-dynamic-form.svg)](https://www.npmjs.com/package/@moirei/vuetify-dynamic-form)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- **Vue 3 + Vuetify 3** - Built with modern Vue 3 Composition API
- **Framework Agnostic** - Works with Vue 3, Nuxt 3, Vite, or any Vue 3 setup
- **vee-validate v4** - Powerful form validation
- **Dynamic Fields** - Define form fields with simple configuration
- **Auto-imports** - Nuxt module with auto-imports (optional)
- **TypeScript** - Full TypeScript support
- **Flexible** - Customizable validation, props, and component overrides
- **Slots** - Extensive slot support for customization

## 📦 Installation

```bash
npm install @moirei/vuetify-dynamic-form
# or
yarn add @moirei/vuetify-dynamic-form
# or
pnpm add @moirei/vuetify-dynamic-form
```

### Peer Dependencies

Make sure you have these installed:

```bash
npm install vue@^3.0.0 vuetify@^3.0.0 vee-validate@^4.0.0
```

## 🚀 Quick Start

### Vue 3 (Non-Nuxt)

```typescript
import { createApp } from "vue";
import VuetifyDynamicForm from "@moirei/vuetify-dynamic-form";
import { createVuetify } from "vuetify";

const app = createApp(App);
const vuetify = createVuetify();

app.use(VuetifyDynamicForm);
app.use(vuetify);
app.mount("#app");
```

### Nuxt 3

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ["@moirei/vuetify-dynamic-form/nuxt"],
});
```

Components and composables will be auto-imported! 🎉

## 📖 Usage

### Basic Example

```vue
<template>
  <VDynamicForm v-model="form" :inputs="inputs" @submit="handleSubmit" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  firstName: "",
  email: "",
});

const inputs = {
  firstName: {
    name: "First Name",
    type: "text",
    rules: "required|max:24",
    props: {
      filled: true,
    },
  },
  email: {
    name: "Email",
    type: "text",
    rules: "required|email",
    props: {
      filled: true,
      placeholder: "name@example.com",
    },
  },
};

const handleSubmit = (values: any) => {
  console.log("Form submitted:", values);
};
</script>
```

### With Nuxt Auto-imports

In Nuxt 3, components are auto-imported, so you can use them directly:

```vue
<template>
  <VDynamicForm v-model="form" :inputs="inputs" />
</template>

<script setup lang="ts">
const form = ref({});
const inputs = {
  /* ... */
};
</script>
```

### Field Configuration

```typescript
const inputs = {
  // Simple text field
  firstName: {
    name: "First Name",
    type: "text",
    rules: "required|max:24",
  },

  // Select field
  country: {
    name: "Country",
    type: "select",
    rules: "required",
    props: {
      items: ["USA", "Canada", "Mexico"],
    },
  },

  // Custom component
  customField: {
    name: "Custom Field",
    component: MyCustomComponent,
    rules: "required",
  },

  // With casting
  age: {
    name: "Age",
    type: "number",
    cast: "integer",
    rules: "required|min_value:18",
  },

  // Multiple fields on same line
  firstName: {
    name: "First Name",
    type: "text",
    line: 1,
    col: { cols: 6 },
  },
  lastName: {
    name: "Last Name",
    type: "text",
    line: 1,
    col: { cols: 6 },
  },
};
```

### Advanced Features

#### Custom Validation

```typescript
import { defineFormInputs } from "@moirei/vuetify-dynamic-form";

const inputs = defineFormInputs({
  email: {
    name: "Email",
    type: "text",
    rules: [
      "required",
      "email",
      (value: string) => {
        if (value.endsWith("@example.com")) {
          return "Cannot use example.com email";
        }
        return true;
      },
    ],
  },
});
```

#### Slots

```vue
<template>
  <VDynamicForm v-model="form" :inputs="inputs">
    <template #firstName:field="{ input, modelValue, handleChange }">
      <VTextField
        :model-value="modelValue"
        @update:model-value="handleChange"
        v-bind="input.props"
      />
    </template>

    <template #before>
      <VCardTitle>Form Title</VCardTitle>
    </template>

    <template #after>
      <VCardActions>
        <VBtn @click="reset">Reset</VBtn>
      </VCardActions>
    </template>
  </VDynamicForm>
</template>
```

#### Form Methods

```vue
<template>
  <VDynamicForm ref="formRef" v-model="form" :inputs="inputs" />
</template>

<script setup lang="ts">
import { ref } from "vue";

const formRef = ref();

// Validate form
const validate = async () => {
  const isValid = await formRef.value?.validate();
  if (isValid) {
    // Form is valid
  }
};

// Validate specific field
const validateField = async (field: string) => {
  await formRef.value?.validateField(field);
};
</script>
```

#### Form State Tracking

Use `v-model:valid`, `v-model:dirty`, and `v-model:errors` to track form state:

```vue
<template>
  <VDynamicForm
    v-model="form"
    v-model:valid="isValid"
    v-model:dirty="isDirty"
    v-model:errors="formErrors"
    :inputs="inputs"
  >
    <template #after>
      <VCardActions>
        <VBtn
          :disabled="!isValid || !isDirty"
          color="primary"
          @click="handleSubmit"
        >
          Save Changes
        </VBtn>
        <VBtn :disabled="!isDirty" @click="handleReset"> Reset </VBtn>
      </VCardActions>

      <!-- Display errors -->
      <VAlert
        v-if="Object.keys(formErrors).length > 0"
        type="error"
        class="mt-4"
      >
        <div v-for="(error, field) in formErrors" :key="field">
          <strong>{{ field }}:</strong> {{ error }}
        </div>
      </VAlert>
    </template>
  </VDynamicForm>
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  firstName: "",
  email: "",
});

const isValid = ref(false);
const isDirty = ref(false);
const formErrors = ref<Record<string, string>>({});

const inputs = {
  firstName: {
    name: "First Name",
    type: "text",
    rules: "required|max:24",
  },
  email: {
    name: "Email",
    type: "text",
    rules: "required|email",
  },
};

const handleSubmit = () => {
  if (isValid.value) {
    console.log("Form submitted:", form.value);
    // Submit logic here
  }
};

const handleReset = () => {
  form.value = {
    firstName: "",
    email: "",
  };
  // Form will reset dirty state automatically
};
</script>
```

**State Tracking Use Cases:**

- **`v-model:valid`** - Enable/disable submit buttons, show validation indicators
- **`v-model:dirty`** - Show unsaved changes warnings, enable reset buttons
- **`v-model:errors`** - Display error summaries, track validation issues

### Using `useFormInputs` Composable

The `useFormInputs` composable provides a programmatic way to manage form inputs with type-safe field access. It's perfect for custom form layouts where you want full control over rendering.

```vue
<template>
  <VTextField
    v-model="fields.name.value"
    v-bind="fields.name.attrs"
    placeholder="Project name"
  />

  <VTextarea
    v-model="fields.description.value"
    v-bind="fields.description.attrs"
    placeholder="Add description"
  />

  <VBtn :disabled="!valid" @click="handleSubmit"> Submit </VBtn>
</template>

<script setup lang="ts">
import { useFormInputs } from "@moirei/vuetify-dynamic-form";

type ProjectInput = {
  name: string;
  description?: string;
  team: string;
};

const { fields, valid, values, setValue } = useFormInputs<ProjectInput>({
  name: "required|max:100",
  description: "max:500",
  team: "required",
});

const handleSubmit = () => {
  console.log("Form values:", values.value);
};
</script>
```

**Key Features:**

- **Type-safe**: TypeScript ensures required fields are provided and optional fields are truly optional
- **Field access**: Access fields via `fields.fieldName.value` and `fields.fieldName.attrs`
- **Validation**: Built-in validation with `valid` computed property
- **Values**: Access all form values via `values` ref
- **Set values**: Use `setValue(key, value)` to programmatically set field values

**Field Definition:**

Fields can be defined as:

- **String** (validation rules): `"required|email"`
- **Object** (full field config): `{ rules: "required", label: "Email" }`

**Returned Properties:**

| Property       | Type                            | Description                                      |
| -------------- | ------------------------------- | ------------------------------------------------ |
| `fields`       | `Record<K, Field<T[K]>>`        | Object with field accessors (`.value`, `.attrs`) |
| `valid`        | `ComputedRef<boolean>`          | Form validation state                            |
| `dirty`        | `ComputedRef<boolean>`          | Form dirty state                                 |
| `values`       | `Ref<T>`                        | All form values                                  |
| `errors`       | `Ref<Record<string, string>>`   | Field errors                                     |
| `errorBag`     | `Ref<ErrorBag>`                 | Detailed error information                       |
| `setValue`     | `(key: K, value: T[K]) => void` | Set a field value                                |
| `setValues`    | `(values: Partial<T>) => void`  | Set multiple field values                        |
| `validate`     | `() => Promise<boolean>`        | Validate the form                                |
| `resetForm`    | `() => void`                    | Reset form to initial state                      |
| `isFieldDirty` | `(field: string) => boolean`    | Check if field is dirty                          |
| `isFieldValid` | `(field: string) => boolean`    | Check if field is valid                          |

**Advanced Options:**

```typescript
const { fields, valid } = useFormInputs<FormType>({
  inputs: {
    email: { rules: "required|email", label: "Email Address" },
    name: "required|min:3",
  },
  initialState: { email: "user@example.com" },
  validateOnMount: true,
  validateOnBlur: true,
  validateOnChange: true,
});
```

## 📚 API Reference

### VDynamicForm Props

| Prop                    | Type                  | Default      | Description                  |
| ----------------------- | --------------------- | ------------ | ---------------------------- |
| `modelValue`            | `Record<string, any>` | `{}`         | Form data (v-model)          |
| `inputs`                | `FieldInputs`         | **required** | Field configuration          |
| `defaults`              | `Record<string, any>` | `{}`         | Default values               |
| `defaultProps`          | `Record<string, any>` | `{}`         | Default props for all fields |
| `loading`               | `boolean`             | `false`      | Loading state                |
| `readonly`              | `boolean`             | `false`      | Readonly state               |
| `disabled`              | `boolean`             | `false`      | Disabled state               |
| `tag`                   | `string`              | `'form'`     | Root element tag             |
| `validateOnBlur`        | `boolean`             | `true`       | Validate on blur             |
| `validateOnChange`      | `boolean`             | `true`       | Validate on change           |
| `validateOnInput`       | `boolean`             | `true`       | Validate on input            |
| `validateOnModelUpdate` | `boolean`             | `true`       | Validate on model update     |
| `validateOnMount`       | `boolean`             | `false`      | Validate on mount            |

### VDynamicForm Events

| Event               | Payload                  | Description                           |
| ------------------- | ------------------------ | ------------------------------------- |
| `update:modelValue` | `Record<string, any>`    | Emitted when form values change       |
| `update:valid`      | `boolean`                | Emitted when validation state changes |
| `update:dirty`      | `boolean`                | Emitted when dirty state changes      |
| `update:errors`     | `Record<string, string>` | Emitted when errors change            |
| `submit`            | `Record<string, any>`    | Emitted on form submit                |

### FieldInput Type

```typescript
interface FieldInput {
  key: string; // Required
  name?: string;
  label?: string;
  type?:
    | "text"
    | "select"
    | "checkbox"
    | "slider"
    | "range-slider"
    | "switch"
    | "textarea"
    | "number"
    | "radio";
  component?: string | Component;
  rules?: string | string[] | Schema | Function | Record<string, any>;
  props?: Record<string, any>;
  col?: Record<string, any>;
  line?: number | string;
  hidden?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  loading?: boolean;
  hideName?: boolean;
  wheelEvents?: boolean;
  confirmEdit?: boolean;
  cast?: "string" | "number" | "boolean" | "integer";
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  validateOnInput?: boolean;
  validateOnModelUpdate?: boolean;
}
```

## 🔄 Migration from v1.x (Vue 2)

### Breaking Changes

1. **Vue 3 Required** - This version requires Vue 3
2. **Prop Changes**:
   - `value` → `modelValue`
   - `inputFields` → `inputs`
   - `@input` → `@update:model-value`
3. **Validation** - Now uses vee-validate v4 (different API)
4. **Type Changes** - Field configuration structure has changed

### Migration Example

**Before (v1.x):**

```vue
<VDynamicForm v-model="form" :input-fields="inputFields" />
```

**After (v2.x):**

```vue
<VDynamicForm v-model="form" :inputs="inputs" />
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

## 📝 License

MIT © [Augustus Okoye](https://github.com/moirei)

## 🙏 Acknowledgments

Built with:

- [Vue 3](https://vuejs.org/)
- [Vuetify 3](https://vuetifyjs.com/)
- [vee-validate](https://vee-validate.logaretm.com/)
