<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Circle 进度环)</h2>
            <h4 class="padding-top-10">
                图表类组件。一般有两种用途：1.显示某项任务进度的百分比；2.统计某些指标的占比。
            </h4>
        </template>
        <template v-slot="config">
            <vCircle v-model="val" v-bind="config">{{ config.percent }}%</vCircle>
            <vCircle v-model="val" v-bind="config">
                <vIcon type="ios-checkmark" size="60" style="color:#5cb85c"></vIcon>
            </vCircle>
            <vCircle v-bind="config" stroke-color="#ff5500">
                <vIcon type="ios-close" size="50" style="color:#ff5500"></vIcon>
            </vCircle>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            val: 30,
            val2: [],
            val1: "",
        };
    },
    methods: {},
    computed: {
        getCode() {
            return `<Circle v-bind=CODE></Circle>`;
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
                    default: "",
                },
                {
                    showConfig: true,
                    label: "宽高",
                    key: "size",
                    demoDefault: 120,
                    explain: "宽高",
                    dataType: "Number",
                    tag: "vInputNumber",
                    default: 120,
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
                    demoDefault: "#2db7f5",
                    explain: "进度环颜色",
                    dataType: "String",
                    tag: "vColorPicker",
                    default: "#2db7f5",
                },
                {
                    showConfig: true,
                    label: "进度环颜色",
                    key: "strokeColor",
                    demoDefault: "#eaeef2",
                    explain: "进度环颜色",
                    dataType: "String",
                    tag: "vColorPicker",
                    default: "#eaeef2",
                },
                {
                    showConfig: true,
                    label: "进度环线宽",
                    key: "trackWidth",
                    demoDefault: 5,
                    explain: "进度环线宽",
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

                // {
                //     showConfig: true,
                //     label: "尺寸大小",
                //     key: "size",
                //     tag: "vInput",
                //     demoDefault: 120,
                //     explain: "设置大小，可选值为：small,normal(default),midiue,large,或者设置具体数值",
                //     dataType: "String | Number",
                //     default: "",
                //     options: this.getSize,
                // },
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
