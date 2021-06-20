<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (LoadingBar 加载进度条)</h2>
            <h4 class="padding-top-10">全局创建一个显示页面加载、异步请求、文件上传等的加载进度条。</h4>
        </template>
        <template v-slot="config">
            <vButton @click="vLoadingBar('config', config)">config</vButton>
            <vButton @click="vLoadingBar('start', config)">start</vButton>
            <vButton @click="vLoadingBar('update', config)">update</vButton>
            <vButton @click="vLoadingBar('finish', config)">finish</vButton>
            <vButton @click="vLoadingBar('error', config)">error</vButton>
            <vButton @click="vLoadingBar('destroy', config)">destroy</vButton>
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
            return `this.$Loading.config({
						color: '#5cb85c',
						failedColor: '#f0ad4e',
						height: 5
					});`;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "失败颜色",
                    key: "failColor",
                    tag: "vColorPicker",
                    explain: "进度条的失败颜色",
                    dataType: "String",
                    demoDefault: "",
                    default: "-",
                },
                {
                    showConfig: true,
                    label: "默认颜色",
                    key: "color",
                    tag: "vColorPicker",
                    explain: "进度条的默认颜色",
                    dataType: "String",
                    demoDefault: "",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "进度条高度",
                    key: "height",
                    explain: "进度条高度",
                    dataType: "String| Number",
                    tag: "vInputNumber",
                    demoDefault: 3,
                    default: 3,
                },
                {
                    key: "config|start|update|finish|destroy",
                    explain: "通过直接调用以下方法来使用组件",
                    dataType: "Function:options",
                    default: "",
                },
            ];
        },
    },
    methods: {
        vLoadingBar(type, formData) {
            this.$VLoadingBar[type](formData);
        },
    },
};
</script>
