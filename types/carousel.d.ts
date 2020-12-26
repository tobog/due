import { UIComponent, VNode } from "./component";

export declare class Carousel extends UIComponent {
    /**
     * 幻灯片的索引，从 0 开始，可以使用 v-model 双向绑定数据
     * @default 0
     */
    value?: number;
    /**
     * 是否反向
     * @default false
     */
    reverse?: boolean;
    /**
     * 是否开启循环
     * @default true
     */
    loop?: boolean;
    /**
     * 是否自动切换
     *  @default true
     */
    autoplay?: boolean;
    /**
     * 自动切换的时间间隔，单位为毫秒
     * @default 2000
     */
    interval?: number;
    /**
     * 是否展示指示器
     * @default false
     */
    showDot?: boolean;
    /**
     * 指示器的类型，可选值为  "round" | "default" | "page" | "bullet"
     * @default default
     */
    dotType?: "round" | "default" | "page" | "bullet";
    /**
     * 指示器位置，可选值为  "top" | "right" | "left" | "bottom"
     * @default bottom
     */
    dotPosition?: "top" | "right" | "left" | "bottom";
    /**
     * 指示器的触发方式，可选值为 "click" | "hover"
     * @default click
     */
    trigger?: "click" | "hover";
    /**
     * 切换箭头的显示时机，可选值为 hover（悬停），always（一直显示），never（不显示）
     * @default always
     */
    arrow?: "hover" | "always" | "never";
    /**
     * 滚动方向，可选值为 "horizontal" | "vertical"
     * @default horizontal
     */
    direction?: "horizontal" | "vertical";
    /**
     * 幻灯片切换时触发，目前激活的幻灯片的索引，原幻灯片的索引
     */
    $emit(eventName: "on-change", value: number, oldValue: number): this;
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 主体内容
         */
        default: VNode[];
    };
}

export declare class CarouselItem extends UIComponent {
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 主体内容
         */
        default: VNode[];
    };
}
