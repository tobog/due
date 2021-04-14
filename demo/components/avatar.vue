<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Avatar 头像)</h2>
            <h4 class="padding-top-10">用来代表用户或事物，支持图片、图标或字符展示。</h4>
        </template>
        <template v-slot="config">
            <vAvatar class="margin-right-10" v-bind="config" src="ios-person" />
            <vAvatar class="margin-right-10" v-bind="config">U</vAvatar>
            <vAvatar class="margin-right-10" v-bind="config">USER</vAvatar>
            <vAvatar class="margin-right-10" v-bind="config" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
            <vAvatar class="margin-right-10" v-bind="config" src="https://tem/d.png">
                <img slot="fallback" src="https://i.loli.net/2017/08/21/599a521472424.jpg" alt="" />
            </vAvatar>
            <vAvatar class="margin-right-10" v-bind="config" src="https://tem/d.png"></vAvatar>
            <vAvatar class="margin-right-10" v-bind="config" style="color: #f56a00;background-color: #fde3cf"
                >U</vAvatar
            >
            <vAvatar class="margin-right-10" v-bind="config" style="background-color: #87d068" src="ios-person" />
            <vAvatar class="margin-right-10" v-bind="config" />
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
            return `<Avatar v-bind=CODE icon="ios-person" />
                    <Avatar v-bind=CODE>U</Avatar>
                    <Avatar v-bind=CODE>USER</Avatar>
                    <Avatar v-bind=CODE icon="https://i.loli.net/2017/08/21/599a521472424.jpg" />
                    <Avatar v-bind=CODE style="color: #f56a00;background-color: #fde3cf">U</Avatar>
                    <Avatar v-bind=CODE style="background-color: #87d068" icon="ios-person" />
                    <Avatar v-bind=CODE />`;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "图标类型",
                    key: "src",
                    tag: "vSelect",
                    demoDefault: "ios-person",
                    explain: "设置头像的图标类型，参考 Icon 组件",
                    dataType: "String",
                    default: "",
                    options: this.iconslist,
                },
                {
                    showConfig: true,
                    label: "形状",
                    key: "shape",
                    tag: "vSelect",
                    demoDefault: "circle",
                    explain: "指定头像的形状，可选值为：square, circle, rounded",
                    dataType: "String",
                    default: "circle",
                    options: ["square", "circle", "rounded"],
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置头像的大小，可选值为：small,normal(default),medium,large,或者设置具体数值",
                    dataType: "String | Number",
                    default: "",
                    options: this.getSize,
                },
                {
                    showConfig: true,
                    label: "自定义回退头像",
                    key: "fallback",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "icon为外链接图片加载不成功时回退头像",
                    dataType: "String",
                    default: "",
                    options: this.iconslist,
                },
                {
                    label: "自定义头像",
                    key: "slot:default",
                    explain: "自定义头像",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "自定义回退头像",
                    key: "slot:fallback",
                    explain: "icon为外链接图片加载不成功时回退头像",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-error",
                    explain: "icon为外链接图片加载不成功时触发",
                    dataType: "Function:Event",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-success",
                    explain: "icon为外链接图片加载成功时触发",
                    dataType: "Function:Event",
                    default: "-",
                },
            ];
        },
    },
};
</script>
