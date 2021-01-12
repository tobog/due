import { UIComponent, VNode } from "./component";

export declare class Anchor extends UIComponent {
    /**
     * 锚点链接
     * @default null
     */
    href?: string;
    /**
     * 文字内容
     * @default null
     */
    title?: string;
    /**
     * 锚点选择器
     *  @default null
     */
    selector?: string;
    /**
     * 元素在浏览器中显示的位置
     * @default "start"
     */
    position?: "start" | "center" | "end" | number;
    /**
     * 尺寸大小(仅字体)
     * @default null
     */
    size?: "small" | "normal(default)" | "medium" | "large";
    /**
     * 指定滚动的容器
     */
    container?: string | HTMLElement;
    /**
     * 是否显示小圆点
     * @default false
     */
    "show-ink"?: boolean;
    /**
     * 点击锚点时触发，返回链接
     */
    $emit(eventName: "on-jump", href: string): this;
    /**
     * 链接改变时滚动时触发
     */
    $emit(eventName: "on-scroll", selector: HTMLElement): this;

    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 文字内容
         */
        default: VNode[];
    };
}
