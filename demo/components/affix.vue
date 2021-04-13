<style lang="scss">
.demo-affix {
    padding: 15px;
    border: 1px solid #2d8cf0;
    background-color: #2d8cf0;
    color: #fff;
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例(Affix 图钉)</h2>
            <h4>
                使用图钉，可以将内容固定在屏幕上，并且不随页面的滚动而滚动。
                仅
            </h4>
        </template>
        <template v-slot="config">
            <vAffix v-bind="config">
                <div class="demo-affix">Affix Demo</div>
            </vAffix>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {}
    },
    computed: {
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "距离顶部",
                    key: "offsetTop",
                    tag: "vInputNumber",
                    demoDefault: 10,
                    explain: "距离窗口顶部达到指定偏移量后触发",
                    dataType: "Number",
                    default: "-",
                },
                {
                    showConfig: true,
                    label: "距离底部",
                    key: "offsetBottom",
                    tag: "vInputNumber",
                    demoDefault: 70,
                    explain: "距离窗口底部达到指定偏移量后触发",
                    dataType: "Number",
                    default: "-",
                },
                {
                    showConfig: true,
                    label: "层级",
                    key: "zIndex",
                    tag: "vInputNumber",
                    demoDefault: 100,
                    explain: "fixed 定位的图层级别",
                    dataType: "Number",
                    default: 100,
                },
                {
                    label: "自定义监听器",
                    key: "listener",
                    explain: "自定义监听器，有滚动的元素, 仅支持监听器是100vh,100vw的尺寸",
                    dataType: "String, HTMLElement",
                    default: 'window',
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "在固定状态发生改变时触发",
                    dataType: "Function:Event",
                    default: "false|top|bottom",
                },
            ]
        },
        getCode() {
            return `<vAffix v-bind=CODE>
                        <div class="demo-affix">Affix Demo</div>
                    </vAffix>`
        },
    },
}
</script>
