<template>
  <v-app>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <div class="text-center">
            <v-avatar size="50">
              <img alt="Vue logo" src="./assets/logo.png" />
            </v-avatar>
          </div>
          <div class="text-center my-5 text-h5 font-weight-bold">
            vuetify-dynamic-form
          </div>
          <v-card>
            <v-card-text>
              <v-card-text>Form</v-card-text>
              <v-dynamic-form v-model="form" :input-fields="inputs" />
            </v-card-text>
          </v-card>
          <p>form data: {{ form }}</p>

          <v-card class="mt-10">
            <v-card-text>
              <v-card-text>Custom Form</v-card-text>
              <custom-form v-model="custom_form" :valid.sync="valid" />
            </v-card-text>
          </v-card>
          <p>custom form data: {{ custom_form }}</p>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import { extend, setInteractionMode } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";
import CustomForm from "./components/CustomForm";

setInteractionMode("eager");

extend("required", {
  ...required,
  message: "{_field_} can not be empty",
});

extend("email", {
  ...email,
  message: "{_field_} must be an email address",
});

export default {
  name: "App",
  components: { CustomForm },
  data: () => ({
    valid: false,
    form: {},
    custom_form: {
      name: "James Franco",
    },
    inputs: {
      first_name: {
        name: "First Name",
        rules: "required",
        type: "text",
        line: 1,
        props: {
          filled: true,
        },
      },
      last_name: {
        name: "Last Name",
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
      // verified: {
      //   name: "Verified",
      //   type: "checkbox",
      //   props: {
      //     filled: true,
      //     label: "Option",
      //     // type: "checkbox",
      //     // value: "1",
      //   },
      // },
    },
  }),
};
</script>

<style>
#app {
  background-color: #e6ebf1;
}
</style>
