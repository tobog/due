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
                    explain: "是否开启行内表单模式",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "反向布局",
                    key: "reverse",
                    tag: "vSwitch",
                    explain: "是否开启行内表单模式",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "错误定位",
                    key: "errorInview",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "label垂直对齐位",
                    key: "vertical",
                    tag: "vSelect",
                    default: "center",
                    options: ["center", "start", "end", "baseline", "stretch"],
                },
                {
                    label: "label对齐",
                    key: "align",
                    tag: "vSelect",
                    // default: "",
                    options: ["center", "left", "right", "justify"],
                },
                {
                    label: "标签的宽度",
                    key: "labelWidth",
                    tag: "vInput",
                    // default: ''
                },
            ]
        },
    },
}
</script>
