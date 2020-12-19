import Vue from 'vue'

export * from 'vue';
export declare class UIComponent extends Vue {
  static install(vue: typeof Vue): void
}

export type UIComponentSize = 'large' | 'medium' | 'normal' | 'small'
export type UIComponentMedia = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

