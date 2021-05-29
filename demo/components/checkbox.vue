<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Checkbox 多选框)</h2>
            <h4 class="padding-top-10">基本组件-多选框。主要用于一组可选项多项选择，或者单独用于标记切换某种状态</h4>
        </template>
        <template v-slot="config">
            <vCheckBox v-model="val1" true-value="1" false-value="2" v-bind="config.Checkbox">单独的Checkbox {{ val1 }}</vCheckBox>
            <div class="margin-20">{{ val }}</div>
            <vCheckBox v-model="val" true-value="1" v-bind="config.Checkbox"></vCheckBox>
            <vCheckBox v-model="val" true-value="2" v-bind="config.Checkbox"></vCheckBox>
            <vCheckBox v-model="val" true-value="3" v-bind="config.Checkbox"></vCheckBox>
            <vCheckBox v-model="val" :true-value="4" v-bind="config.Checkbox"></vCheckBox>
            <div class="margin-20">CheckBoxGroup{{ val2 }}</div>
            <vCheckBoxGroup v-model="val2" v-bind="config.CheckboxGroup">
                <vCheckBox true-value="3" v-bind="config.Checkbox"></vCheckBox>
                <vCheckBox true-value="1" v-bind="config.Checkbox"></vCheckBox>
                <vCheckBox true-value="2" v-bind="config.Checkbox"></vCheckBox>
                <vCheckBox :true-value="4" v-bind="config.Checkbox"></vCheckBox>
                <vCheckBox true-value="4" v-bind="config.Checkbox"></vCheckBox>
            </vCheckBoxGroup>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            val: [4],
            val2: ['1','2'],
            val1: "",
        };
    },
    computed: {
        getCode() {
            return `<CheckBox v-model="val1" true-value="1" false-value="0" v-bind="config.Checkbox"></CheckBox>
                    <CheckBox v-model="val" true-value="1" v-bind="config.Checkbox"></CheckBox>
                    <CheckBox v-model="val" true-value="2" v-bind="config.Checkbox"></CheckBox>
                    <CheckBox v-model="val" true-value="3" v-bind="config.Checkbox"></CheckBox>
                    <CheckBox v-model="val" :true-value="4" v-bind="config.Checkbox"></CheckBox>
                    <div class="margin-20">CheckBoxGroup{{ val2 }}</div>
                    <CheckBoxGroup v-model="val2" v-bind="config.CheckboxGroup">
                        <CheckBox true-value="3" v-bind="config.Checkbox"></CheckBox>
                        <CheckBox true-value="1" v-bind="config.Checkbox"></CheckBox>
                        <CheckBox true-value="2" v-bind="config.Checkbox"></CheckBox>
                        <CheckBox :true-value="4" v-bind="config.Checkbox"></CheckBox>
                        <CheckBox true-value="4" v-bind="config.Checkbox"></CheckBox>
                    </CheckBoxGroup>
					`;
        },
        getConfig() {
            return {
                Checkbox: {
                    data: this.getCheckboxConfig,
                },
                CheckboxGroup: {
                    data: this.getCheckboxGroup,
                },
            };
        },
        getCheckboxConfig() {
            return [
                {
                    showConfig: true,
                    label: "半选",
                    key: "indeterminate",
                    demoDefault: false,
                    explain: "是否半选,设置 indeterminate 状态，只负责样式控制",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "幽灵模式",
                    key: "ghost",
                    demoDefault: false,
                    explain: "是否幽灵模式",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "禁用",
                    key: "disabled",
                    demoDefault: false,
                    explain: "是否禁用当前项",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "仅读",
                    key: "readonly",
                    demoDefault: false,
                    explain: "CheckBoxGroup,CheckBox是否仅读",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "严格匹配",
                    key: "strict",
                    demoDefault: true,
                    explain: "是否严格匹配",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "显示边框",
                    key: "border",
                    demoDefault: false,
                    explain: "是否显示边框",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "radio样式显示",
                    key: "radio",
                    demoDefault: false,
                    explain: "是否radio样式显示",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "反选",
                    key: "reverse",
                    demoDefault: false,
                    explain: "是否反选",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "显示文字",
                    key: "label",
                    demoDefault: "测试label",
                    explain: "显示文字",
                    dataType: "String",
                    tag: "vInput",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "选中时的值",
                    key: "trueValue",
                    demoDefault: true,
                    explain: "选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用",
                    dataType: "Boolean|String",
                    tag: "vInput",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "不选中时的值",
                    key: "falseValue",
                    demoDefault: undefined,
                    explain: "没有选中时的值，当使用类似 1 和 0 来判断是否选中时会很有用",
                    dataType: "Boolean|String",
                    tag: "vInput",
                    default: undefined,
                },

                {
                    showConfig: true,
                    label: "图标",
                    key: "trueIcon",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "图标",
                    dataType: "String",
                    default: "",
                    options: this.iconslist,
                },
                {
                    showConfig: true,
                    label: "主题颜色",
                    key: "theme",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "CheckBoxGroup,CheckBox主题颜色",
                    dataType: "String",
                    default: "",
                    options: this.getThemes,
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),medium,large,或者设置具体数值",
                    dataType: "String | Number",
                    default: "",
                    options: this.getSize,
                },
                {
                    label: "表单名称",
                    key: "name",
                    explain: "form 表单名称",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "value",
                    key: "value",
                    explain: "CheckBox可以使用 v-model 双向绑定数据",
                    dataType: "String, Number, Boolean, Array",
                    default: "",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "CheckBox在选项状态发生改变时触发，通过修改外部的数据改变时不会触发",
                    dataType: "Function:Event",
                    default: "(value, event)=>{}",
                },
                {
                    label: "自定义文字",
                    key: "slot:default",
                    explain: "自定义文字",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "自定义checkbox样式",
                    key: "slot:content",
                    explain: "自定义 checkbox 样式",
                    dataType: "VNode:isChecked",
                    default: "-",
                },
            ];
        },
        getCheckboxGroup() {
            return [
                {
                    showConfig: true,
                    label: "仅读",
                    key: "readonly",
                    demoDefault: false,
                    explain: "CheckBoxGroup,CheckBox是否仅读",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "最小选中个数",
                    key: "min",
                    tag: "vInputNumber",
                    demoDefault: 1,
                    explain: "最小选中个数",
                    dataType: "Number, String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "最大选中个数",
                    key: "max",
                    tag: "vInputNumber",
                    demoDefault: 4,
                    explain: "最大选中个数",
                    dataType: "Number, String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "主题颜色",
                    key: "theme",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "CheckBoxGroup,CheckBox主题颜色",
                    dataType: "String",
                    default: "",
                    options: this.getThemes,
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),medium,large,或者设置具体数值",
                    dataType: "String | Number",
                    default: "",
                    options: this.getSize,
                },
                {
                    label: "value",
                    key: "value",
                    explain: "CheckBox可以使用 v-model 双向绑定数据",
                    dataType: "String, Number, Boolean, Array",
                    default: "",
                },
                {
                    label: "options",
                    key: "options",
                    explain: "子元素数据结构",
                    dataType: "Array",
                    default: "",
                },
                {
                    label: "子元素",
                    key: "slot",
                    explain: "子元素",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "在选项状态发生改变时触发，通过修改外部的数据改变时不会触发",
                    dataType: "Function:Event",
                    default: "(value, event)=>{}",
                },
            ];
        },
    },
};
</script>
