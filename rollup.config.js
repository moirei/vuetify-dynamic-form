import commonjs from "rollup-plugin-commonjs";
import vue from "rollup-plugin-vue";
import typescript from "rollup-plugin-typescript2";
import alias from "rollup-plugin-alias";
import postcss from "rollup-plugin-postcss";
import nodeResolve from "rollup-plugin-node-resolve";
import ttypescript from "ttypescript";
import { join } from "path";
import postcssPresetEnv from "postcss-preset-env";
import babel from "rollup-plugin-babel";
import replace from "rollup-plugin-replace";

const isProduction = process.env.BUILD === "production";
const srcDir = join(__dirname, "src");
const distDir = join(__dirname, "dist");

export default async () => [
  // You can also get a more optimized wrapper by creating dedicated builds for the formats “cjs” (Node), “amd” or “iife” (script tag)
  await getConfig({
    optimize: true,
    output: {
      file: join(distDir, "bundle-umd.js"),
      format: "umd",
      esModule: true
    }
    // no matter what output.format, the main thing is to generate a css file once, and not for each assembly (config)
    // generateCssFile: join(distDir, 'main.css')
  }),
  await getConfig({
    optimize: true,
    output: {
      file: join(distDir, "bundle-esm.js"),
      format: "esm",
      // this is a separate assembly for ES modules
      esModule: true
    }
  }),
  await getConfig({
    optimize: true,
    output: {
      file: join(distDir, "bundle-cjs.js"),
      format: "cjs"
    }
  }),
  await getConfig({
    optimize: true,
    output: {
      file: join(distDir, "bundle-iife.js"),
      format: "iife"
    }
  })
];

const globals = {
  vue: "Vue",
  // https://github.com/vuejs/vue-class-component/blob/master/build/build.js
  // 'vue-class-component': 'VueClassComponent',
  // https://github.com/kaorun343/vue-property-decorator/blob/master/rollup.config.js
  // 'vue-property-decorator': 'VuePropertyDecorator',
  vuetify: "Vuetify",
  "vuetify/lib": "Vuetify",
  lodash: "lodash"
};

async function getConfig({
  optimize = false,
  output: { file, format, esModule = false },
  plugins = []
}) {
  return {
    input: join(srcDir, "main.ts"),
    output: {
      esModule,
      file,
      format,
      exports: "named",
      // Used in umd and in iife
      name: "vuetifyDynamicForm",
      globals
    },
    external: Object.keys(globals),
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production")
      }),
      alias({
        resolve: [".ts", ".js", ".vue"],
        "~": srcDir
      }),
      // TODO before nodeResolve was after commonjs (but in github I saw in that order)
      nodeResolve({
        mainFields: ["module", "main", "browser"],
        extensions: [".ts", ".js", ".vue", ".json"]
      }),
      typescript({
        // this fixes Unknown object type "asyncfunction"
        // https://github.com/ezolenko/rollup-plugin-typescript2/issues/105
        clean: true,
        typescript: ttypescript
      }),
      commonjs({
        extensions: [".ts", ".js"],
        namedExports: {
          "node_modules/lodash/lodash.js": [
            "get",
            "startCase",
            "max",
            "chain",
            "isUndefined",
            "cloneDeep",
            "tap"
          ]
        }
      }),
      // TODO autoprefixer (update: isn't it in postcssPresetEnv?)
      postcss({
        // TODO for each config, its own main.css is generated (the same file), fix
        extract: join(distDir, "main.css"),
        minimize: true,
        plugins: [postcssPresetEnv]
      }),
      vue({
        defaultLang: { script: "ts" },
        // Inject CSS in JavaScript. Setting css: false would extract styles in a .css file.
        css: false
      }),
      // transpiles
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true,
        extensions: [".js", ".ts"]
      }),
      // optimization
      optimize &&
        isProduction &&
        (await import("rollup-plugin-terser")).terser(),
      ...plugins
    ]
  };
}
