<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Config 配置组件)</h2>
            <h4 class="padding-top-10">将用于组件的全局配，提供了一个$ConfigProvide数据</h4>
        </template>
        <template v-slot="config">
            <vConfig v-bind="config">
                <vButton>Demo</vButton>
            </vConfig>
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
            return `<vConfig v-bind="config">
                        <Button>Demo</Button>
                    </vConfig>
                    $ConfigProvide: {
                        theme,
                        size,
                        media,
                        mediaSize,
                        getMediaData,
                        compareMedia,
                        getBearkpoints,
                    }
                    `;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "主题颜色",
                    key: "theme",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "CheckBoxGroup,CheckBox主题颜色",
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
                    explain: "设置大小，可选值为：small,normal(default),medium,large,或者设置具体数值",
                    dataType: "String | Number",
                    default: "",
                    options: this.getSize,
                },
                {
                    showConfig: true,
                    label: "媒体大小",
                    key: "media",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "媒体大小",
                    dataType: "String",
                    default: "",
                    options: this.getBearkpoints,
                },
                 {
                    showConfig: true,
                    label: "自定义样式",
                    key: "styleCode",
                    tag: "vTextarea",
                    demoDefault: "",
                    explain: "用于自定义注入样式",
                    dataType: "String",
                    default: "",
                },
            ];
        },
    },
};
</script>
