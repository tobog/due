<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Alert 警告提示)</h2>
            <h4 class="padding-top-10">静态地呈现一些警告信息，可手动关闭</h4>
        </template>
        <template v-slot="config">
            <vAlert v-bind="config">
                Alert offsetBottom
                <div slot="desc">
                    Content of prompt. Content of prompt. Content of prompt. Content of prompt.
                </div>
            </vAlert>
            <vAlert v-bind="config">
                Alert offsetBottom
            </vAlert>
            <vAnchor v-show="false"></vAnchor>
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
                    demoDefault: true,
                    explain: "是否显示图标",
                    dataType: "Boolean",
                    default: true,
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
                // {
                //     showConfig: true,
                //     label: "广播",
                //     key: "broadcast",
                //     tag: "vSwitch",
                //     demoDefault: false,
                //     explain: "是否可广播",
                //     dataType: "Boolean",
                //     default: false,
                // },
                {
                    showConfig: true,
                    label: "icon对齐方式",
                    key: "align",
                    tag: "vSelect",
                    demoDefault: "start",
                    explain: "icon 对齐方式(仅对有desc的设置)，可选值为：start, center, end",
                    dataType: "String",
                    default: "start",
                    options: ["start", "center", "end"],
                },
                {
                    showConfig: true,
                    label: "类型",
                    key: "type",
                    tag: "vSelect",
                    demoDefault: "info",
                    explain: "警告提示样式，可选值为：success, info, warning, error,loading,或者自定义icon",
                    dataType: "String",
                    default: "info",
                    options: ["success", "info", "warning", "error", "loading"],
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "尺寸大小，可选值为：small,normal(default),medium,large",
                    dataType: "String",
                    default: "inf",
                    options: this.getSize,
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
                    label: "描述",
                    key: "desc",
                    tag: "vTextarea",
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
                    label: "事件",
                    key: "on-after-close",
                    explain: "关闭动画消失时触发",
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
        getCode() {
            return `<Alert v-bind=CODE>
                        Alert
                        <div slot="desc">
                            Content of prompt. Content of prompt. Content of prompt. Content of prompt.
                        </div>
                    </Alert>`
        },
    },
};
</script>
