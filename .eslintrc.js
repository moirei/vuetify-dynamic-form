// Warnings are errors in CI
const OFF = "off";
const ERROR = "error";
// const WARNING = isTruthy(process.env.CI) ? ERROR : 'warn'

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  extends: [
    // add more generic rulesets here, such as:
    "eslint:recommended",
    "standard",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/recommended",
    "prettier"
  ],
  // plugins: [
  //   '@typescript-eslint'
  //   // '@typescript-eslint/tslint'
  // ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json"
  },
  rules: {
    // works via @typescript-eslint/indent
    indent: OFF,
    semi: [2, "always"],
    quotes: "double",
    // does not work correctly for the constructor typescript: constructor (public text) {}
    "no-useless-constructor": OFF,
    "no-console": OFF,

    "@typescript-eslint/explicit-member-accessibility": "no-public",
    "@typescript-eslint/no-use-before-define": OFF,
    "@typescript-eslint/explicit-function-return-type": OFF,
    "@typescript-eslint/indent": [ERROR, 2],
    "@typescript-eslint/member-delimiter-style": [
      ERROR,
      {
        multiline: {
          delimiter: "none",
          requireLast: false
        },
        singleline: {
          delimiter: "semi",
          requireLast: false
        }
      }
    ],
    "@typescript-eslint/no-parameter-properties": OFF,
    // allows "require" from Node.js
    "@typescript-eslint/no-var-requires": OFF,
    // allows 'any' type
    "@typescript-eslint/no-explicit-any": OFF,
    // allows non null assertion
    "@typescript-eslint/no-non-null-assertion": OFF
    // tslint config integration for eslint
    // '@typescript-eslint/tslint/config': [WARNING, {
    //   'lintFile': './tslint.json', // path to tslint.json of your project
    // }]
  }
};

// function isTruthy (value) {
//   return value && ['1', 'true'].includes(value.toLowerCase())
// }
