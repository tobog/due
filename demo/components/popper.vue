<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Popper 下拉组件)</h2>
            <h4 class="padding-top-10">提供下拉Popper。需要手动控制显示和消失</h4>
        </template>
        <template v-slot="config">
            <vButton @click="value = !value" ref="btn">Popper</vButton>
            <vPopper
                v-show="value"
                :reference="($refs.btn || {}).$el"
                v-bind="config"
                style="height:100px;"
            >
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
        }
    },
    methods: {},
    computed: {
        getCode() {
            return `<Button @click="value=!value" ref="btn">Button</Button>
					<Popper
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
                    label: "动画名称",
                    key: "transitionName",
                    demoDefault: "transition-drop",
                    explain: "动画名称",
                    dataType: "String",
                    tag: "vInput",
                    default: "transition-drop",
                },
                {
                    label: "Drop组件配置",
                    key: "options",
                    explain: "Drop组件配置：默认来自$attrs",
                    dataType: "Array",
                    default: "",
                },
                {
                    label: "相对索引Element",
                    key: "reference",
                    dataType: "HTMLElement",
                    default: "-",
                },
                {
                    label: "继承事件",
                    key: "$listeners",
                    dataType: "Object",
                    default: "-",
                },
            ]
        },
    },
}
</script>
