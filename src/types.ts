import { Component } from "vue";

export interface InputLine {
  name: string;
  input: string;
  rules: string | string[];
  mode: string;
  hideName: boolean;
  props: any;
  line: number | string;
  component: string | Component;
  col?: any;
  hidden?: boolean;
  vid?: string;
  key: string | string[];
}
