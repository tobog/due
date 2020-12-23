<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Button and ButtonGroup 按钮)</h2>
            <h4 class="padding-top-10">基础组件，触发业务逻辑时使用。</h4>
        </template>
        <template v-slot="config">
            <vButton v-bind="config" to="/button">vButton</vButton>
            <vButton v-bind="config" to="/button" icon="ios-alert-outline"></vButton>
            <vButtonGroup v-bind="config" class="margin-top-20">
                <vButton v-bind="config">vButton</vButton>
                <vButton v-bind="config">vButton</vButton>
                <vButton v-bind="config">vButton</vButton>
                <vButton v-bind="config" icon="ios-alert-outline"></vButton>
            </vButtonGroup>
            <vButtonGroup v-bind="config" class="margin-top-20">
                <vButton>vButton</vButton>
                <vButton>vButton</vButton>
                <vButton>vButton</vButton>
                <vButton icon="ios-alert-outline"></vButton>
            </vButtonGroup>
            <vButtonGroup v-bind="config" class="margin-top-20">
                <vButton v-bind="config">vButton</vButton>
            </vButtonGroup>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        getCode() {
            return `<Button v-bind=CODE>Button</Button>
					<ButtonGroup v-bind=CODE class="margin-top-20">
						<Button v-bind=CODE>Button</Button>
						<Button v-bind=CODE>Button</Button>
					</ButtonGroup>`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "纵向排列",
                    key: "vertical",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "ButtonGroupd的属性：是否纵向排列按钮组",
                    dataType: "Boolean",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "紧凑排列",
                    key: "compact",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "ButtonGroupd的属性：紧凑排列",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "朴素按钮",
                    key: "plain",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否朴素按钮",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "幽灵属性",
                    key: "ghost",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否幽灵属性",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "禁用状态",
                    key: "disabled",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否禁用状态",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "长度100%",
                    key: "long",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否长度100%",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "loading",
                    key: "loading",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "按钮为加载中状态",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "边框类型",
                    key: "borderType",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "按钮类型 按钮类型:可选值为dashed,text,default",
                    dataType: "String",
                    default: "",
                    options: ["dashed", "text", "default"],
                },
                {
                    showConfig: true,
                    label: "按钮主题",
                    key: "theme",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "按钮主题(ButtonGroupd和Button):可选值为 gray、primary、info、success、warning、error",
                    dataType: "String",
                    default: "",
                    options: ["primary", "info", "success", "warning", "error", "default", "confirm"],
                },
                {
                    showConfig: true,
                    label: "自定义颜色",
                    key: "color",
                    tag: "vColorPicker",
                    demoDefault: "",
                    explain: "自定义颜色",
                    dataType: "String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "按钮形状",
                    key: "shape",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "按钮形状",
                    dataType: "String",
                    default: "",
                    options: ["circle", "round", "square"],
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain:
                        "设置大小(ButtonGroupd和Button)，可选值为：small,normal(default),midiue,large,或者设置具体数值",
                    dataType: "String | Number",
                    default: "",
                    options: this.getSize,
                },
                {
                    showConfig: true,
                    label: "按钮icon",
                    key: "icon",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "按钮icon",
                    dataType: "String",
                    options: this.iconslist,
                },
                {
                    label: "表单类型",
                    key: "type",
                    explain: "表单类型:可选值为button,reset,submit'",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "继承属性",
                    key: "$attrs",
                    explain: "继承属性：tag，to，href 等...",
                    dataType: "String",
                    dataType: "-",
                },
                {
                    label: "继承事件",
                    key: "$listeners",
                    explain: "继承事件",
                    dataType: "String",
                    dataType: "-",
                },
                {
                    label: "子元素",
                    key: "slot:default",
                    explain: "子元素",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "子元素icon",
                    key: "slot:icon",
                    explain: "子元素",
                    dataType: "VNode",
                    default: "-",
                },
            ]
        },
    },
}
</script>
