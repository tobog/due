import { UIComponent, VNode } from "./component";

export declare class Alert extends UIComponent {
    /**
     * 警告提示样式，可选值为info、success、warning、error
     * @default info
     */
    type?: "info" | "success" | "warning" | "error" | any;
    /**
     * 是否可关闭
     * @default false
     */
    closable?: boolean;
    /**
     * 幽灵透明
     * @default false
     */
    ghost?: boolean;
    /**
     * 广播模式
     * @default false
     */
    broadcast?: boolean;
    /**
     * 是否显示图标
     * @default false
     */
    showIcon?: boolean;
    /**
     * icon对齐方式
     * @default "start"
     */
    align?: "start" | "center" | "end";
    /**
     * 自定义颜色
     * @default string
     */
    color?: string;
    /**
     * 警告提示辅助性文字介绍
     * @default string
     */
    desc?: string;
    /**
     * 关闭动画消失时触发
     */
    $emit(eventName: "on-after-close"): this;
    /**
     * 关闭时触发
     */
    $emit(eventName: "on-close"): this;
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 警告提示内容
         */
        default: VNode[];
        /**
         * 警告提示辅助性文字介绍
         */
        desc: VNode[];
        /**
         * 自定义图标内容
         */
        icon: VNode[];
        /**
         * 自定义关闭内容
         */
        close: VNode[];
    };
}
