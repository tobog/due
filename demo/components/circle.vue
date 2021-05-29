<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (CircleCard 进度环)</h2>
            <h4 class="padding-top-10">
                图表类组件。一般有两种用途：1.显示某项任务进度的百分比；2.统计某些指标的占比。
            </h4>
        </template>
        <template v-slot="config">
            <vCircleCard class="margin-10" v-bind="config">{{ config.percent }}%</vCircleCard>
            <vCircleCard class="margin-10" v-bind="config"></vCircleCard>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            val: 0,
            val2: [],
            val1: "",
        };
    },
    methods: {},
    computed: {
        getCode() {
            return `<vCircleCard class="margin-10" v bind="config">{{ config.percent }}%</vCircleCard>
                    <vCircleCard class="margin-10" v-bind="config"></vCircleCard>`;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "仪表盘",
                    key: "dashboard",
                    demoDefault: false,
                    explain: "是否仪表盘",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "百分比",
                    key: "percent",
                    demoDefault: 30,
                    explain: "百分比",
                    dataType: "Number",
                    tag: "vInputNumber",
                    default: 0,
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: 120,
                    explain: "设置大小，可选值为：small,normal(default),medium,large,或者设置具体数值",
                    dataType: "String | Number",
                    default: 120,
                    options: this.getSize,
                },
                {
                    showConfig: true,
                    label: "主题状态",
                    key: "status",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "主题状态",
                    dataType: "String",
                    default: "",
                    options: ["success", "warning", "error"],
                },
                {
                    showConfig: true,
                    label: "进度环线宽",
                    key: "strokeWidth",
                    demoDefault: 6,
                    explain: "进度环线宽",
                    dataType: "Number",
                    tag: "vInputNumber",
                    default: 6,
                },
                {
                    showConfig: true,
                    label: "进度环颜色",
                    key: "strokeColor",
                    demoDefault: "",
                    explain: "进度环颜色，当为数组是时[{percent:30,color:red}] 显示不同颜色",
                    dataType: "String | Array",
                    tag: "vColorPicker",
                    default: "#2db7f5",
                },
                {
                    showConfig: true,
                    label: "轨道颜色",
                    key: "trackColor",
                    demoDefault: "",
                    explain: "轨道颜色",
                    dataType: "String",
                    tag: "vColorPicker",
                    default: "#eaeef2",
                },
                {
                    showConfig: true,
                    label: "轨道线宽",
                    key: "trackWidth",
                    demoDefault: 5,
                    explain: "轨道线宽",
                    dataType: "Number",
                    tag: "vInputNumber",
                    default: 5,
                },
                {
                    showConfig: true,
                    label: "环顶端的形状",
                    key: "strokeLinecap",
                    demoDefault: "round",
                    explain: "环顶端的形状",
                    dataType: "String",
                    tag: "vSelect",
                    default: "round",
                    options: ["square", "round", "butt", "inherit"],
                },

                {
                    label: "表单名称",
                    key: "name",
                    explain: "form 表单名称",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "自定义显示中间内容",
                    key: "slot:default",
                    explain: "自定义显示中间内容",
                    dataType: "VNode",
                    default: "-",
                },
            ];
        },
    },
};
</script>
