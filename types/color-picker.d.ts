import {UIComponent, VNode, UIComponentSize} from "./component"

export declare class Color extends UIComponent {
    /**
     * 绑定的值，可使用 v-model(on-change，input) 双向绑定
     */
    value?: string
    /**
     * 是否支持透明度选择
     * @default false
     */
    alpha?: boolean
    /**
     * 是否预定义颜色
     * @default false
     */
    predefined?: boolean
    /**
     * 颜色格式，可选择"hex" | "rgb" | "hsl" | "hsv"
     * @default rgb
     */
    type?: "hex" | "rgb" | "hsl" | "hsv"
    /**
     * 尺寸，可选值为"large" | "medium" | "normal" | "small"
     */
    size?: UIComponentSize
    /**
     * 自定义颜色预设,仅在predefined为true时
     */
    colors?: string[]
    /**
     * 当绑定值变化时触发
     * @default 当前值
     */
    $emit(eventName: "on-change", value: string): this
    /**
     * 当绑定值变化时触发
     * @default 当前值
     */
    $emit(eventName: "input", value: string): this
}
export declare class ColorPicker extends UIComponent {
    /**
     * 绑定的值，可使用 v-model(on-chang) 双向绑定
     */
    value?: string
    /**
     * 是否支持透明度选择
     * @default false
     */
    alpha?: boolean
    /**
     * 是否预定义颜色
     * @default false
     */
    predefined?: boolean
    /**
     * 颜色格式，可选择"hex" | "rgb" | "hsl" | "hsv"
     * @default rgb
     */
    type?: "hex" | "rgb" | "hsl" | "hsv"
    /**
     * 尺寸，可选值为"large" | "medium" | "normal" | "small"
     */
    size?: UIComponentSize
    /**
     * 自定义颜色预设,仅在predefined为true时
     */
    colors?: string[]
    /**
     * 是否禁用
     * @default false
     */
    disabled?: boolean
    /**
     * 弹层是否置于body
     * @default false
     */
    transfer?: boolean
    /**
     * 是否自动关闭
     * @default false
     */
    autoClose?: boolean
    /**
     * 颜色的格式，可选值为 hsl、hsv、hex、rgb
     * @default 开启 alpha 时为 rgb，其它为 hex
     */
    format?: "hsl" | "hsv" | "hex" | "rgb"
    /**
     * 当绑定值变化时触发
     * @default 当前值
     */
    $emit(eventName: "on-change", value: string): this
    /**
     * 当绑定值变化时触发
     * @default 当前值
     */
    $emit(eventName: "input", value: string): this
    /**
     * 点击确认触发
     * @default 当前显示的颜色值
     */
    $emit(eventName: "on-confirm", value: string): this
    /**
     * 点击取消触发
     * @default 当前显示的颜色值
     */
    $emit(eventName: "on-cancel", value: boolean): this
    /**
     * 面板中当前显示的颜色发生改变时触发
     * @default 当前显示的颜色值
     */
    $emit(eventName: "on-active-change", value: string): this
    /**
     * 下拉框展开或收起时触发
     */
    $emit(eventName: "on-visible-change", value: boolean): this
}
