import {UIComponent, VNode} from "./component"

export declare class Row extends UIComponent {
    /**
     * 栅格间距，单位 px，左右平分,栅格间距，单位 px，左右平分 上下,例如 10 | 100px | [10px,100px]|{xs:1,md:10}
     * @default 0
     */
    gutter?: number | string | [] | object
    /**
     * 总栅格数
     * @default 24
     */
    grid?: number
    /**
     * 是否flex布局
     */
    flex?: boolean
    /**
     * lex 布局下的垂直对齐方式，可选值为top、middle、bottom,stretch
     */
    align?: "top" | "middle" | "bottom" | "stretch"
    /**
     * flex 布局下的水平排列方式，可选值为start、end、center、space-around、space-between
     */
    justify?: "start" | "end" | "center" | "space-around" | "space-between"
    /**
     * 栅格高宽比,，例如：1 | 100px | {xs:1,md:100}
     */
    ratio?: number | string | object
    /**
     * 尺寸变化时触发
     */
    $emit(eventName: "on-resize", ...args: any[]): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 内容
         */
        default: VNode[]
    }
}

export declare class Col extends UIComponent {
    /**
     * 栅格间距，单位 px，左右平分,栅格间距，单位 px，左右平分 上下,例如 10 | 100px | [10px,100px]|{xs:1,md:10}
     * @default 0
     */
    gutter?: number | string | [] | object
    /**
     * 栅格高宽比,，例如：1 | 100px | {xs:1,md:100}
     */
    ratio?: number | string | object
    /**
     * 栅格的占位格数，可选值为0~24的整数，为 0 时，相当于display:none
     */
    span?: number | string
    /**
     * 栅格的顺序，在flex布局模式下有效
     */
    order?: number | string
    /**
     * 栅格左侧的间隔格数，间隔内不可以有栅格
     */
    offset?: number | string
    /**
     * 栅格向右移动格数
     */
    push?: number | string
    /**
     * 栅格向左移动格数
     */
    pull?: number | string
    /**
     * <576px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    xs?: number | object
    /**
     * ≥576px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    sm?: number | object
    /**
     * ≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    md?: number | object
    /**
     * ≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    lg?: number | object
    /**
     * ≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    xl?: number | object
    /**
     * ≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象
     */
    xxl?: number | object
}

export declare class Grid extends UIComponent {
    /**
     * 总栅格数
     * @default 5
     */
    grid?: number
    /**
     * hover
     */
    hover?: boolean
    /**
     * 边框
     */
    border?: boolean
    /**
     * 栅格高宽比,，例如：1 | 100px | {xs:1,md:100}
     */
    ratio?: number | string | object
    /**
     * 尺寸变化时触发
     */
    $emit(eventName: "on-resize", ...args: any[]): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 内容
         */
        default: VNode[]
    }
}

export declare class GridItem extends UIComponent {
    /**
     * 栅格高宽比,，例如：1 | 100px | {xs:1,md:100}
     */
    ratio?: number | string | object
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 内容
         */
        default: VNode[]
    }
}
