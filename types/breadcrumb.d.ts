import { UIComponent, VNode } from "./component";
export declare class Bread extends UIComponent {
    /**
     * 自定义分隔符
     * @default /
     */
    sep?: string;
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 显示内容
         */
        default: VNode[];
    };
}

export declare class BreadItem extends UIComponent {
    /**
     * 链接，不传则没有链接
     */
    to?: string | object;
    /**
     * 路由跳转时，开启 replace 将不会向 history 添加新记录
     * @default false
     */
    replace?: boolean;
    /**
     * 相当于 a 链接的 target 属性
     * @default _self
     */
    target?: "_blank" | "_self" | "_parent" | "_top";
    /**
     * 同 vue-router append
     * @default false
     */
    append?: boolean;
}
