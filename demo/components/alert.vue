<style lang="scss"></style>

<template>
    <Demo :config="getConfig">
        <template slot="header">
            <h2>代码示例 (Alert 警告提示)</h2>
            <h4 class="padding-top-10">静态地呈现一些警告信息，可手动关闭</h4>
        </template>
        <template v-slot="config">
            <Alert v-bind="config">
                Alert offsetBottom
                <div slot="desc">
                    Content of prompt. Content of prompt. Content of prompt. Content of prompt.
                </div>
            </Alert>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "可关闭",
                    key: "closable",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否可关闭",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "显示图标",
                    key: "showIcon",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否显示图标",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "幽灵透明",
                    key: "ghost",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "幽灵透明",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "广播",
                    key: "broadcast",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否可广播",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "类型",
                    key: "type",
                    tag: "Select",
                    demoDefault: "",
                    explain: "警告提示样式，可选值为：success, info, warning, error,loading",
                    dataType: "String",
                    default: "",
                    options: [...this.getThemes, "loading"],
                },
                {
                    showConfig: true,
                    label: "自定义颜色",
                    key: "color",
                    tag: "Input",
                    demoDefault: "",
                    explain: "自定义颜色",
                    dataType: "String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "描述",
                    key: "desc",
                    tag: "Textarea",
                    demoDefault: "",
                    explain: "描述",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "事件",
                    key: "on-close",
                    explain: "关闭时触发",
                    dataType: "Function:Event",
                    default: "-",
                },
                {
                    label: "子元素",
                    key: "slot:default",
                    explain: "警告提示内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "标题子元素",
                    key: "slot:default",
                    explain: "警告提示内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "描述子元素",
                    key: "slot:desc",
                    explain: "警告提示辅助性文字介绍",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "关闭子元素",
                    key: "slot:close",
                    explain: "自定义关闭内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "图标内容",
                    key: "slot:icon",
                    explain: "自定义图标内容",
                    dataType: "VNode",
                    default: "-",
                },
            ];
        },
    },
};
</script>
