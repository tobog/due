<style lang="scss" scoped>
.demo-resize {
    height: 300px;
    width: 300px;
    background-color: #000;
    text-align: center;
    left: 100px;
    border: 1px solid #999;
    word-break: break-all;
    line-height: 1.5;
    color: #fff;
    .demo-data {
        color: #fff;
        height: 100%;
        overflow: auto;
    }
}
</style>
<template>
    <Demo :config="getConfig" :code="getCode" isAll>
        <template slot="header">
            <h2>代码示例 (Dragresize 拖动和编辑尺寸)</h2>
        </template>
        <template v-slot="config">
            <pre class="text-left">{{ dataJson(value) }}</pre>
            <vDragresize class="demo-resize" v-bind="config" @on-resize="(data) => (value = data)" @on-move="(data) => (value = data)">
                <div class="demo-data">
                    相关参数:
                    <pre class="text-left">{{ dataJson(value) }}</pre>
                </div>
            </vDragresize>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value: "",
        }
    },
    methods: {
        dataJson(val) {
            return JSON.stringify(val, null, 4)
        },
    },
    computed: {
        getCode() {
            return `<Dragresize class="demo-resize" v-bind="config" @on-move="(data) => (value = data)">
                        <div class="demo-data">
                            相关参数:
                            <pre class="text-left">{{ dataJson(value) }}</pre>
                        </div>
                    </Dragresize>
                    `
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
                    showConfig: true,
                    label: "是否hover",
                    key: "hover",
                    demoDefault: false,
                    explain: "是否hover,仅在resizable=true有效",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "是否可拖动",
                    key: "draggable",
                    demoDefault: true,
                    explain: "是否可拖动",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "是否可编辑宽高",
                    key: "resizable",
                    demoDefault: false,
                    explain: "是否可编辑宽高",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "启用css3",
                    key: "useCSSTransforms",
                    demoDefault: false,
                    explain: "是否启用css3",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "编辑宽高类型",
                    key: "type",
                    demoDefault: "bottom-right",
                    explain: "编辑宽高类型，仅在resizable=true有效",
                    dataType: "String, Array",
                    tag: "vSelect",
                    default: "bottom-right",
                    options: [
                        "all",
                        "top",
                        "bottom",
                        "right",
                        "left",
                        "top-left",
                        "top-right",
                        "bottom-left",
                        "bottom-right",
                    ],
                },
                {
                    label: "自定义样式",
                    key: "customStyle",
                    explain: "结合事件自定义样式",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    label: "最大宽高",
                    key: "max",
                    explain: "最大宽高，如：300 或者 [100, 100]，仅在resizable=true有效",
                    dataType: "Number, Array",
                    default: "",
                },
                {
                    label: "最小宽高",
                    key: "min",
                    explain: "最小宽高，如：300 或者 [100, 100]，仅在resizable=true有效",
                    dataType: "Number, Array",
                    default: "",
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
                    label: "事件",
                    key: "on-resize",
                    explain: "框变化时触发",
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
            ]
        },
    },
}
</script>
