import {UIComponent, VNode} from "./component"

export declare class Dragmove extends UIComponent {
    /**
     * 禁用拖动
     * @default false
     */
    disabled?: boolean
    /**
     * 边界限制，无法超出{left:0,right:10,top:0.bottom:10}
     */
    boundaryPoint?: {left?: number; right?: number; top?: number; bottom?: number}
    /**
     *边界元素
     */
    boundaryElement?: HTMLElement | string
    /**
     *其他配置
     */
    options?: object
    /**
     * 自定义控制样式
     */
    setStyle?: (obj: object) => object
    /**
     * 移动时触发
     *
     */
    $emit(eventName: "on-move", value: object): this
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
