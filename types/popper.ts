import {UIComponent, VNode, UIComponentSize} from "./component"

export declare class Popper extends UIComponent {
    /**
     * 触发方式，"click" | "hover" | "other"
     * 触发方式，可选值：click,hover,other, type===drop时默认other，其他默认click
     * @default click
     */
    trigger?: "click" | "hover" | "other"
    /**
     * 开启css3样式加速
     */
    gpu?: boolean
    /**
     * 是否显示箭头
     */
    showArrow?: boolean
    /**
     * 是否响应式定位
     */
    responsive?: boolean
    /**
     * 是否一直显示
     */
    always?: boolean
    /**
     * 动画名称，type===drop时默认transition-drop，其他默认fade
     */
    transitionName?: string
    /**
     * 组件类型，可选值：drop,popper
     */
    type?: "drop" | "popper"
    /**
     * 显示位置,可选值：top,top-left,top-center,top-right,top-fix,bottom,bottom-left,bottom-center,bottom-right,bottom-fix,right,right-top,right-center,right-bottom,left,left-top,left-center,left-bottom,fix-left,fix-center,fix-right
     */
    placement?:
        | "top"
        | "top-left"
        | "top-center"
        | "top-right"
        | "top-fix"
        | "bottom"
        | "bottom-left"
        | "bottom-center"
        | "bottom-right"
        | "bottom-fix"
        | "right"
        | "right-top"
        | "right-center"
        | "right-bottom"
        | "left"
        | "left-top"
        | "left-center"
        | "left-bottom"
        | "fix-left"
        | "fix-center"
        | "fix-right"

    /**
     * 显示的正文内容
     * @default 空
     */
    content?: string
    /**
     * 延迟更新样式
     */
    delay?: number
    /**
     * 相对索引Element,确保存在
     */
    reference: HTMLElement | string
    /**
     * 继承transition事件
     */
    "$listeners"?: object
    /**
     * 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，
     * 建议添加此属性，它将不受父级样式影响，从而达到更好的效果
     * @default false
     */
    transfer?: boolean
    /**
     * 出现位置的偏移量
     * @default false
     */
    offset?: string
    /**
   * 自定义 popper.js 的配置项，具体配置见 popper.js 文档
   * @default {
        modifiers: {
            computeStyle:{
                gpuAcceleration: false,
            },
            preventOverflow :{
                boundariesElement: 'window'
            }
        }
      }
   */
    options?: object
    /**
     * 显示和消失时触发
     */
    $emit(eventName: "on-visible-change", event: any): this
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
