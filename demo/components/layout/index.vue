<style lang="scss">
.demo-layout-wrapper {
    margin-bottom: 20px;
    height: 300px;
}
</style>

<template>
    <Demo :config="getConfig" @on-formData="postMessage" isAll>
        <template slot="header">
            <h2>代码示例 (Layout 布局)</h2>
            <h4 class="padding-top-10">
                协助进行页面级整体布局;更加不同组合可以呈现十几种的布局，你可以随意组合
                <div class="padding-top-10">
                    <div>组件概述</div>
                    <div>
                        Layout：布局容器，可以放在任何父容器中。
                    </div>
                    <div>Header：顶部布局，只能放在 Layout 中。</div>
                    <div>Sider：侧边栏，只能放在 Layout 中。</div>
                    <div>Content：只能放在 Layout 中。</div>
                    <div>Footer：只能放在 Layout 中。</div>
                </div>
            </h4>
        </template>
        <template>
            <iframe
                v-for="index in 3"
                :key="index"
                :id="'demoLayoutIframe' + index"
                class="demo-layout-wrapper"
                width="100%"
                frameborder="0"
                marginwidth="0"
                marginheight="0"
                vspace="0"
                hspace="0"
                allowtransparency="true"
                scrolling="auto"
                allowfullscreen="allowfullscreen"
                :src="'#/layout/index' + index"
                @scroll.stop
                @load="postMessage()"
            >
            </iframe>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {}
    },
    methods: {
        postMessage(val) {
            val = val || this._preData
            this._preData = val
            this.$nextTick(() => {
                for (let index = 1; index <= 3; index++) {
                    const iframe = this.$el.querySelector("#demoLayoutIframe" + index)
                    iframe && iframe.contentWindow.postMessage(val, "*")
                }
            })
        },
    },
    computed: {
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "定位头",
                    key: "Header:fixed",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "定位导航头",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "左侧边栏定位",
                    key: "Aside:fixed",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "定位左侧边栏",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "右侧边栏",
                    key: "Aside:right",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否右侧边栏",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "定位右侧边栏",
                    key: "AsideRight:fixed",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "定位右侧边栏",
                    dataType: "Boolean",
                    default: false,
                },

                {
                    showConfig: true,
                    label: "定位底部",
                    key: "Footer:fixed",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "定位底部",
                    dataType: "Boolean",
                    default: false,
                },

                {
                    showConfig: true,
                    label: "导航头高",
                    key: "Header:height",
                    tag: "vInputNumber",
                    demoDefault: 60,
                    explain: "导航头高",
                    dataType: "Number",
                    default: 60,
                },
                {
                    showConfig: true,
                    label: "底部页高",
                    key: "Footer:height",
                    tag: "vInputNumber",
                    demoDefault: 60,
                    explain: "底部页高",
                    dataType: "Number",
                    default: 60,
                },
                {
                    showConfig: true,
                    label: "侧边栏宽",
                    key: "Aside:width",
                    tag: "vInputNumber",
                    demoDefault: 200,
                    explain: "侧边栏宽",
                    dataType: "Number",
                    default: 200,
                },
                {
                    showConfig: true,
                    label: "触发断点",
                    key: "Aside:breakpoint",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "触发响应式布局的断点，可选值为xs,sm,md,lg,xl或xxl，若不设此属性则不会触发响应式布局。",
                    dataType: "String",
                    default: "",
                    options: this.getBearkpoints,
                },
                {
                    showConfig: true,
                    label: "侧边栏收起",
                    key: "Aside:visible",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "侧边栏是否收起，可使用 v-model 双向绑定数据。",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "收缩宽度",
                    key: "Aside:collapsedWidth",
                    tag: "vInputNumber",
                    demoDefault: 64,
                    explain: "收缩宽度",
                    dataType: "Number",
                    default: 64,
                },
                {
                    label: "收缩事件",
                    key: "Aside:on-change/update:visible",
                    tag: "-",
                    demoDefault: "-",
                    explain: "收缩事件",
                    dataType: "Function:Event",
                    default: "boolean",
                },
                {
                    label: "Content",
                    key: "Content:slot",
                    tag: "-",
                    demoDefault: "-",
                    explain: "主容区域",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "Footer",
                    key: "Footer:slot",
                    tag: "-",
                    demoDefault: "-",
                    explain: "底部内容区域",
                    dataType: "VNode",
                    default: "-",
                },

                {
                    label: "Header",
                    key: "Header:slot",
                    tag: "-",
                    demoDefault: "-",
                    explain: "头内容区域",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "Aside",
                    key: "Aside:slot",
                    tag: "-",
                    demoDefault: "-",
                    explain: "侧边栏内容区域",
                    dataType: "VNode",
                    default: "-",
                },
            ]
        },
        // getCode() {
        //     return `<vLayout>
        //                 <vHeader fixed>
        //                     Header
        //                 </vHeader>
        //                 <vLayout>
        //                     <vAside>
        //                         Slider
        //                     </vAside>
        //                     <vContent>
        //                         Content
        //                     </vContent>
        //                     <vAside right>
        //                         Slider
        //                     </vAside>
        //                 </vLayout>
        //                 <vFooter>
        //                     vFooter
        //                 </vFooter>
        //             </vLayout>`
        // },
    },
}
</script>
