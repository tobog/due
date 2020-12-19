<style lang="scss" scoped></style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Switch 开关)</h2>
            <h4 class="padding-top-10">在两种状态间切换时用到的开关选择器。</h4>
        </vCol>
        <vCol lg="14" span="24" class="demo-form">
            <Formedit :formdata="getBase" v-model="formData"></Formedit>
        </vCol>
        <vCol lg="10" span="24" class="demo-view">
            <vSwitch v-model="show" class="margin-bottom-10">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </vSwitch>
            <section v-if="show">
                <vSwitch v-bind="formData" v-model="val">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </vSwitch>
                <vSwitch v-model="val" v-bind="formData" :before-change="handlebefore">
                    <vIcon type="checkmark" slot="open"></vIcon>
                    <vIcon type="close" slot="close"></vIcon>
                </vSwitch>
                <vSwitch v-model="val" loading v-bind="formData">
                    <vIcon type="checkmark" slot="open"></vIcon>
                    <vIcon type="close" slot="close"></vIcon>
                </vSwitch>
                {{ val }}
            </section>
        </vCol>
        <vCol span="24" class="demo-code">
            <pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
        </vCol>
        <vCol span="24" class="demo-props">
            <h2 class="demo-header">Props & Events</h2>
            <vTable :columns="getTableColumns" :data="compProps" class="demo-table" border stripe></vTable>
        </vCol>
    </vRow>
</template>

<script>
export default {
    // ${this.getCodeString(this.formData)}
    data() {
        return {
            val: false,
        };
    },
    methods: {
        handlebefore() {
            return new Promise((resolve, reject) => {
                this.$VModal.info(
                    {
                        content: "异步控制按钮",
                        title: "异步控制按钮",
                    },
                    {
                        "on-confirm": () => {
                            resolve();
                        },
                    }
                );
            });
        },
    },
    computed: {
        getCode() {
            return `<vSwitch v-bind="${this.getCodeString(this.formData)}" v-model="val">
							<span slot="open">开</span>
							<span slot="close">关</span>
						</vSwitch>
						<vSwitch v-model="val" v-bind="${this.getCodeString(this.formData)}">
							<vIcon type="checkmark" slot="open"></vIcon>
							<vIcon type="close" slot="close"></vIcon>
						</vSwitch>
						<vSwitch v-model="val" loading v-bind="${this.getCodeString(this.formData)}">
							<vIcon type="checkmark" slot="open"></vIcon>
							<vIcon type="close" slot="close"></vIcon>
						</vSwitch>`;
        },
        getBase() {
            return [
                {
                    label: "禁用",
                    key: "disabled",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "只读",
                    key: "readonly",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "严格相等",
                    key: "strict",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "加载中",
                    key: "loading",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "打开状态",
                    key: "trueValue",
                    tag: "vInput",
                    default: true,
                },
                {
                    label: "关闭状态",
                    key: "falseValue",
                    tag: "vInput",
                    default: false,
                },

                {
                    label: "尺寸",
                    key: "size",
                    tag: "vInputNumber",
                    default: "",
                },
                {
                    label: "关闭的背景色",
                    key: "falseColor",
                    tag: "vInput",
                    default: "",
                    props: {
                        type: "color",
                    },
                },
                {
                    label: "打开的背景色",
                    key: "trueColor",
                    tag: "vInput",
                    default: "",
                    props: {
                        type: "color",
                    },
                },

                {
                    label: "主题",
                    key: "theme",
                    tag: "vSelect",
                    default: "",
                    options: this.getThemes,
                },
            ];
        },
        compProps() {
            return [
                {
                    prop: "name",
                    explain: "input的name,用于隐藏域",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "value",
                    explain: "指定当前是否选中，可以使用 v-model 双向绑定数据",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "disabled",
                    explain: "禁用开关",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "readonly",
                    explain: "只读",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "loading",
                    explain: "加载中的开关",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "trueValue",
                    explain: "指定选中时的值",
                    type: "Any",
                    default: "true",
                },
                {
                    prop: "falseValue",
                    explain: "指定没有选中时的值",
                    type: "Any",
                    default: "false",
                },
                {
                    prop: "trueColor",
                    explain: "指定选中时的背景色",
                    type: "Any",
                    default: "true",
                },
                {
                    prop: "falseColor",
                    explain: "指定没有选中时的背景色",
                    type: "Any",
                    default: "false",
                },
                {
                    prop: "strict",
                    explain: "严格模式",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "size",
                    explain: "单选框的尺寸，large、small、default，number,auto",
                    type: "String, Number",
                    default: "default",
                },
                {
                    explain: "主题颜色可选值为 gray、primary、dashed、text、info、success、warning、error",
                    prop: "theme",
                    type: "String",
                    default: "",
                },
                {
                    prop: "slot:open",
                    explain: "指定选中时文本",
                    type: "VNODE:slot",
                    default: "-",
                },
                {
                    prop: "slot:close",
                    explain: "指定没有选中时文本",
                    type: "VNODE:slot",
                    default: "-",
                },
                {
                    prop: "on-change",
                    explain: "开关变化时触发，返回当前的状态",
                    type: "Function:Event",
                    default: "-",
                },
                {
                    prop: "beforeChange",
                    explain: "返回 Promise 可以阻止切换",
                    type: "Function:val=>{}",
                    default: "-",
                },
            ];
        },
    },
};
</script>
