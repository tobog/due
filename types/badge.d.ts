import { UIComponent, VNode,UIComponenTheme } from "./component";

export declare class Badge extends UIComponent {
    /**
     * 是否显示标签
     * @default false
     */
    showLabel?: boolean;
    /**
     * 是否标签动画
     * @default false
     */
    progress?: boolean;
    /**
     * 自定义内容,显示的标签
     */
    label?: number | string;
    /**
     * 自定义标签颜色
     */
    color?: string;
    /**
     * 展示封顶的数字值
     */
    overLabel?: number;
    /**
     *尺寸大小
     */
    size?: number | string;
    /**
     * 控制label格式
     */
    format?: (label: number, overLabel: number) => string;
    /**
     * 使用预设的颜色，可选值为 success、primary、normal、error、warning、info
     */
    theme?: UIComponenTheme;
    /**
     * 设置状态点的位置偏移，格式为 [x, y]
     */
    offset?: number[];
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 显示内容
         */
        default: VNode[];
        /**
         * 显示label内容
         */
        label: VNode[];
    };
}
