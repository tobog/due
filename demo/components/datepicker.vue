<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (DatePicker 日期选择器)</h2>
            <h4 class="padding-top-10">选择或输入日期，支持年、月、日期等类型，支持选择范围。</h4>
        </template>
        <template v-slot="config">
            <vDatepicker :options="{shortcuts}" v-model="value" v-bind="config"></vDatepicker>
            <div :style="{background: value, height: '30px'}">
                {{ value }}
            </div>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value: "",
            shortcuts: [
                {
                    text: "Today",
                    value() {
                        return new Date()
                    },
                },
                {
                    text: "One week",
                    value() {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        return date
                    },
                },
            ],
        }
    },
    methods: {},
    computed: {
        getCode() {
            return `<vDatepicker v-model="value" v-bind=CODE>
					</vDatepicker>`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "禁用状态",
                    key: "disabled",
                    demoDefault: false,
                    explain: "是否有禁用状态",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "弹层位置",
                    key: "transfer",
                    demoDefault: false,
                    explain:
                        "是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "自动关闭",
                    key: "autoClose",
                    demoDefault: false,
                    explain: "是否自动关闭",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "多个日期",
                    key: "multiple",
                    demoDefault: false,
                    explain: "开启后，可以选择多个日期",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "双面板",
                    key: "doublePanel",
                    demoDefault: true,
                    explain: "是否双面板",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "确认关闭",
                    key: "confirm",
                    demoDefault: true,
                    explain: "是否确认关闭",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "仅读",
                    key: "readonly",
                    demoDefault: false,
                    explain: "是否仅读",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "标签显示",
                    key: "isTag",
                    demoDefault: true,
                    explain: "是否标签显示",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "标签显示",
                    key: "isTag",
                    demoDefault: true,
                    explain: "是否标签显示",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "可清除",
                    key: "clearable",
                    demoDefault: true,
                    explain: "是否可清除",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "显示星期数",
                    key: "showWeek",
                    demoDefault: true,
                    explain: "是否显示星期数",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: true,
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
                    label: "日期格式",
                    key: "format",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "展示的日期格式,(Y,M,D,H,m,s)",
                    dataType: "String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "显示类型",
                    key: "type",
                    tag: "vSelect",
                    demoDefault: "datetimerange",
                    explain: "显示类型，可选值为 date、daterange、datetime、datetimerange、year、month",
                    dataType: "String",
                    default: "",
                    options: [
                        "date",
                        "daterange",
                        "datetime",
                        "datetimerange",
                        "year",
                        "month",
                        "times",
                        "timesrange",
                        "hours",
                        "hoursrange",
                    ],
                },
                {
                    showConfig: true,
                    label: "折叠日期",
                    key: "collapse",
                    tag: "vInputNumber",
                    demoDefault: "",
                    explain: "折叠日期个数",
                    dataType: "Number",
                    default: 0,
                },
                {
                    label: "当前值",
                    key: "value",
                    demoDefault: "",
                    explain: "v-model(input) 双向绑定",
                    dataType: "Array, String, Date",
                    default: "",
                },
                {
                    label: "默认开始日期",
                    key: "startDate",
                    demoDefault: "",
                    explain: "默认开始日期",
                    dataType: "String, Date, Object, Number",
                    default: "Date.now()",
                },
                {
                    label: "额外配置",
                    key: "options",
                    demoDefault: "",
                    explain: "选择器额外配置，比如不可选日期与快捷选项",
                    dataType: "Object",
                    default: "",
                },
                {
                    label: "是否可用",
                    key: "invalid",
                    demoDefault: "",
                    explain: "当前日期不可用",
                    dataType: "Function",
                    default: "Boolean:(dateObje,type)=>{}",
                },
                {
                    label: "继承属性",
                    key: "$attrs",
                    demoDefault: "",
                    explain: "继承input 属性",
                    dataType: "Object",
                    default: "",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "日期发生变化触发",
                    dataType: "Function：Event",
                    default: "(value,news, event)=>{}",
                },
                {
                    label: "事件",
                    key: "on-blur",
                    explain: "失去焦点触发",
                    dataType: "Function：Event",
                    default: "(value,news, event)=>{}",
                },
                {
                    label: "事件",
                    key: "on-foucs",
                    explain: "获取焦点触发",
                    dataType: "Function：Event",
                    default: "(value,news, event)=>{}",
                },
                {
                    label: "事件",
                    key: "on-clear",
                    explain: "清除时触发",
                    dataType: "Function：Event",
                    default: "(visible)=>{}",
                },
            ]
        },
    },
}
</script>
