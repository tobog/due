<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Breadcrumb 面包屑)</h2>
            <h4 class="padding-top-10">显示网站的层级结构，告知用户当前所在位置，以及在需要向上级导航时使用。</h4>
        </template>
        <template v-slot="config">
            <vBread v-bind="config['Bread']">
                <vBreadItem v-bind="config['BreadItem']" href="/">
                    <vIcon type="ios-home-outline"></vIcon>
                </vBreadItem>
                <vBreadItem v-bind="config['BreadItem']" href="/"> <vIcon type="ios-home-outline"></vIcon>Home </vBreadItem>
                <vBreadItem v-bind="config['BreadItem']" to="/bread"> <vIcon type="social-buffer-outline"></vIcon>Components </vBreadItem>
                <vBreadItem v-bind="config['BreadItem']"> <vIcon type="pound"></vIcon>vBread </vBreadItem>
            </vBread>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        getCode() {
            return `<Bread>
                        <BreadItem href='/'>
                            <vIcon type='ios-home-outline'></vIcon>Home
                        </BreadItem>
                        <BreadItem to='/bread'>
                            <vIcon type='social-buffer-outline'></vIcon>Components
                        </BreadItem>
                        <BreadItem>
                            <vIcon type='pound'></vIcon>Bread
                        </BreadItem>
                    </Bread>`
        },
        getConfig() {
            return {
                Bread: {
                    data: [
                        {
                            showConfig: true,
                            label: "分隔符",
                            key: "sep",
                            tag: "vInput",
                            demoDefault: "/",
                            explain: "separator:自定义分隔符分隔符",
                            dataType: "String",
                            default: "",
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
                            label: "子元素",
                            key: "slot:default",
                            explain: "子元素：BreadItem",
                            dataType: "VNode",
                            default: "-",
                        },
                    ],
                },
                BreadItem: {
                    data: [
                        {
                            showConfig: true,
                            label: "分隔符",
                            key: "sep",
                            tag: "vInput",
                            demoDefault: "/",
                            explain: "separator:自定义分隔符分隔符",
                            dataType: "String",
                            default: "",
                        },
                        {
                            showConfig: true,
                            label: "链接",
                            key: "to",
                            tag: "vInput",
                            demoDefault: "",
                            explain: "链接，不传则没有链接，支持 vue-router 对象",
                            dataType: "String",
                            default: "",
                        },
                        {
                            showConfig: true,
                            label: "链接",
                            key: "href",
                            tag: "vInput",
                            demoDefault: "",
                            explain: "链接",
                            dataType: "String",
                            default: "",
                        },
                        {
                            label: "tag",
                            key: "tag",
                            explain: "to:router-link,href:a",
                            dataType: "String",
                            default: "-",
                        },
                        {
                            label: "继承属性",
                            key: "$attrs",
                            explain: "继承属性，target,tag...",
                            dataType: "Object",
                            default: "-",
                        },
                        {
                            label: "显示内容",
                            key: "slot:default",
                            explain: "显示内容",
                            dataType: "VNode",
                            default: "-",
                        },
                        {
                            label: "分隔符",
                            key: "slot:sep",
                            explain: "分隔符",
                            dataType: "VNode",
                            default: "-",
                        },
                    ],
                },
            }
        },
    },
}
</script>
