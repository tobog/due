import {UIComponent, VNode, UIComponentSize} from "./component"

export declare class Collapse extends UIComponent {
    /**
     * 当前激活的面板的 name，可以使用 v-model 双向绑定
     */
    value?: any[] | string
    /**
     * 是否开启手风琴模式，开启后每次至多展开一个面板
     * @default false
     */
    accordion?: boolean
    /**
     * 是否开启简洁模式
     * @default false
     */
    simple?: boolean
    /**
     * 是否严格匹配 ===|==
     * @default false
     */
    strict?: boolean
    /**
     * 多选框的尺寸，可选值"large" | "medium" | "normal" | "small"
     */
    size?: UIComponentSize
    /**
     * 切换面板时触发，返回当前已展开的面板的 key，格式为数组
     * @default []
     */
    $emit(eventName: "on-change", []): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 面板头内容
         */
        default: VNode[]
    }
}

export declare class CollapseItem extends UIComponent {
    /**
     * 当前面板的 name，与 Collapse的value对应，不填为索引值
     * @default index的值
     */
    name?: string
    /**
     * Panel标题
     */
    title?: string
    /**
     * 标题icon
     */
    icon?: string
    /**
     * 自定义标题内容，结合slot：default 使用
     */
    custom?: boolean
    /**
     * 禁用模式
     */
    disabled?: boolean
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 面板头内容
         */
        default: VNode[]
        /**
         * 描素内容
         */
        content: VNode[]
    }
}
