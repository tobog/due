import {UIComponent, VNode, UIComponentSize, UIComponenTheme, UIComponentPlacement} from "./component"

export declare class Dropdown extends UIComponent {
    /**
     * 触发方式，可选值为 hover（悬停）click（点击）custom（自定义），使用 custom 时，需配合 visible 一起使用
     * @default hover
     */
    trigger?: "hover" | "click" | "custom"
    /**
     * 手动控制下拉框的显示，在 trigger = 'custom' 时使用
     * @default false
     */
    visible?: boolean
    /**
     * 下拉菜单出现的位置，可选值为
     * @default bottom
     */
    placement?: UIComponentPlacement
    /**
     *设置大小，可选值为：small,normal(default),medium,large
     * @default normal
     */
    size?: UIComponentSize
    /**
     *主题颜色,仅对默认样式有用
     * @default primary
     */
    theme?: UIComponenTheme
    /**
     * 自动更新显示文字
     * @default false
     */
    autoLabel?: boolean
    /**
     * 点击子节点关闭
     * @default false
     */
    autoClose?: boolean
    /**
     * 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果
     * @default false
     */
    transfer?: boolean
    /**
     * ，给浮层添加额外的 class 名称
     * @default false
     */
    dropClass?: string | object | any[]
    /**
     * 点击菜单项时触发
     *
     */
    $emit(eventName: "on-change", value: string): this
    /**
     * 菜单显示状态改变时调用
     */
    $emit(eventName: "on-visible-change", value: boolean): this
    /**
     * 点击时触发
     */
    $emit(eventName: "on-clickoutside", event: object): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 主体内容
         */
        default: VNode[]
        /**
         * 列表内容
         */
        list: VNode[]
    }
}

export declare class DropdownItem extends UIComponent {
    /**
     * 用来标识这一项
     */
    name?: string
    /**
     * 禁用该项
     * @default false
     */
    disabled?: boolean
    /**
     * 显示分割线
     * @default false
     */
    divided?: boolean
    /**
     * 标记该项为选中状态
     * @default false
     */
    selected?: boolean
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 主体内容
         */
        default: VNode[]
    }
}
