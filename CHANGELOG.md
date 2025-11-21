# Vuetify Dynamic Form

## Changelog

### [2.1.0] - 2024-12-XX

**New Features:**

- ✅ Added `useFormInputs` composable for programmatic form management with type-safe field access
- ✅ Type-safe field access via `fields.fieldName.value` and `fields.fieldName.attrs`

**Bug Fixes:**

- Fixed TypeScript linting issue: replaced `{}` type with `Record<string, never>` for empty object type

**Documentation:**

- Added comprehensive documentation for `useFormInputs` composable in README

### [2.0.0] - 2024-XX-XX

#### 🎉 Major Release - Vue 3 Migration

**Breaking Changes:**

- Migrated from Vue 2 to Vue 3
- Migrated from Vuetify 2 to Vuetify 3
- Migrated from vee-validate v3 to v4
- Changed `value` prop to `modelValue`
- Changed `inputFields` prop to `inputs`
- Changed `@input` event to `@update:model-value`

**New Features:**

- ✅ Vue 3 Composition API
- ✅ Nuxt 3 module support with auto-imports
- ✅ Framework-agnostic core (works with/without Nuxt)
- ✅ Better TypeScript support
- ✅ Modern build system (Vite)
- ✅ Enhanced validation options
- ✅ Type casting support (string, number, boolean, integer)
- ✅ Better performance with optimized reactivity

**Improvements:**

- Better type safety throughout
- Modern ESLint configuration
- Improved code organization
- Better documentation

**Migration Guide:**
See README.md for migration instructions from v1.x to v2.x

### [1.3.6] - Final Vue 2 Version

Last stable version for Vue 2 + Vuetify 2 + vee-validate v3
