import {UIComponent, VNode} from "./component"

export declare class Card extends UIComponent {
    /**
     * 是否显示边框，建议在灰色背景下使用
     * @default true
     */
    border?: boolean
    /**
     * 头部分割线
     * @default false
     */
    divider?: boolean
    /**
     * 卡片阴影，建议在灰色背景下使用
     * @default false
     */
    shadow?: boolean
    /**
     * 卡片内部间距，单位 px
     * @default 16
     */
    padding?: number
    /**
     * 标题
     */
    title?: string
    /**
     * 标题前的图标
     */
    icon?: string
    /**
     * 卡片类型,可选值为:"flip" | "tile" | "horizontal"
     */
    type?: "flip" | "tile" | "horizontal"
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 自定义卡片标
         */
        title: VNode[]
        /**
         * 额外显示的内容
         */
        extra: VNode[]
        /**
         * 卡片主体内容
         */
        default: VNode[]
    }
}
