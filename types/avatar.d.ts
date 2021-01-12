import { UIComponent, VNode } from "./component";

export declare class Avatar extends UIComponent {
    /**
     * 指定头像的形状，可选值为 circle,square,rounded
     * @default circle
     */
    shape?: "circle" | "square" | "rounded";
    /**
     * 设置头像的大小，可选值为 large,small,normal(default),medium
     * @default normal
     */
    size?: "large" | "small" | "normal" | "medium";
    /**
     * 图片类头像的资源地址或者头像的图标类型，参考 Icon 组件
     */
    src?: string;
    /**
     * 自定义回退头像
     * icon为外链接图片加载不成功时回退头像
     */
    fallback?: string;
    /**
     * 在设置 src 且图片加载不成功时触发
     */
    $emit(eventName: "on-error", event: Event): this;
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 自定义头像
         */
        default: VNode[];
        /**
         * 自定义回退头像
         */
        fallback: VNode[];
    };
}
