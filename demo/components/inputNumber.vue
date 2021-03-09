<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (InputNumber)</h2>
            <h4 class="padding-top-10">
                基本表单组件，支持 input 和 textarea，并在原生控件基础上进行了功能扩展，可以组合使用。
            </h4>
        </template>
        <template v-slot="config">
            <vInputNumber v-bind="config" :formatter="(val) => `${val}%`" v-model="val"></vInputNumber>
            <vInputNumber v-bind="config" :formatter="(val) => `$ ${val}`" v-model="val1"></vInputNumber>
            <div class="padding-15">{{ val }}</div>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            val: "",
            val1: "",
        }
    },
    computed: {
        getCode() {
            return `<InputNumber class="margin-bottom-20" v-model="val"></InputNumber>
					<InputNumber v-bind="CODE" :formatter="val => val%" v-model="val"></InputNumber>`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "禁用状态",
                    key: "disabled",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "禁用状态",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "清空按钮",
                    key: "clearable",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "清空按钮",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "控制按钮",
                    key: "controls",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "是否使用控制按钮",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "分割控制按钮",
                    key: "splitControls",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否使用分割控制按钮",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "只读",
                    key: "readonly",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否只读",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "头部图标",
                    key: "prefix",
                    tag: "vSelect",
                    default: void 0,
                    demoDefault: "person",
                    explain: "prefix|slot:prefix 输入框头部图标",
                    dataType: "Number|VNode",
                    options: this.iconslist,
                },
                {
                    showConfig: true,
                    label: "尾部图标",
                    key: "suffix",
                    tag: "vSelect",
                    default: void 0,
                    demoDefault: "person",
                    explain: "suffix|slot:suffix输入框尾部图标",
                    dataType: "Number|VNode",
                    options: this.iconslist,
                },
                {
                    showConfig: true,
                    label: "主题",
                    key: "theme",
                    tag: "vSelect",
                    default: "",
                    demoDefault: "",
                    explain: "主题",
                    dataType: "String",
                    options: this.getThemes,
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),medium,large",
                    dataType: "String",
                    default: "",
                    options: this.getSize,
                },
                {
                    showConfig: true,
                    label: "滚动变化",
                    key: "scroll",
                    tag: "vSwitch",
                    default: false,
                    demoDefault: false,
                    explain: "滚动变化",
                    dataType: "Boolean",
                },
                {
                    showConfig: true,
                    label: "基数倍率",
                    key: "radix",
                    tag: "vInputNumber",
                    default: 1,
                    demoDefault: 1,
                    explain: "基数倍率",
                    dataType: "Number",
                },
                {
                    showConfig: true,
                    label: "步伐",
                    key: "step",
                    tag: "vInputNumber",
                    default: 1,
                    demoDefault: 1,
                    explain: "每次改变的步伐，可以是小数",
                    dataType: "Number",
                },
                {
                    showConfig: true,
                    label: "最大值",
                    key: "max",
                    tag: "vInputNumber",
                    demoDefault: "",
                    explain: "最大值",
                    dataType: "Number",
                },
                {
                    showConfig: true,
                    label: "最小值",
                    key: "min",
                    tag: "vInputNumber",
                    demoDefault: "",
                    explain: "最小值",
                    dataType: "Number",
                },
                {
                    showConfig: true,
                    label: "小数点",
                    key: "precision",
                    tag: "vInputNumber",
                    demoDefault: "",
                    explain: "小数点",
                    dataType: "Number",
                },
                // {
                //     showConfig: true,
                //     label: "Math对象方法",
                //     key: "math",
                //     tag: "vInput",
                //     demoDefault: "",
                //     explain: "Math对象方法",
                //     dataType: "string",
                // },
                {
                    key: "name",
                    explain: "表单name",
                    dataType: "String",
                },
                {
                    key: "formatter",
                    explain: "指定输入框展示值的格式",
                    dataType: "Function:(resultRadix,val)=va",
                },
                {
                    key: "value",
                    explain: "绑定的值，可使用 v-model 双向绑定",
                    dataType: "String|Number|Array",
                    default: "",
                },
                {
                    key: "$attrs",
                    explain: "继承$attrs",
                    dataType: "object",
                    default: "-",
                },
                {
                    key: "slots:prepend",
                    explain: "输入框外头部组件",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    key: "slots:append",
                    explain: "输入框外尾部组件",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    key: "input",
                    explain: "数据改变时触发事件(v-model)",
                    dataType: "Function:(val)=>{}",
                    default: "-",
                },
                {
                    key: "on-keydown",
                    explain: "按下键盘触发",
                    dataType: "Function:(val)=>{}",
                    default: "-",
                },
                {
                    key: "on-enter",
                    explain: "按下enter键触发",
                    dataType: "Function:(val)=>{}",
                    default: "-",
                },
                {
                    key: "on-change",
                    explain: "数据改变时触发事件",
                    dataType: "Function:(val)=>{}",
                    default: "-",
                },
                {
                    key: "on-focus",
                    explain: "输入框聚焦时触发事件",
                    dataType: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    key: "on-blur",
                    explain: "输入框失去焦点时触事件",
                    dataType: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    key: "on-clear",
                    explain: "点击清除触发事件",
                    dataType: "Function",
                    default: "-",
                },
            ]
        },
    },
}
</script>
