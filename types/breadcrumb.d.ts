import {UIComponent, VNode} from "./component"
export declare class Bread extends UIComponent {
    /**
     * 自定义分隔符
     * @default /
     */
    sep?: string
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 显示内容
         */
        default: VNode[]
    }
}

export declare class BreadItem extends UIComponent {
    /**
     * 自定义分隔符
     * @default /
     */
    sep?: string
    /**
     * 继承 组件$attrs,更具不同tag 动态设置属性（to,href,target...）等等
     */
    $attrs?: Object
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 显示内容
         */
        default: VNode[]
    }
}
