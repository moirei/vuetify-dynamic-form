import { VCard } from "vuetify/lib";

export default {
  extends: VCard,
  props: {
    value: {},
    title: { type: String, default: "Form" },
    subtitle: String,
    valid: { type: Boolean, default: false },
    highlightBody: { type: Boolean, default: false },
    maxBodyHeight: [Number, String],
    defaults: { type: Object, default: () => ({}) },
    inputFields: { type: Object, default: () => ({}) },
  },
  computed: {
    form: {
      set(value) {
        this.$emit("input", value);
      },
      get() {
        return this.value || this.defaults;
      },
    },
  },
  methods: {
    validate() {
      return this.$refs.input.validate();
    },
    submit() {
      return this.$refs.input.submit();
    },
    loadDataFrom(data) {
      return this.$refs.input.loadDataFrom(data);
    },
  },
};
