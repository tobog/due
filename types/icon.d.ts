import {UIComponent, VNode} from "./component"

export declare class Icon extends UIComponent {
    /**
     * 图标的名称,可以是路径或链接
     */
    type?: string
    /**
     * 图标的大小
     */
    size?: number | string
    /**
     * 图标的颜色
     */
    color?: string
    /**
     * flex-center布局
     */
    center?: boolean
    /**
     * 加载loading图标
     */
    loading?: boolean
    /**
     * 图片加载失败
     */
    $emit(eventName: "on-error", e: Event): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 内容
         */
        default: VNode[]
        /**
         * 自定义loading图标
         */
        loading: VNode[]
        /**
         * 自定义fallback图标
         */
        fallback: VNode[]
    }
}
