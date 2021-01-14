import Vue from "vue"

export * from "vue"
export declare class UIComponent extends Vue {
    static install(vue: typeof Vue): void
}

export type UIComponentSize = "large" | "medium" | "normal" | "small"
export type UIComponentMedia = "xs" | "sm" | "md" | "lg" | "xl" | "xxl"

export type UIComponenTheme = "success" | "primary" | "normal" | "error" | "warning" | "info"

export type UIComponentPlacement = "top" | "top-left" | "top-right" | "top-center" | "top-fix" | "bottom" | "bottom-left" | "bottom-right" | "bottom-center" | "bottom-fix" | "left" | "left-top" | "left-bottom" | "left-center" | "right" | "right-top" | "right-bottom" | "right-center" | "fix-left" | "fix-right" | "fix-center"
