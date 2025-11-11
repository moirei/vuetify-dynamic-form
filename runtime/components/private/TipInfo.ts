import { defineComponent, h } from "vue";
import type { PropType } from "vue";
import { VTooltip } from "vuetify/components";
import { omit } from "../../utils/helpers";

export default defineComponent({
  name: "TipInfo",
  inheritAttrs: false,
  props: {
    text: { type: String, default: undefined },
    maxWidth: {
      type: [String, Number] as PropType<string | number>,
      default: 400,
    },
    openOnClick: { type: Boolean, default: true },
    openOnFocus: { type: Boolean, default: true },
  },
  setup(props, { slots, attrs }) {
    return () => {
      return h("span", attrs, [
        h(
          "svg",
          {
            xmlns: "http://www.w3.org/2000/svg",
            width: "16",
            height: "16",
            viewBox: "0 0 16 16",
            class: "ml-1 inline-block align-middle",
            style: { color: "currentColor" },
          },
          [
            h("path", {
              fill: "currentColor",
              "fill-rule": "evenodd",
              d: "M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0M9 5a1 1 0 1 1-2 0a1 1 0 0 1 2 0M6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8z",
              "clip-rule": "evenodd",
            }),
          ]
        ),
        h(
          VTooltip,
          {
            activator: "parent",
            ...omit(props as any, ["text", "attach", "activator"]),
          },
          {
            default: () => slots.default?.() || props.text,
          }
        ),
      ]);
    };
  },
});
