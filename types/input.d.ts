import {UIComponent, VNode, UIComponentSize, UIComponenTheme, UIComponentPlacement} from "./component"

export declare class InputBase extends UIComponent {}

export declare class Input extends UIComponent {
    /**
     * 输入框类型，可选值为 text、password、textarea、url、email、date、number、tel
     * @default text
     */
    type?: "text" | "password" | "textarea" | "url" | "email" | "date" | "number" | "tel"
    /**
     * 绑定的值，可使用 v-model 双向绑定
     * @default 空
     */
    value?: string | number
    /**
     * 输入框尺寸，可选值为large、small、default或者不设置
     */
    size?: "" | "large" | "small" | "default"
    /**
     * 占位文本
     */
    placeholder?: string
    /**
     * 是否显示清空按钮
     * @default false
     */
    clearable?: boolean
    /**
     * 设置输入框为禁用状态
     * @default false
     */
    disabled?: boolean
    /**
     * 设置输入框为只读
     * @default false
     */
    readonly?: boolean
    /**
     * 最大输入长度
     */
    maxlength?: number
    /**
     * 输入框尾部图标，仅在 text 类型下有效
     */
    icon?: string
    /**
     * 输入框头部图标
     * @default false
     */
    prefix?: string
    /**
     * 输入框尾部图标
     * @default false
     */
    suffix?: String
    /**
     * 是否显示为搜索型输入框
     * @default false
     */
    search?: boolean
    /**
     * 开启 search 时可用，是否有确认按钮，可设为按钮文字
     * @default false
     */
    "enter-button"?: boolean | string
    /**
     * 文本域默认行数，仅在 textarea 类型下有效
     * @default 2
     */
    rows?: number
    /**
     * 自适应内容高度，仅在 textarea 类型下有效，可传入对象，如 { minRows: 2, maxRows: 6 }
     * @default false
     */
    autosize?: boolean | {minRows?: number; maxRows?: number}
    /**
     * 将用户的输入转换为 number 类型
     * @default false
     */
    number?: boolean
    /**
     * 自动获取焦点
     * @default false
     */
    autofocus?: boolean
    /**
     * 原生的自动完成功能，可选值为 off 和 on,off
     */
    autocomplete?: string
    /**
     * 给表单元素设置 id，详见 Form 用法。
     */
    "element-id"?: string
    /**
     * 原生的 spellcheck 属性
     * @default false
     */
    spellcheck?: boolean
    /**
     * 原生的 wrap 属性，可选值为 hard 和 soft，仅在 textarea 下生效
     * @default soft
     */
    wrap?: "hard" | "soft"
    /**
     * 按下回车键时触发
     */
    $emit(eventName: "on-enter"): this
    /**
     * 设置 icon 属性后，点击图标时触发
     */
    $emit(eventName: "on-click"): this
    /**
     * 数据改变时触发
     */
    $emit(eventName: "on-change", event: string): this
    /**
     * 输入框聚焦时触发
     */
    $emit(eventName: "on-focus"): this
    /**
     * 输入框失去焦点时触发
     */
    $emit(eventName: "on-blur"): this
    /**
     * 原生的 keyup 事件
     */
    $emit(eventName: "on-keyup", event: KeyboardEvent): this
    /**
     * 原生的 keydown 事件
     */
    $emit(eventName: "on-keydown", event: KeyboardEvent): this
    /**
     * 原生的 keypress 事件
     */
    $emit(eventName: "on-keypress", event: KeyboardEvent): this
    /**
     * 开启 search 时可用，点击搜索或按下回车键时触发
     */
    $emit(eventName: "on-search", value: string): this
    /**
     * 开启 clearable 时可用，点击清空按钮时触发
     */
    $emit(eventName: "on-clear"): this
    /**
     * 手动聚焦输入框
     */
    focus(): void
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 前置内容，仅在 text 类型下有效
         */
        prepend: VNode[]
        /**
         * 后置内容，仅在 text 类型下有效
         */
        append: VNode[]
        /**
         * 输入框头部图标
         */
        prefix: VNode[]
        /**
         * 输入框尾部图标
         */
        suffix: VNode[]
    }
}

export declare class Option extends UIComponent {
    /**
     * 选项的值
     * @required
     */
    value: string | number
    /**
     * 选项的标签，若不设置则默认与 value 相同
     */
    label?: string | number
    /**
     * 是否多选选项， input和select自定义多选option
     */
    multiple?: boolean
    /**
     * 是否禁用该选项
     */
    disabled?: boolean
    /**
     * 选中附带的数据
     */
    attach?: object
    /**
     * 选中样式
     */
    selected?: boolean
    /**
     * 在使用搜索和键盘匹配时高亮
     */
    hover?: boolean
    /**
     * 多选条件下，是否显示checkbox
     */
    checkbox?: boolean
    /**
     * 样式主题
     */
    theme?: UIComponenTheme
    /**
     * 尺寸大小
     */
    size?: UIComponentSize
    /**
     * 点击时触发
     */
    $emit(
        eventName: "on-select",
        event: {
            value?: any
            label?: string
            attach?: object
        },
        selected?: boolean
    ): this
    /**
     * slot插槽对象
     */
    $slots: {}
    $slotScopes: {
        /**
         * 自定义渲染内容
         */
        default: VNode[]
    }
}

/**
 * option 虚拟列表
 */
export declare class Options extends UIComponent {
    /**
     * opt 选项列表数据
     */
    data: Option[]
    /**
     * 选中的值
     * @required
     */
    value: string | number | []
    /**
     * 是否多选选项列表
     */
    multiple?: boolean
    /**
     * 是否禁用
     */
    disabled?: boolean
    /**
     * 匹配键值对的模式，false:'=='; true:'==='
     */
    strict?: boolean
    /**
     * 虚拟列表性能
     * auto:if < 100 => normal; if > 200 && < 100 => middle;other =>high
     * @default auto
     */
    performance?: "high" | "normal" | "auto"
    /**
     * 使用正则匹配
     */
    regExpMatch?: boolean
    /**
     * 启动键盘模式
     */
    keyModal?: boolean
    /**
     * 变化时重置虚拟列表
     */
    reset?: any
    /**
     * 没有数据时提示文本
     *  @default 暂无相关数据
     */
    noDataText?: string
    /**
     * 全选文本
     * @default 全选
     */
    checkAllLabel?: any
    /**
     * 多选条件下，是否显示checkbox
     */
    checkbox?: boolean
    /**
     * 是否有全选功能
     */
    hasCheckAll?: boolean
    /**
     * 样式主题
     */
    theme?: UIComponenTheme
    /**
     * 尺寸大小
     */
    size?: UIComponentSize
    /**
     * 选项发生变化时 触发
     */
    $emit(eventName: "on-change", value?: any, attach?: object): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 自定义渲染内容
         */
        default: VNode[]
         /**
         * 自定义顶部定位内容
         */
        prefix: VNode[]
         /**
         * 自定义底部定位内容
         */
        suffix: VNode[]
    }

}
