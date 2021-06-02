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
          form: {{ form }}
          <v-card>
            <v-card-text>
              <v-dynamic-form v-model="form" :input-fields="inputs" />
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    form: {},
    inputs: {
      name: {
        name: "Name",
        rules: "required",
        type: "text",
        line: 1,
        props: {
          filled: true,
        },
        // style: {},
        // col: {},
      },
    },
  }),
};
</script>

<style>
#app {
  background-color: #e6ebf1;
}
</style>
