<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Loading 加载中)</h2>
            <h4 class="padding-top-10">当区块正在获取数据中时可使用，适当的等待动画可以提升用户体验。</h4>
        </template>
        <template v-slot="config">
            <vLoading v-bind="formData" style="border:1px solid #ccc">
                <div slot="label">title</div>
            </vLoading>
            <vButton @click="handleLoading('show', config)">show</vButton>
            <vButton @click="handleLoading('init', config)">init</vButton>
            <vButton @click="handleLoading('destroy', config)">destroy</vButton>
            <vButton @click="handleLoading('hide', config)">hide</vButton>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            val: "",
        };
    },
    computed: {
        getCode() {
            return ``;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "是否固定",
                    key: "fix",
                    explain: "是否固定，需要父级有relative或absolute",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    demoDefault: false,
                    default: false,
                },
                {
                    showConfig: true,
                    label: "全局覆盖:全屏",
                    key: "fullscreen",
                    explain: "位于body下全局覆盖，是否可以全屏",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    demoDefault: false,
                    default: false,
                },
                {
                    showConfig: true,
                    label: "初始化显示",
                    key: "loading",
                    explain: "是否初始化显示loading",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    demoDefault: false,
                    default: false,
                },
                {
                    showConfig: true,
                    label: "可关闭",
                    key: "closable",
                    explain: "是否可关闭",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    demoDefault: true,
                    default: true,
                },
                {
                    showConfig: true,
                    label: "锁定屏幕的滚动",
                    key: "lock",
                    explain: "是否锁定屏幕的滚动",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    demoDefault: true,
                    default: true,
                },
                {
                    showConfig: true,
                    label: "覆盖的 DOM 节点",
                    key: "target",
                    explain: "Loading 需要覆盖的 DOM 节点",
                    dataType: "String|Element",
                    tag: "vInput",
                    demoDefault: "",
                    default: "",
                },
                {
                    // showConfig: true,
                    label: "延迟时间",
                    key: "delay",
                    explain: "延迟显示时间",
                    dataType: "Number",
                    tag: "vInputNumber",
                    demoDefault: "",
                    default: "",
                },
                {
                    label: "自定义文本",
                    key: "text",
                    explain: "自定义文本内容",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "自定义文本",
                    key: "$slot:text",
                    explain: "自定义渲染文本内容",
                    dataType: "VNode",
                    default: "",
                },
                {
                    label: "自定义loading",
                    key: "$slot:default",
                    explain: "自定义渲染loading",
                    dataType: "VNode",
                    default: "",
                },
                {
                    label: "事件",
                    key: "on-close",
                    explain: "关闭事件",
                    dataType: "Function:Event",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "config|init|hide|show|destroy|get",
                    explain: "通过this.$Loading：js直接调用以下方法来使用组件,提供name处理特定loading",
                    dataType: "Function:options=》Instances.name默认vue._uid",
                    default: "-",
                },
            ];
        },
    },
    methods: {
        handleLoading(type, config) {
            this.$VLoading[type](config);
        },
    },
};
</script>
