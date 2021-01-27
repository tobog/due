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
            <vForm>
                <vFormItem v-bind="config" label="测试">
                    <vCheckbox></vCheckbox>
                    <vRadio></vRadio>
                    <vSwitch></vSwitch>
                </vFormItem>
                <vFormItem v-bind="config" label="测试">
                    <vInputNumber></vInputNumber>
                </vFormItem>
                <vFormItem v-bind="config" label="测试">
                    <vSelect></vSelect>
                </vFormItem>
                <vFormItem v-bind="config" label="测试测试">
                    <vInput></vInput>
                </vFormItem>
                <vFormItem v-bind="config" label="测试">
                    <vTextarea v-model="value" />
                </vFormItem>
                <vFormItem v-bind="config" label="labelWidth" required prop="labelWidth">
                    <vInput v-model="value" />
                </vFormItem>
                <vFormItem>
                    <vButton theme="primary">Button</vButton>
                </vFormItem>
            </vForm>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value: "",
            formItem: {},
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
            return [
                {
                    showConfig: true,
                    label: "行内表单",
                    key: "inline",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "FormItem|Form：是否开启行内表单模式",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "反向布局",
                    key: "reverse",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "FormItem|Form：便签在右边显示",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "反向布局",
                    key: "showMessage",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "FormItem|Form：是否显示校验错误信息",
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
                    explain: "标签文本位置,可选值：center, left, right, justify  ",
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
                    explain: "FormItem|Form：标签的宽度",
                    dataType: "String | Number",
                    default: "",
                },
                {
                    label: "提示",
                    key: "message",
                    explain: "FormItem:提示",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "验证规则",
                    key: "rules",
                    explain: "FormItem|Form: 表单的验证规则",
                    dataType: "Array",
                    default: "-",
                },
                {
                    label: "表单name",
                    key: "prop",
                    explain: "FormItem:表单name，提供验证",
                    dataType: "Array",
                    default: "-",
                },
                {
                    label: "是否必填",
                    key: "required",
                    explain: "FormItem:是否必填，如不设置，则会根据校验规则自动生成",
                    dataType: "Boolean",
                    default: "false",
                },
                {
                    label: "验证数据",
                    key: "value",
                    explain: "FormItem:自定义传入验证数据",
                    dataType: "Any",
                    default: "-",
                },
                {
                    label: "清除验证消息",
                    key: "resetValidate",
                    explain: "FormItem|Form:清除表单验证消息",
                    dataType: "Function",
                    default: "()=>{}",
                },
                {
                    label: "验证函数",
                    key: "validate",
                    explain: "FormItem|Form:验证表单验证",
                    dataType: "Function:Promise",
                    default: "(val,cb)=>{}",
                },
                {
                    label: "项目宽度",
                    key: "width",
                    explain: "FormItem|Form:项目宽度",
                    dataType: "Number | String",
                    default: "(val,cb)=>{}",
                },
                {
                    label: "标签的位置",
                    key: "labelAlign",
                    explain: "Form:表单域标签的位置，可选值为 left、right、justify,center",
                    dataType: "Number | String",
                    default: "left",
                },
                {
                    label: "label垂直对齐位",
                    key: "labelVertical",
                    explain: "Form:label垂直对齐位，可选值为 center , start , end , baseline , stretch",
                    dataType: "Number | String",
                    default: "center",
                },
                {
                    label: "自定义标签",
                    key: "slot:label",
                    explain: "FormItem|Form:自定义label",
                    dataType: "VNode",
                    default: "prop:label",
                },
                {
                    label: "子表单项目",
                    key: "slot:default",
                    explain: "FormItem|Form:提供子表单项目",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "提示内容",
                    key: "slot:message",
                    explain: "FormItem:提供提示内容",
                    dataType: "VNode",
                    default: "-",
                },
            ]
        },
    },
}
</script>
