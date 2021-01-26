import {UIComponent, VNode} from "./component"

export declare class Fluid extends UIComponent {
    /**
     * 是否贴边
     * @default true
     */
    toEdge?: boolean
    /**
     * 边界限制，无法超出{left:0,right:10,top:0.bottom:10}
     */
    gap?: number[] | number | string
    /**
     *子元素宽度,单位px和%
     */
    size?: number | string
    /**
     *布局类型，column：css多栏布局, position:js布局
     */
    type?: "column" | "position"
    /**
     * size优先级高于column，列数，在没有指定size下动态计算size大小
     */
    column?: number
    /**
     * 移动时触发
     *
     */
    $emit(eventName: "on-refresh"): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 主体内容
         */
        default: VNode[]
    }
}

export declare class FluidPanel extends UIComponent {
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 主体内容
         */
        default: VNode[]
    }
}
