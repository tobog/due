import {UIComponent, VNode, UIComponentSize} from "./component"

export declare class DateBase extends UIComponent {
    /**
     * 日期，可以是 JavaScript 的 Date，例如 new Date()，也可以是标准的日期格式，点击右边查看
     */
    value?: string | any[] | Date | number
    /**
     * 展示的日期格式
     * date | daterange?: yyyy-MM-dd
     * datetime | datetimerange：yyyy-MM-dd HH:mm:ss
     * year：yyyy
     * month：yyyy-MM
     */
    format?: string
    /**
     * 可以选择多个日期
     */
    multiple?: boolean
    /**
     * 是否是区间
     */
    range?: boolean
    /**
     * 是否显示周数
     */
    showWeek?: boolean
    /**
     * 星期名称
     * @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
     */
    weeks?: string[]
    /**
     * 当前索引
     */
    index?: number
    /**
     * 首次星期,如星期一或者星期日开始顺序
     * @default 0
     */
    firstDayOfWeek?: number
    /**
     * 首次默认日期
     * @default  Date.now()
     */
    startDate?: number | Date | string
    /**
     * 禁用函数
     */
    disableMethod?: (cell: object, type: string) => boolean
    /**
     * 选中变化时触发
     */
    $emit(
        eventName: "on-selected",
        event: {datesInstance?: Date[]; dates?: string[]; index?: number; endState?: string},
        isOver?: boolean
    ): this
    /**
     * 只要变化触发，同步数据事件
     */
    $emit(eventName: "on-sync-update", event: {date?: Date[]; index?: number}, type?: string): this
}

