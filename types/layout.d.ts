import {UIComponent, VNode, UIComponentMedia} from "./component"

export declare class Layout extends UIComponent {
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * @default
         */
        default: VNode[]
    }
}

export declare class Aside extends UIComponent {
    /**
     * 侧边栏定位
     * @default false
     */
    fixed?: boolean
    /**
     * 	侧边栏收起，收缩宽度。
     * @default 64
     */
    collapsedWidth?: number | string
    /**
     * 侧边栏宽度
     * @default 200
     */
    width?: number | string
    /**
     * 是否右侧边栏
     * @default false
     */
    right?: boolean
    /**
     * 侧边栏是否打开
     * @default true
     */
    visible?: boolean
    /**
     * 触发响应式布局的断点，可选值为xs,sm,md,lg,xl或xxl，若不设此属性则不会触发响应式布局。
     * @default null
     */
    breakpoint?: UIComponentMedia
    /**
     * 收缩事件
     */
    $emit(eventName: "on-change", value: boolean): this
    /**
     * 收缩事件
     */
    $emit(eventName: "update:visible", value: boolean): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * @default
         */
        default: VNode[]
    }
}

export declare class Header extends UIComponent {
    /**
     * 是否定位
     * @default false
     */
    fixed?: boolean
    /**
     * 高度
     * @default 60
     */
    height?: number | string
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * @default
         */
        default: VNode[]
    }
}
export declare class Content extends Layout {}
export declare class Footer extends Header {}
