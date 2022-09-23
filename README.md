# vuetify-dynamic-form (Vue 2)

Defining and creating form components and their validation can be tedious and repetitive. This package allows you to dynamically define form inputs with configurable options.

<img src="./public/form-input.PNG" alt="demo" width="100%"/>

---

## :green_heart: Features

- Dynamically create form input fields
- Two-way binded form data. Useful when using forms in update context and the implementing component may update/provide the initial data
- [vee-validate v3](https://vee-validate.logaretm.com/v3) validation
- Slots to customise field components
- Flexible configuration for validation, auto-grouping, component props, etc.

## Installation

```bash
npm i --save @moirei/vuetify-dynamic-form
# or yarn add @moirei/vuetify-dynamic-form
```

## Usage

```javascript
import Vue from 'vue'
import VDynamicForm from '@moirei/vuetify-dynamic-form'
import CustomComponent from './CustomComponent'

Vue.use(VDynamicForm)

// Or with options
Vue.use(VDynamicForm, {
  interactionMode: "aggressive",
})

new Vue({}).$mount('#app')

// then inside your vue components
export default Vue.extend({
  data: () => ({
    form: {},
    inputs: {
      first_name: {
        name: "First Name",
        rules: "required|max:24",
        type: "text",
        line: 1,
        props: {
          filled: true,
        },
      },
      last_name: {
        name: "Last Name",
        rules: "max:24",
        component: "v-text-field", // Use a compnent name
        line: 1,
        props: {
          filled: true,
        },
      },
      address: {
        name: "Address",
        component: CustomComponent, // Use a component
        props: {
          filled: true,
        },
      },
    },
  })
})

<template>
  <v-dynamic-form v-model="form" :input-fields="inputs" />
</template>
```

## API

### Props

| Name                     | Required? | Default | Type      | Description                                                                                                                                                                                            |
| ------------------------ | --------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `value`                  | yes       |         | `string`  | The `v-model` input prop                                                                                                                                                                               |
| `hide-name`              | no        | `false` | `boolean` | Whether to hide input name displayed above the component field                                                                                                                                         |
| `loading`                | no        | `false` | `boolean` | Indicates the form or its data is in loading state. All inputs are disabled if true.                                                                                                                   |
| `readonly`               | no        | `false` | `boolean` | Sets all inputs to readonly                                                                                                                                                                            |
| `disabled`               | no        | `false` | `boolean` | Disables all inputs                                                                                                                                                                                    |
| `disable-object-rewrite` | no        | `false` | `boolean` | Do not clone and emit new object for form data. When enabled, field input property is updated on the form data and the `input` event is not fired.                                                     |
| `hide-actions`           | no        | `false` | `boolean` | Hides the **SUBMIT** and **CLEAR** actions                                                                                                                                                             |
| `defaults`               | no        | `{}`    | `object`  | Default form values to prepopulate the inputs with                                                                                                                                                     |
| `interaction-mode`       | no        |         | `string`  | Set the default [interaction mode](https://vee-validate.logaretm.com/v2/guide/interaction.html#configuration) for all inputs                                                                           |
| `input-fields`           | yes       |         | `object`  | The dynamic form fields                                                                                                                                                                                |
| `nested-fields`          | no        | `false` | `boolean` | Allow nested fields. When true, field names like `"address.line1"` will be saved as property `line1` in object `address` within the form data. To use array as nested key, use the `key` field option. |
| `valid`                  | no        |         | `boolean` | Form validation state. Use with `valid.sync`.                                                                                                                                                          |

### Field options

| Field                  | Default                                                     | Type                  | Description                                                                                                                 |
| ---------------------- | ----------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `col`                  |                                                             | `object`              | Props to bind to `v-col` with multiple fields in one line                                                                   |
| `component`            |                                                             | `string`\|`Component` |                                                                                                                             |
| `hideName`/`hide-name` | `false`                                                     | `boolean`             | Hide the input display name                                                                                                 |
| `key`                  | Field key                                                   | `string`              | `string[]`                                                                                                                  | Specify the field key in the form data |
| `props`                |                                                             | `object`              | Input component props                                                                                                       |
| `rules`                |                                                             | `string`\|`array`     | [Vee-validate](https://vee-validate.logaretm.com) rules                                                                     |
| `type`                 | Uses `<input >` tag if empty and `component` is also empty. | `string`              | Vuetify input types. Valid values: `text`, `select`, `checkbox`, `slider`, `range-slider`, `switch`, `textarea` and `radio` |
| `mode`                 | `aggressive`                                                | `string`              | Vee-validate mode                                                                                                           |
| `name`                 | Field key                                                   | `string`              | The input display name                                                                                                      |
| `vid`                  | Field key                                                   | `string`              | Input field validation ID                                                                                                   |

### Plugin options

| Field             | Default        | Type     | Description                               |
| ----------------- | -------------- | -------- | ----------------------------------------- |
| `interactionMode` | `"aggressive"` | `string` | Configure global default interaction mode |

### Events

| Name           | Description                                       |
| -------------- | ------------------------------------------------- |
| `input`        | The `v-model` input event                         |
| `submit`       | Emitted when the form is validated and submitted. |
| `update:valid` | The `valid.sync` prop event                       |

### Slots

| Name                       | Description                                                    | Props                           |
| -------------------------- | -------------------------------------------------------------- | ------------------------------- |
| `field:validation:{field}` | Use to override an input at the **validation-provider** level. | `{ field }`                     |
| `field:{field}`            | Use to override an input at the component level.               | `{ ...field, invalid, errors }` |
| `actions`                  | Use to override the default **SUBMIT** and **CLEAR** actions   | `{ submit, clear, invalid }`    |

### Functions

| Name       | Description                                 |
| ---------- | ------------------------------------------- |
| `submit`   | Validates and emits `submit` event if valid |
| `clear`    | Resets the form data and validation states  |
| `reset`    | Reset the validation observer               |
| `validate` | Validates all inputs and child forms        |

### Classes

| Name                      | Description                             |
| ------------------------- | --------------------------------------- |
| `v-dynamic-form`          | The components class                    |
| `v-dynamic-form--inputs`  | The class group for all inputs          |
| `v-dynamic-form--actions` | The class group for the default actions |

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Changelog

Please see [CHANGELOG](./CHANGELOG.md).

## Credits

- [Augustus Okoye](https://github.com/augustusnaz)

## License

[MIT](https://choosealicense.com/licenses/mit/)
