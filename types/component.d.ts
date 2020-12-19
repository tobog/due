import Vue from 'vue'


export declare class UIComponent extends Vue {
  static install(vue: typeof Vue): void
}

export type UIComponentSize = 'large' | 'medium' | 'normal' | 'small'

