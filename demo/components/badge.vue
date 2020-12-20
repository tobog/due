<style lang="scss">
.demo-badge {
    width: 42px;
    height: 42px;
    background: #eee;
    border-radius: 6px;
    display: inline-block;
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Badge 徽标数)</h2>
            <h4 class="padding-top-10">主要用于通知未读数的角标，提醒用户点击。</h4>
        </template>
        <template v-slot="config">
            <vBadge v-bind="config">
                <span slot="label">label</span>
            </vBadge>
            <vBadge v-bind="config">
                <a href="#" class="demo-badge"></a>
            </vBadge>
            <vBadge v-bind="config">
                demo-badge
            </vBadge>
            <vBadge v-bind="config"> </vBadge>
            <vBadge v-bind="config"> </vBadge>
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
            return `<vBadge v-bind=CODE>
						<a href="#" class="demo-badge"></a>
					</vBadge>`;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "展示label",
                    key: "showLabel",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "控制label 显示",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "动画",
                    key: "progress",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "动画",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "显示的标签",
                    key: "label",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "显示的标签",
                    dataType: "Number, String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "自定义颜色",
                    key: "color",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "自定义颜色",
                    dataType: "String",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "封顶的标签",
                    key: "overLabel",
                    tag: "vInputNumber",
                    demoDefault: "99",
                    explain: "封顶的标签",
                    dataType: "Number",
                    default: "99",
                },
                {
                    label: "位置偏移",
                    key: "offset",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置状态点的位置偏移，格式为 [x, y]",
                    dataType: "Array",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "类型",
                    key: "type",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "使用预设的颜色，：success、primary、default、error、warning、info",
                    dataType: "String",
                    default: "",
                    options: this.getThemes,
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),midiue,large,或者设置具体数值",
                    dataType: "String | Number",
                    default: "",
                    options: this.getSize,
                },
                {
                    label: "控制label格式",
                    key: "format",
                    explain: "控制label格式",
                    dataType: "Function",
                    default: "(label, overLabel)=>string",
                },
                {
                    label: "显示内容",
                    key: "slot:default",
                    explain: "显示内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "显示内容label",
                    key: "slot:label",
                    explain: "显示内容label",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-error",
                    explain: "icon为外链接图片加载不成功时触发",
                    dataType: "Function:Event",
                    default: "error",
                },
            ];
        },
    },
};
</script>
