import {UIComponent, VNode, UIComponentSize, UIComponenTheme, UIComponentPlacement} from "./component"

export declare class Form extends UIComponent {
    /**
     * 表单子项目宽度
     */
    width?: number | string
    /**
     * 表单验证规则，具体配置查看 async-validator
     */
    rules?: object
    /**
     * 是否开启行内表单模式
     * @default false
     */
    inline?: boolean
    /**
     * 表单域标签的位置，可选值为 left、right、justify,center
     * @default left
     */
    labelAlign?: "left" | "right" | "justify" | "center"
    /**
     * label垂直对齐位，可选值为 "center" | "start" | "end" | "baseline" | "stretch"
     * @default center
     */
    labelVertical?: "center" | "start" | "end" | "baseline" | "stretch"
    /**
     * 表单域标签的宽度，所有的 FormItem 都会继承 Form 组件的 label-width 的值
     */
    labelWidth?: number | string
    /**
     * 是否显示校验错误信息
     * @default true
     */
    showMessage?: boolean
    /**
     * 错误信息表单自动现实在视口中
     * @default true
     */
    errorInview?: boolean
    /**
     * 便签在右边显示
     * @default false
     */
    reverse?: boolean
    /**
     * 对整个表单进行校验，参数为检验完的回调，会返回一个 Boolean 表示成功与失败
     */
    validate(callback?: (valid?: boolean) => void): void
    /**
     * 对部分表单字段进行校验的方法，参数1为需校验的 prop，参数2为检验完回调，返回错误信息
     */
    validateField(prop?: string, callback?: (valid?: boolean) => void): void
    /**
     * 对整个表单进行重置，将所有字段值重置为空并移除校验结果
     */
    resetValidate(): void
    /**
     * form submit 事件触发时
     */
    $emit(eventName: "on-submit", ...args: any[]): this
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 内容
         */
        default: VNode[]
    }
}

export declare class FormItem extends UIComponent {
    /**
     * 表单项目值
     */
    value?: any
    /**
     * 表单项目宽度
     */
    width?: number | string
    /**
     * 对应表单域 name 字段
     */
    prop?: string
    /**
     * 标签文本
     */
    label?: string
    /**
     * 表单域标签的的宽度
     */
    labelWidth?: number
    /**
     * 是否必填，如不设置，则会根据校验规则自动生成
     */
    required?: boolean
    /**
     * 表单验证规则
     */
    rules?: object | Array<any>
    /**
     * 表单域验证错误信息, 设置该值会使表单验证状态变为message，并显示该错误信息
     */
    message?: string
    /**
     * 是否显示校验错误信息
     * @default true
     */
    showMessage?: boolean
    /**
     * 是否开启行内表单模式
     * @default false
     */
    inline?: boolean
    /**
     * 便签在右边显示
     * @default false
     */
    reverse?: boolean
    /**
     * 表单域标签的位置，可选值为 left、right、justify,center
     * @default center
     */
    align?: "left" | "right" | "justify" | "center"
    /**
     * label垂直对齐位，可选值为 "center" | "start" | "end" | "baseline" | "stretch"
     * @default center
     */
    vertical?: "center" | "start" | "end" | "baseline" | "stretch"
     /**
     * 对整个表单进行校验，参数为检验完的回调，会返回一个 Boolean 表示成功与失败
     */
    validate(callback?: (valid?: boolean) => void): void
    /**
     * 对整个表单进行重置，将所有字段值重置为空并移除校验结果
     */
    resetValidate(): void
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 内容
         */
        default: VNode[]
        /**
         * label 内容
         */
        label: VNode[]
        /**
         * 提示 内容
         */
        message: VNode[]
    }
}
