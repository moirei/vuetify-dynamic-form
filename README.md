# vuetify-dynamic-form

Defining and creating form components and their validation can be tedious and repetitive. This form allows you to dynamically define form inputs with configurable options.



<img src="./public/form-input.png" alt="demo" width="100%"/>

---

## :green_heart: Features
* Dynamically create form input fields
* Two-way binded form data. Useful when using forms in update context and the implementing component may update/provide the initial data
* Slots to customise field components
* Flexible configuration for validation, auto-grouping, component props, etc.

## Installation

```bash
npm i --save @moirei/vuetify-dynamic-form
# or yarn add @moirei/vuetify-dynamic-form
```



## Usage

```javascript
import Vue from 'vue'
import VDynamicForm from '@moirei/vuetify-dynamic-form'
Vue.use(VDynamicForm)

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
        type: "text",
        line: 1,
        props: {
          filled: true,
        },
      },
      email: {
        name: "Email",
        rules: "required|email",
        type: "text",
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

### props

| Name     | Required? | Default | Type    | Description                                                  |
| ---------------- | --------- | ------- | ------- | ------------------------------------------------------------ |
| `value` | yes       |       | `string`  | The `v-model` input prop       |
| `hide-name` | no        | `false` | `boolean` | Whether to hide input name displayed above the component field |
| `loading` | no        | `false` | `boolean` | Indicates the form or its data is in loading state. All inputs are disabled if true. |
| `defaults` | no        | `{}`  | `object` | Default form values to prepopulate the inputs with |
| `inputFields` | yes      |       | `object` | The dynamic form fields |



### events

| Name     | Description                                       |
| -------- | ------------------------------------------------- |
| `input`  | The `v-model` input event                         |
| `submit` | Emitted when the form is validated and submitted. |



### slots

| Parameter                  | Description                                                  |
| -------------------------- | ------------------------------------------------------------ |
| `field:validation:{field}` | Use to override an input at the **validation-provider** level. |
| `field:{field}`            | Use to override an input at the component level.             |



## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.



## Credits

* [Augustus Okoye](https://github.com/augustusnaz)

## License

[MIT](https://choosealicense.com/licenses/mit/)