export declare class DatePanel extends UIComponent {
    /**
     * 显示类型，可选值为 "date"| "daterange"| "datetime"| "datetimerange"| "year"| "month"| "times"| "timesrange"| "hours"| "hoursrange"
     */
    type?:
        | "date"
        | "daterange"
        | "datetime"
        | "datetimerange"
        | "year"
        | "month"
        | "times"
        | "timesrange"
        | "hours"
        | "hoursrange"
    /**
     * 日期，可以是 JavaScript 的 Date，例如 new Date()，也可以是标准的日期格式，点击右边查看
     */
    value?: string | any[] | Date | number
    /**
     * 展示的日期格式
     * date | daterange?: yyyy-MM-dd
     * datetime | datetimerange：yyyy-MM-dd HH:mm:ss
     * year：yyyy
     * month：yyyy-MM
     */
    format?: string
    /**
     * 两个面板使用，仅在区间情况下有效
     * @default true
     */
    doublePanel?: boolean
    /**
     * 是否显示底部控制栏，开启后，选择完日期，选择器不会主动关闭，需用户确认后才可关闭,
     *  @default true
     */
    confirm?: boolean
    /**
     * 可以选择多个日期
     */
    multiple?: boolean
    /**
     * 是否是区间
     */
    range?: boolean
    /**
     * 是否显示周数
     */
    showWeek?: boolean
    /**
     * 星期名称
     * @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
     */
    weeks?: string[]
    /**
     * 选择器额外配置，比如不可选日期与快捷选项，具体项详见下表
     * @default {}
     */
    options?: DatePickerOptions
    /**
     * 当前索引
     */
    index?: number
    /**
     * 首次星期,如星期一或者星期日开始顺序
     * @default 0
     */
    firstDayOfWeek?: number
    /**
     * 首次默认日期
     * @default  Date.now()
     */
    startDate?: number | Date | string
    /**
     * 禁用函数
     */
    disableMethod?: (cell: object, type: string) => boolean
    /**
     * v-model input 事件
     */
    $emit(eventName: "input", event: string[], datesInstance?: Date[]): this
    /**
     * 只要状态变化触发，
     */
    $emit(
        eventName: "on-status-change",
        event: {value: Date[]; dates: string[]; status?: string; isOver?: boolean; index?: number}
    ): this
    /**
     * 清除时触发
     */
    $emit(eventName: "on-clear", value: string[], dates?: Date[]): this
    /**
     * 点击确认时触发
     */
    $emit(eventName: "on-confirm", value: string[], dates?: Date[]): this
}
export declare class DatePicker extends UIComponent {
    /**
     * 显示类型，可选值为 "date"| "daterange"| "datetime"| "datetimerange"| "year"| "month"| "times"| "timesrange"| "hours"| "hoursrange"
     */
    type?:
        | "date"
        | "daterange"
        | "datetime"
        | "datetimerange"
        | "year"
        | "month"
        | "times"
        | "timesrange"
        | "hours"
        | "hoursrange"
    /**
     * 日期，可以是 JavaScript 的 Date，例如 new Date()，也可以是标准的日期格式，点击右边查看
     */
    value?: string | any[] | Date | number
    /**
     * 展示的日期格式
     * date | daterange?: yyyy-MM-dd
     * datetime | datetimerange：yyyy-MM-dd HH:mm:ss
     * year：yyyy
     * month：yyyy-MM
     */
    format?: string
    /**
     * 两个面板使用，仅在区间情况下有效
     * @default true
     */
    doublePanel?: boolean
    /**
     * 是否显示底部控制栏，开启后，选择完日期，选择器不会主动关闭，需用户确认后才可关闭,
     *  @default true
     */
    confirm?: boolean
    /**
     * 可以选择多个日期
     */
    multiple?: boolean
    /**
     * 是否显示周数
     */
    showWeek?: boolean
    /**
     * 星期名称
     * @default ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
     */
    weeks?: string[]
    /**
     * 首次星期,如星期一或者星期日开始顺序
     * @default 0
     */
    firstDayOfWeek?: number
    /**
     * 首次默认日期
     * @default  Date.now()
     */
    startDate?: number | Date | string
    /**
     * 占位文本默认值空
     * @default 空
     */
    placeholder?: string
    /**
     * 选择器额外配置，比如不可选日期与快捷选项，具体项详见下表
     */
    options?: DatePickerOptions
    /**
     * 尺寸，可选值为"large" | "medium" | "normal" | "small"
     */
    size?: UIComponentSize
    /**
     * 是否禁用选择器
     * @default false
     */
    disabled?: boolean
    /**
     * 是否显示清除按钮
     * @default true
     */
    clearable?: boolean
    /**
     * 显示tag 样式
     * @default false
     */
    showTag?: boolean
    /**
     * 完全只读，开启后不会弹出选择器，只在没有设置 open 属性下生效
     * @default false
     */
    readonly?: boolean
    /**
     * 文本框是否可以输入，只在没有使用 slot 时有效
     * @default true
     */
    editable?: boolean
    /**
     * 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，
     * 建议添加此属性，它将不受父级样式影响，从而达到更好的效果,
     * @default false
     */
    transfer?: boolean
    /**
     * 弹出日历和关闭日历时触发
     */
    $emit(eventName: "on-visible-change", value: boolean): this
    /**
     * 禁用函数
     */
    disableMethod?: (cell: object, type: string) => boolean
    /**
     * v-model input 事件
     */
    $emit(eventName: "input", event: string[]): this
    /**
     * 只要状态变化触发，
     */
    $emit(
        eventName: "on-status-change",
        event: {value: Date[]; dates: string[]; status?: string; isOver?: boolean; index?: number}
    ): this
    /**
     * 获取焦点时触发
     */
    $emit(eventName: "on-foucs", value: string[], dates?: Date[]): this
    /**
     * 失去焦点时触发
     */
    $emit(eventName: "on-blur", value: string[], dates?: Date[]): this
    /**
     * 移除一个时触发
     */
    $emit(eventName: "on-remove-item", value: string, index?: number): this
    /**
     * 清除时触发
     */
    $emit(eventName: "on-clear", value: string[], dates?: Date[]): this
    /**
     * 点击确认时触发
     */
    $emit(eventName: "on-confirm", value: string[], dates?: Date[]): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * input 前部内容
         */
        prepend: VNode[]
        /**
         * input 后部内容
         */
        append: VNode[]
        /**
         * input 前缀内容
         */
        prefix: VNode[]
        /**
         * input 后缀内容
         */
        suffix: VNode[]
    }
}

export declare class DatePickerOptions {
    /**
     * 设置快捷选项，每项内容：
     * text：显示的文案
     * value?: 返回指定的日期，如需自己控制逻辑，可不设置，并使用 onClick 回调
     * onClick?: 点击时的回调，参数为当前日期选择器的 Vue 实例，当需要自定义复杂操作时，可以使用
     */
    shortcuts?: {text?: string; value?: () => void; onClick?: () => void}[]
    /**
     * 设置不可选择的日期，参数为当前的日期，需要返回 Boolean 是否禁用这天
     */
    // disabledDate(): boolean
}
