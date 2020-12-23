<style lang="scss">
.demo-card {
    background: url(https://ej2.syncfusion.com/vue/demos/dist/vertical_img.png?9a97a89e546a825747304b53d9ad0f79)
        no-repeat;
    background-size: cover;
    height: 300px;
    color: #000;
}
.demo-card-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode" isAll>
        <template slot="header">
            <h2>代码示例 (Card 卡片)</h2>
            <h4 class="padding-top-10">基础容器，用来显示文字、列表、图文等内容，也可以配合其它组件一起使用。</h4>
        </template>
        <template v-slot="config">
            <div class="demo-card-wrapper">
                <vCard v-bind="config" class="demo-card">
                    <div>
                        Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                        analytics—anything
                    </div>
                </vCard>
                <vCard v-bind="config" type="tile" style="width:200px;">
                    <div slot="extra">
                        <img src="https://ej2.syncfusion.com/vue/demos/src/card/images/Tile_10.png" alt />
                    </div>
                    <header slot="title" class="text-center">JavaScript</header>
                    <div>
                        Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                        analytics—anything
                    </div>
                </vCard>
                <vCard v-bind="config" type="tile" style="width:200px;">
                    <div slot="extra">
                        <img src="https://ej2.syncfusion.com/vue/demos/src/card/images/Tile_6.png" alt />
                    </div>
                    <header slot="title" class="text-center">JavaScript</header>
                    <div>
                        Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                        analytics—anything
                    </div>
                </vCard>
                <vCard v-bind="config" class="demo-card" type="flip">
                    <header slot="title" class="text-center">
                        Mayumi Ohno
                        <p>Marketing Representative</p>
                    </header>
                    <div>
                        Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                        analytics—anything
                    </div>
                    <p slot="extra">Content of card</p>
                </vCard>
                <vCard v-bind="config" type="horizontal">
                    <header slot="title" class="text-center">
                        iPhone X
                        <p>Marketing Representative</p>
                    </header>
                    <div>
                        Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                        analytics—anything
                    </div>
                    <img
                        width="100%"
                        slot="extra"
                        src="https://ej2.syncfusion.com/vue/demos/dist/Trimmer.png?20363bb2165af3b8e182b8e91ab93e1d"
                        alt
                    />
                </vCard>
            </div>
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
            return `<Card v-bind=CODE class="demo-card">
                        <div>
                            Tech evangelists are currently pounding their pulpits about all things AI, machine learning,
                            analytics—anything
                        </div>
                    </Card>
            `
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "显示边框",
                    key: "border",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "是否显示边框，建议在灰色背景下使用",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "卡片阴影",
                    key: "shadow",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "卡片阴影，建议在灰色背景下使用",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "头部分割线",
                    key: "divider",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "头部分割线",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "反向布局",
                    key: "reverse",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "反向布局",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "卡片内部间距",
                    key: "padding",
                    tag: "vInputNumber",
                    demoDefault: 16,
                    explain: "反向布局",
                    dataType: "Number",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "标题",
                    key: "title",
                    tag: "vInput",
                    demoDefault: "标题",
                    explain: "标题",
                    dataType: "Number",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "标题前的图标",
                    key: "icon",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "标题前的图标",
                    dataType: "String",
                    default: "",
                    options: this.iconslist,
                },

                {
                    label: "卡片类型",
                    key: "type",
                    explain: "卡片类型：flip,tile,horizontal",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "继承属性",
                    key: "$attrs",
                    explain: "继承属性：tag to href 等...",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "继承事件",
                    key: "$listeners",
                    explain: "继承事件",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "自定义卡片标题",
                    key: "slot:title",
                    explain: "自定义卡片标题",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "额外显示的内容",
                    key: "slot:extra",
                    explain: "额外显示的内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "主体内容",
                    key: "slot",
                    explain: "卡片主体内容",
                    dataType: "VNode",
                    default: "-",
                },
            ]
        },
    },
}
</script>
