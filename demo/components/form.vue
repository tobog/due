<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (FormItem | Form表单)</h2>
            <h4 class="padding-top-10">
                具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。
            </h4>
        </template>
        <template v-slot="config">
            <vConfig v-bind="config.Demo">
                <vForm v-bind="config.Form">
                    <vFormItem v-bind="config.FormItem" label="多选框">
                        <vCheckbox v-model="form.Checkbox" true-value="1" class="mr-10">多选框1</vCheckbox>
                        <vCheckbox v-model="form.Checkbox" true-value="2">多选框2</vCheckbox>
                    </vFormItem>
                    <vFormItem v-bind="config.FormItem" label="单选">
                        <vRadio v-model="form.Radio" trueValue="1">单选1</vRadio>
                        <vRadio v-model="form.Radio" trueValue="2">单选2</vRadio>
                    </vFormItem>
                    <vFormItem v-bind="config.FormItem" label="开关">
                        <vSwitch v-model="form.Switch"></vSwitch>
                    </vFormItem>
                    <vFormItem v-bind="config.FormItem" label="颜色">
                        <vColorPicker v-model="form.ColorPicker"></vColorPicker>
                    </vFormItem>
                    <vFormItem v-bind="config.FormItem" label="日期">
                        <vDatepicker v-model="form.Datepicker"></vDatepicker>
                    </vFormItem>
                    <vFormItem v-bind="config.FormItem" label="数据输入框">
                        <vInputNumber v-model="form.InputNumber"></vInputNumber>
                    </vFormItem>
                    <vFormItem v-bind="config.FormItem" label="下拉多选框">
                        <vSelect v-model="form.Select" :options="options"></vSelect>
                    </vFormItem>
                    <vFormItem v-bind="config.FormItem" label="输入框">
                        <vInput v-model="form.Input"></vInput>
                    </vFormItem>
                    <vFormItem v-bind="config.FormItem" label="文本框">
                        <vTextarea v-model="form.Textarea" />
                    </vFormItem>
                    <vFormItem>
                        <vButton theme="primary">Button</vButton>
                    </vFormItem>
                </vForm>
            </vConfig>
            <div class="mt-10">
                <pre>
                    {{ JSON.stringify(form, null, 4) }}
                </pre>
            </div>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            form: {
                Checkbox: [],
            },
            value: "",
            formItem: {},
            options: [
                {
                    value: "下拉多选框1",
                },
                {
                    value: "下拉多选框2",
                },
            ],
        }
    },
    methods: {},
    computed: {
        getCode() {
            return ` <Form>
                        <FormItem v-bind=CODE label="rules 测试">
                            <Textarea v-model="value" />
                        </FormItem>
                        <FormItem v-bind="config" label="labelWidth" required prop="labelWidth">
                            <Input v-model="value" />
                        </FormItem>
                        <FormItem v-bind="config" label="labelWidth">
                            <Input v-model="value" />
                        </FormItem>
                    </Form>
                        `
        },
        getConfig() {
            return {
                Form: {
                    data: this.getFormConfig,
                },
                FormItem: {
                    data: this.getFormItemConfig,
                },
                Demo: {
                    hide: false,
                    data: this.getDemoProp,
                },
            }
        },
        getFormItemConfig() {
            return [
                {
                    showConfig: true,
                    label: "行内表单",
                    key: "inline",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否开启行内表单模式",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "反向布局",
                    key: "reverse",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "便签在右边显示",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "反向布局",
                    key: "showMessage",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "是否显示校验错误信息",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "label垂直对齐位",
                    key: "vertical",
                    tag: "vSelect",
                    demoDefault: "center",
                    explain: "标签文本垂直对齐位置 可选值:center,start,end,baseline,stretch",
                    dataType: "String",
                    default: "center",
                    options: ["center", "start", "end", "baseline", "stretch"],
                },
                {
                    showConfig: true,
                    label: "label对齐",
                    key: "align",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "标签文本位置,可选值：center, left, right, justify ",
                    dataType: "String",
                    default: "",
                    options: ["center", "left", "right", "justify"],
                },
                {
                    showConfig: true,
                    label: "标签的宽度",
                    key: "labelWidth",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "标签的宽度",
                    dataType: "String | Number",
                    default: "",
                },
                {
                    label: "提示",
                    key: "message",
                    explain: "提示文本",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "验证规则",
                    key: "rules",
                    explain: "表单的验证规则",
                    dataType: "Array",
                    default: "-",
                },
                {
                    label: "表单name",
                    key: "prop",
                    explain: "表单name，提供验证",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "是否必填",
                    key: "required",
                    explain: "是否必填，如不设置，则会根据校验规则自动生成",
                    dataType: "Boolean",
                    default: "false",
                },
                {
                    label: "验证数据",
                    key: "value",
                    explain: "自定义传入验证数据",
                    dataType: "Any",
                    default: "-",
                },
                {
                    label: "单个表单宽度",
                    key: "width",
                    explain: "单个表单宽度",
                    dataType: "Number, String",
                    default: "",
                },
                {
                    label: "清除验证消息",
                    key: "resetValidate",
                    explain: "清除表单验证消息",
                    dataType: "Function",
                    default: "()=>{}",
                },
                {
                    label: "验证函数",
                    key: "validate",
                    explain: "验证表单验证",
                    dataType: "Function:Promise",
                    default: "(val,cb)=>{}",
                },
                {
                    label: "标签",
                    key: "label",
                    explain: "标签属性",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "自定义标签",
                    key: "slot:label",
                    explain: "自定义label",
                    dataType: "VNode",
                    default: "prop:label",
                },
                {
                    label: "子表单项目",
                    key: "slot:default",
                    explain: "提供子表单项目",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "提示内容",
                    key: "slot:message",
                    explain: "提供提示内容",
                    dataType: "VNode",
                    default: "-",
                },
            ]
        },
        getFormConfig() {
            return [
                {
                    showConfig: true,
                    label: "行内表单",
                    key: "inline",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否开启行内表单模式",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "反向布局",
                    key: "reverse",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "便签在右边显示",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "校验信息",
                    key: "showMessage",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "是否显示校验错误信息",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    label: "错误定位",
                    key: "errorInview",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "Form：错误定位",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "标签的宽度",
                    key: "labelWidth",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "标签的宽度",
                    dataType: "String | Number",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "label垂直对齐位",
                    key: "labelVertical",
                    tag: "vSelect",
                    demoDefault: "center",
                    explain: "标签文本垂直对齐位置 可选值:center,start,end,baseline,stretch",
                    dataType: "String",
                    default: "center",
                    options: ["center", "start", "end", "baseline", "stretch"],
                },
                {
                    showConfig: true,
                    label: "label对齐",
                    key: "labelAlign",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "标签文本位置,可选值：center, left, right, justify ",
                    dataType: "String",
                    default: "",
                    options: ["center", "left", "right", "justify"],
                },
                {
                    label: "单个表单宽度",
                    key: "width",
                    explain: "单个表单宽度",
                    dataType: "Number, String",
                    default: "",
                },
                {
                    label: "校验规则",
                    key: "rules",
                    explain: "校验规则",
                    dataType: "Number, String",
                    default: "",
                },
                {
                    label: "验证函数",
                    key: "validate",
                    explain: "FormItem|Form:验证表单验证",
                    dataType: "Function:Promise",
                    default: "(val,cb)=>{}",
                },
                {
                    label: "清除验证消息",
                    key: "resetValidate",
                    explain: "清除表单验证消息",
                    dataType: "Function:Promise",
                    default: "(prop, cb)=>{}",
                },
                {
                    label: "事件",
                    key: "on-submit",
                    explain: "form 表单提交时触发",
                    dataType: "Function",
                    default: "()=>{}",
                },
            ]
        },
        getDemoProp() {
            return [
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
                    label: "主题颜色",
                    key: "theme",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "主题颜色",
                    dataType: "String",
                    default: "",
                    options: this.getThemes,
                },
            ]
        },
    },
}
</script>
