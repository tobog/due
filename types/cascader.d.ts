import { UIComponent, VNode, UIComponentSize, UIComponenTheme } from "./component";
import { InputBase } from "./input";

export declare class Caspanel extends UIComponent {
    /**
     * 可选项的数据源，可以是数组,可以是对象
     * @default []
     */
    data?: object[] | object;
    /**
     * 当前已选项的数据，格式参照示例说明
     * @default []
     */
    value?: object[];
    /**
     * 唯一标识和parentId 一起使用,自动生成树结构,无需自己处理
     * @default id
     */
    identifier?: String;
    /**
     * 关联唯一标识和identifier 一起使用,自动生成树结构,无需自己处理
     * @default parentId
     */
    parentId?: String;
    /**
     * 是否禁用选择器
     * @default false
     */
    disabled?: boolean;
    /**
     * 次级菜单展开方式，可选值为 click 或 hover
     * @default click
     */
    trigger?: "click" | "hover";
    /**
     * 大小，可选值"large" | "medium" | "normal" | "small"
     */
    size?: UIComponentSize;
    /**
     *主题，可选值"success" | "primary" | "normal" | "error" | "warning" | "info"
     */
    theme?: UIComponenTheme;
    /**
     * 动态获取数据，数据源需标识 loading
     */
    asyncData?: () => void;
    /**
     * 当搜索列表为空时显示的内容
     * @default 无匹配数据
     */
    noDataText?: string;
    /**
     * 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，
     * 建议添加此属性，它将不受父级样式影响，从而达到更好的效果
     * @default false
     */
    transfer?: boolean;
    /**
     * 自定义渲染函数
     */
    render?: (h: Function, props: object) => void;
    /**
     * 搜索过滤时自定义渲染函数
     */
    renderFlat?: (h: Function, props: object) => void;
    /**
     * 选择模式，可选值为 "single" | "multiple" | "none"
     */
    selection?: "single" | "multiple" | "none";

    /**
     * 搜索时触发
     */
    $emit(eventName: "on-search", value: []): this;
    /**
     * 值变化触发(v-model)
     */
    $emit(eventName: "input", value: []): this;
    /**
     *选择变化时触发
     */
    $emit(eventName: "on-check-change", val: any, node: object, checkedData: object[]): this;
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 自定义渲染子元素
         */
        default: VNode[];
    };
}

export declare class Cascader extends InputBase {
    /**
     * 可选项的数据源，可以是数组,可以是对象
     * @default []
     */
    data?: object[] | object;
    /**
     * 当前已选项的数据，格式参照示例说明
     * @default []
     */
    value?: object[];
    /**
     * 自动关闭
     * @default false
     */
    autoClose?: boolean;
    /**
     * 唯一标识和parentId 一起使用,自动生成树结构,无需自己处理
     * @default id
     */
    identifier?: String;
    /**
     * 关联唯一标识和identifier 一起使用,自动生成树结构,无需自己处理
     * @default parentId
     */
    parentId?: String;
    /**
     * 是否禁用选择器
     * @default false
     */
    disabled?: boolean;
    /**
     * 是否支持清除
     * @default true
     */
    clearable?: boolean;
    /**
     * 次级菜单展开方式，可选值为 click 或 hover
     * @default click
     */
    trigger?: "click" | "hover";
    /**
     * 大小，可选值"large" | "medium" | "normal" | "small"
     */
    size?: UIComponentSize;
    /**
     *主题，可选值"success" | "primary" | "normal" | "error" | "warning" | "info"
     */
    theme?: UIComponenTheme;
    /**
     * 动态获取数据，数据源需标识 loading
     */
    asyncData?: () => void;
    /**
     * 是否支持搜索
     * @default false
     */
    filterable?: boolean;
    /**
     * 当搜索列表为空时显示的内容
     * @default 无匹配数据
     */
    noDataText?: string;
    /**
     * 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，
     * 建议添加此属性，它将不受父级样式影响，从而达到更好的效果
     * @default false
     */
    transfer?: boolean;
    /**
     * 自定义渲染函数
     */
    render?: (h: Function, props: object) => void;
    /**
     * 搜索过滤时自定义渲染函数
     */
    renderFlat?: (h: Function, props: object) => void;
    /**
     * 选择模式，可选值为 "single" | "multiple" | "none"
     */
    selection?: "single" | "multiple" | "none";
    /**
     * 选择完成后的回调，返回值 value 即已选值 value，selectedData 为已选项的具体数据
     */
    $emit(eventName: "on-change", value: object, selectedData: object[]): this;
    /**
     * 展开和关闭弹窗时触发
     */
    $emit(eventName: "on-visible-change", status: boolean): this;
    /**
     * 失去焦点变化触发
     */
    $emit(eventName: "on-change", value: [], event: Event): this;
    /**
     * 获取焦点触发
     */
    $emit(eventName: "on-focus", value: [], event: Event): this;
    /**
     * 失去焦点触发
     */
    $emit(eventName: "on-blur", value: [], event: Event): this;
    /**
     * 值变化触发(v-model)
     */
    $emit(eventName: "input", value: []): this;
    /**
     *清除时触发
     */
    $emit(eventName: "on-clear"): this;
    /**
     * 移除一个时触发
     */
    $emit(eventName: "on-remove-item"): this;
    /**
     * slot插槽对象
     */
    $slots: {
        /**
         * 自定义渲染子元素
         */
        default: VNode[];
    };
}
