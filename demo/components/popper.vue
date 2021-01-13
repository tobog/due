<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Popper 组件)</h2>
            <h4 class="padding-top-10">提供下拉,提示框，用于定位元素</h4>
        </template>
        <template v-slot="config">
            <vButton @hook:created="ready += 1" @click="value = !value" ref="btn">Popper</vButton>
            <vPopper v-show="value" :reference="ready && ($refs.btn || {}).$el" v-bind="config" style="height:100px;">
                <div style="width:100px;">111111</div>
                <div>2222</div>
            </vPopper>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value: false,
            ready: 1,
        }
    },
    methods: {},
    computed: {
        getCode() {
            return `<Button @click="value=!value" ref="btn">Button</Button>
                    <Popper
                        v-show="value"
						:reference="($refs.btn||{}).$el"
						v-bind=CODE
						style="height:100px;overflow:auto;line-height:2">
						<div style="width:100px;">111111</div>
						<div>2222</div>
					</Popper>
						`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "放置body下",
                    key: "transfer",
                    demoDefault: false,
                    explain: "是否放置body下",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "开启css3",
                    key: "gpu",
                    demoDefault: false,
                    explain: "开启css3样式更新",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "显示箭头",
                    key: "showArrow",
                    demoDefault: void 0,
                    explain: "是否显示箭头",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: void 0,
                },
                {
                    showConfig: true,
                    label: "响应式定位",
                    key: "responsive",
                    demoDefault: void 0,
                    explain: "是否响应式定位",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: void 0,
                },
                {
                    showConfig: true,
                    label: "一直显示",
                    key: "always",
                    demoDefault: false,
                    explain: "是否一直显示",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "动画名称",
                    key: "transitionName",
                    demoDefault: "",
                    explain: "动画名称，type===drop时默认transition-drop，其他默认fade",
                    dataType: "String",
                    tag: "vInput",
                    default: "transition-drop|fade",
                },
                {
                    showConfig: true,
                    label: "显示位置",
                    key: "placement",
                    demoDefault: "",
                    explain:
                        "显示位置,可选值：top,top-left,top-center,top-right,top-fix,bottom,bottom-left,bottom-center,bottom-right,bottom-fix,right,right-top,right-center,right-bottom,left,left-top,left-center,left-bottom,fix-left,fix-center,fix-right",
                    dataType: "String",
                    tag: "vSelect",
                    default: "",
                    options: [
                        "top",
                        "top-left",
                        "top-center",
                        "top-right",
                        "top-fix",
                        "bottom",
                        "bottom-left",
                        "bottom-center",
                        "bottom-right",
                        "bottom-fix",
                        "right",
                        "right-top",
                        "right-center",
                        "right-bottom",
                        "left",
                        "left-top",
                        "left-center",
                        "left-bottom",
                        "fix-left",
                        "fix-center",
                        "fix-right",
                    ],
                },
                {
                    showConfig: true,
                    label: "内容",
                    key: "content",
                    demoDefault: undefined,
                    explain: "主体内容",
                    dataType: "String",
                    tag: "vInput",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "延迟更新",
                    key: "delay",
                    demoDefault: 0,
                    explain: "延迟更新样式",
                    dataType: "Number",
                    tag: "vInputNumber",
                    default: 0,
                },
                {
                    showConfig: true,
                    label: "触发方式",
                    key: "trigger",
                    demoDefault: "",
                    explain: "触发方式，可选值：click,hover,other, type===drop时默认other，其他默认click",
                    dataType: "String",
                    tag: "vSelect",
                    default: "",
                    options: ["click", "hover", "other"],
                },
                {
                    label: "相对索引Element",
                    key: "reference",
                    explain: "相对索引Element,确保存在",
                    dataType: "String, HTMLElement",
                    default: "-",
                },
                {
                    label: "继承transition事件",
                    key: "$listeners",
                    explain: "继承transition事件",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-visible-change",
                    explain: "显示消失时触发",
                    dataType: "Function:event",
                    default: "-",
                },
            ]
        },
    },
}
</script>
