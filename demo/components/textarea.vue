<style lang="scss">

</style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
           	<h2>代码示例 (Textarea 文本框)</h2>
        </template>
        <template v-slot="config">
            <vTextarea v-bind="config" v-model="val" class="margin-bottom-20">
            </vTextarea>
            <div class="padding-15">{{ val }}</div>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            val: "",
        }
    },
    computed: {
        getCode() {
            return `
                    <vTextarea  v-model="val" class="margin-bottom-20">
                        <div slot="prepend">prepend</div>
                        <div slot="append">测试</div>
                    </vTextarea>
					`
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
                // {
                //     showConfig: true,
                //     label: "尾部图标",
                //     key: "suffix",
                //     tag: "vSelect",
                //     default: void 0,
                //     demoDefault: "person",
                //     explain: "suffix|slot:suffix输入框尾部图标",
                //     dataType: "Number|VNode",
                //     options: this.iconslist,
                // },
                {
                    showConfig: true,
                    label: "字符长度",
                    key: "maxLength",
                    tag: "vInputNumber",
                    default: void 0,
                    demoDefault: void 0,
                    explain: "输入模式下允许输入最大字符",
                    dataType: "Number",
                },
                {
                    showConfig: true,
                    label: "字符长度提示",
                    key: "showWordCount",
                    tag: "vSwitch",
                    default: false,
                    demoDefault: false,
                    explain: "输入模式下是否显示字符长度提示",
                    dataType: "Boolean",
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
                    label: "$attrs",
                    key: "$attrs",
                    demoDefault: "",
                    explain: "继承textarea 的 $attrs",
                    dataType: "String",
                    default: "",
                },
                {
                    key: "name",
                    explain: "表单name",
                    dataType: "String",
                },
                {
                    key: "value",
                    explain: "绑定的值，可使用 v-model 双向绑定",
                    dataType: "String|Number|Array",
                    default: "",
                },
                {
                    key: "slots:prepend",
                    explain: "输入框外头部组件",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    key: "scoped:default",
                    explain: "自定义 opt 配置",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    key: "on-change",
                    explain: "数据改变时触发事件",
                    dataType: "Function:(val,__attachData)=>{}",
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
                    key: "on-enter",
                    explain: "按下回车键时触发事件",
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
