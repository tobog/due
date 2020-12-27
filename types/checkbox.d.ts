import { UIComponent, VNode, UIComponentSize, UIComponenTheme } from "./component";

export declare class Checkbox extends UIComponent {
    /**
     * 只在单独使用时有效。可以使用 v-model(on-change) 双向绑定数据
     * @default false
     */
    value?: string | number | boolean | any[];
    /**
     * 只在组合使用时有效。指定当前选项的 value 值，组合会自动判断是否选中
     */
    label?: string;
    /**
     * 是否显示边框
     * @default false
     */
    border?: boolean;
    /**
     * 是否仅读
     * @default false
     */
    readonly?: boolean;
    /**
     * 是否严格匹配
     * @default false
     */
    strict?: boolean;
    /**
     * 是否radio样式显示
     * @default false
     */
    radio?: boolean;
    /**
     * 是否反选
     * @default false
     */
    reverse?: boolean;
    /**
     * 是否幽灵模式
     * @default false
     */
    ghost?: boolean;
    /**
     * 主题颜色 可选值"success" | "primary" | "normal" | "error" | "warning" | "info"
     * @default false
     */
    theme?: UIComponenTheme;
    /**
     * 图标
     * @default false
     */
    trueIcon?: string;
    /**
     * 是否禁用当前项
     * @default false
     */
    disabled?: boolean;
    /**
     * 设置 indeterminate 状态，只负责样式控制
     * @default false
     */
    indeterminate?: boolean;
    /**
     * 多选框的尺寸，可选值"large" | "medium" | "normal" | "small"
     */
    size?: UIComponentSize;
    /**
     * 选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
     * @default true
     */
    trueValue?: string | number | boolean;
    /**
     * 没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用
     * @default undefined
     */
    falseValue?: string | number | boolean;
    /**
     * form表单name
     */
    name?: string;
    /**
     * 只在单独使用时有效。在选项状态发生改变时触发，通过修改外部的数据改变时不会触发
     */
    $emit(eventName: "on-change", value: any): this;
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 自定义渲染子元素
         */
        default: VNode[];
        /**
         * 自定义checkbox样式
         */
        content: VNode[];
    };
}

export declare class CheckboxGroup extends UIComponent {
    /**
     * 指定选中项目的集合，可以使用 v-model 双向绑定数据
     * @default []
     */
    value?: string[] | number[] | boolean[];
    /**
     * 多选框的尺寸，可选值"large" | "medium" | "normal" | "small"
     */
    size?: UIComponentSize;
    /**
     * 是否仅读
     * @default false
     */
    readonly?: boolean;
    /**
     * 主题颜色 可选值"success" | "primary" | "normal" | "error" | "warning" | "info"
     * @default false
     */
    theme?: UIComponenTheme;
    /**
     * 最小选中个数
     */
    min?: number;
    /**
     * 最大选中个数
     */
    max?: number;
    /**
     * 在选项状态发生改变时触发，返回已选中的数组。通过修改外部的数据改变时不会触发
     */
    $emit(eventName: "on-change", values: Array<string | number | boolean>): this;
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 自定义渲染子元素
         */
        default: VNode[];
    };
}
