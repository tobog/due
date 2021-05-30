<style lang="scss" scoped>
.demo-resize {
    height: 300px;
    width: 300px;
    background-color: #ccc;
    text-align: center;
    left: 100px;
    border: 1px solid #999;
    word-break: break-all;
    line-height: 1.5;
    .demo-data {
        height: 100%;
        overflow: auto;
    }
}
</style>
<template>
    <Demo :config="getConfig" :code="getCode" isAll>
        <template slot="header">
            <h2>代码示例 (Dragmove 拖动)</h2>
        </template>
        <template v-slot="config">
            <pre class="text-left">{{ dataJson(value) }}</pre>
            <vDragmove class="demo-resize" v-bind="config" @on-move="(data) => (value = data)">
                <div class="demo-data">
                    请移动-相关参数:
                    <pre class="text-left">{{ dataJson(value) }}</pre>
                </div>
            </vDragmove>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value: "",
        };
    },
    methods: {
        dataJson(val) {
            return JSON.stringify(val, null, 4);
        },
    },
    computed: {
        getCode() {
            return `<Dragmove class="demo-resize" v-bind="config" @on-move="(data) => (value = data)">
                        <div class="demo-data">
                            请移动-相关参数:
                            <pre class="text-left">{{ dataJson(value) }}</pre>
                        </div>
                    </Dragmove>
                    `;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "禁用拖动",
                    key: "disabled",
                    demoDefault: false,
                    explain: "禁用拖动",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "边界限制",
                    key: "boundaryPoint",
                    explain: "边界限制，无法超出{left:0,right:10,top:0.bottom:10}",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "边界元素",
                    key: "boundaryElement",
                    explain: "边界元素",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "其他配置",
                    key: "options",
                    explain: "其他配置",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "自定义控制",
                    key: "setStyle",
                    explain: "自定义控制样式",
                    dataType: "Function",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-move",
                    explain: "移动时触发",
                    dataType: "Function：Event",
                    default: "(isclickout,e)=>{}",
                },
                {
                    label: "内容",
                    key: "slot",
                    explain: "内容",
                    dataType: "VNode",
                    default: "-",
                },
            ];
        },
    },
};
</script>
