const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  // productionSourceMap: false,
  transpileDependencies: ["vuetify", "vee-validate"],
  configureWebpack: {
    resolve: {
      alias: {
        vue$: path.resolve(__dirname, "node_modules/vue/dist/vue.esm.js"),
        "^vuetify": path.resolve(__dirname, "node_modules/vuetify"),
        // "^vee-validate": path.resolve(__dirname, "node_modules/vee-validate"),
      },
    },
    // externals: {
    //   vue: {
    //     commonjs: "vue",
    //     commonjs2: "vue",
    //     amd: "vue",
    //     root: "Vue",
    //   },
    //   vuetify: {
    //     commonjs: "vuetify",
    //     commonjs2: "vuetify",
    //     amd: "vuetify",
    //     root: "Vuetify",
    //   },
    // },
  },
});
