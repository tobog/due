import {UIComponent, VNode, UIComponenTheme, UIComponentSize} from "./component"

export declare class Button extends UIComponent {
    /**
     * 按钮主题，可选值为"success" | "primary" | "normal" | "error" | "warning" | "info"或者不设置
     */
    theme?: UIComponenTheme
    /**
     * 幽灵属性，使按钮背景透明
     * @default false
     */
    ghost?: boolean
    /**
     * 按钮大小，可选值为"large" | "medium" | "normal" | "small"或者12,12px
     * @default normal
     */
    size?: UIComponentSize | Number | String
    /**
     * 按钮形状，可选值为"round" | "circle" | "square"
     */
    shape?: "round" | "circle" | "square"
    /**
     * 开启后，按钮的长度为 100%
     * @default false
     */
    long?: boolean
    /**
     * 设置button原生的type，可选值为button、submit、reset等等
     * @default button
     */
    type?: "button" | "submit" | "reset"
    /**
     * 设置按钮为禁用状态
     * @default false
     */
    disabled?: boolean
    /**
     * 设置按钮为加载中状态
     * @default false
     */
    loading?: boolean
    /**
     * 设置按钮的图标类型
     */
    icon?: string
    /**
     * 自定义颜色
     */
    color?: string
    /**
     * 朴素按钮
     */
    plain?: string
    /**
     * 边框类型，可选值为dashed"|"text"|"default"
     */
    borderType?: "dashed" | "text" | "default"
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 显示内容
         */
        default: VNode[]
        /**
         * 自定义图标类型
         */
        icon: VNode[]
    }
}

export declare class ButtonGroup extends UIComponent {
    /**
     * 组合按钮形状，可选值为"round" | "circle" | "square"
     */
    shape?: "round" | "circle" | "square"
    /**
     * 组合按钮大小，可选值为"large" | "medium" | "normal" | "small
     * @default normal
     */
    size?: UIComponentSize
    /**
     * 是否纵向排列按钮组
     * @default false
     */
    vertical?: boolean
    /**
     * 是否紧凑排列
     * @default false
     */
    compact?: boolean
    /**
     * 按钮主题，可选值为"success" | "primary" | "normal" | "error" | "warning" | "info"或者不设置
     */
    theme?: UIComponenTheme
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * Button 子元素
         */
        default: VNode[]
    }
}
