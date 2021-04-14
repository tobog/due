<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Anchor 锚点)</h2>
            <h4 class="padding-top-10">用于跳转到页面指定位置</h4>
        </template>
        <template v-slot="config">
            <div>
                <vAnchor v-bind="config">
                    跳转到其他页面的特定元素
                </vAnchor>
            </div>
            <div>
                <vAnchor v-bind="config" href="">
                    本页面滚动特定元素
                </vAnchor>
            </div>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {};
    },
    computed: {
        getCode() {
            return `<Anchor v-bind=CODE></Anchor>
                    <Anchor selector="#Anchor">USER</Anchor>`;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "锚点链接",
                    key: "href",
                    tag: "vInput",
                    demoDefault: "/alert",
                    explain: "跳转的锚点链接",
                    dataType: "String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "文字内容",
                    key: "title",
                    tag: "vInput",
                    demoDefault: "test Anchor",
                    explain: "文字内容",
                    dataType: "String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "锚点选择器",
                    key: "selector",
                    tag: "vInput",
                    demoDefault: ".demo-table",
                    explain: "非href时，锚点选择器",
                    dataType: "String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "元素显示位置",
                    key: "position",
                    tag: "vInput",
                    demoDefault: "start",
                    explain: "目标元素元素在浏览器中显示位置,可选：center，start(true),end(false),或者数字",
                    dataType: "String,Number,Boolean",
                    default: "start",
                    options: ["start", "center", "end"],
                },
                // {
                //     showConfig: true,
                //     label: "尺寸大小",
                //     key: "size",
                //     tag: "vSelect",
                //     demoDefault: "",
                //     explain: "尺寸大小，可选值为：small,normal(default),medium,large",
                //     dataType: "String",
                //     default: "inf",
                //     options: this.getSize,
                // },
                {
                    label: "文字内容",
                    key: "slot:default",
                    explain: "自定义文字内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-jump",
                    explain: "跳转时触发",
                    dataType: "Function:Event",
                    default: "href",
                },
                {
                    label: "事件",
                    key: "on-scroll",
                    explain: "滚动时触发",
                    dataType: "Function:Event",
                    default: "selector",
                },
                {
                    label: "继承a标签的属性",
                    key: "$attrs",
                    explain: "继承a标签的属性",
                    dataType: "any",
                    default: "-",
                },
            ];
        },
    },
};
</script>
