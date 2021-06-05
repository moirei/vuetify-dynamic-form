<template>
  <v-dynamic-form v-bind="$props" v-on="$listeners" :input-fields="inputs" />
</template>

<script>
import VDynamicForm from "./VDynamicForm";

export default {
  extends: VDynamicForm,
  data: () => ({
    inputs: {
      name: {
        name: "Full Name",
        rules: "required",
        type: "text",
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
  }),
};
</script>
