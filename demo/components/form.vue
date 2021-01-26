<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Form 表单)</h2>
            <h4 class="padding-top-10">
                具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。
            </h4>
        </template>
        <template v-slot="config">
            <vForm>
                <vFormItem v-bind="config" label="rules 测试">
                    <vTextarea v-model="value" />
                </vFormItem>
                <vFormItem v-bind="config" label="测试测试">
                    <vTextarea v-model="value" />
                </vFormItem>
                <vFormItem v-bind="config" label="测试">
                    <vTextarea v-model="value" />
                </vFormItem>
                <vFormItem v-bind="config" label="labelWidth" required prop="labelWidth">
                    <vInput v-model="value" />
                </vFormItem>
                <vFormItem v-bind="config" label="labelWidth">
                    <vInput v-model="value" />
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
            return ` <vForm>
                        <vFormItem v-bind=CODE label="rules 测试">
                            <vTextarea v-model="value" />
                        </vFormItem>
                        <vFormItem v-bind="config" label="测试测试">
                            <vTextarea v-model="value" />
                        </vFormItem>
                        <vFormItem v-bind="config" label="测试">
                            <vTextarea v-model="value" />
                        </vFormItem>
                        <vFormItem v-bind="config" label="labelWidth" required prop="labelWidth">
                            <vInput v-model="value" />
                        </vFormItem>
                        <vFormItem v-bind="config" label="labelWidth">
                            <vInput v-model="value" />
                        </vFormItem>
                    </vForm>
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
                    explain: "是否开启行内表单模式",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "错误定位",
                    key: "errorInview",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "错误定位",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "label垂直对齐位",
                    key: "vertical",
                    tag: "vSelect",
                    demoDefault: "center",
                    explain: "label垂直对齐位,可选值：center, start, end, baseline, stretch  ",
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
                    explain: "label对齐,可选值：center, left, right, justify  ",
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
            ]
        },
    },
}
</script>
