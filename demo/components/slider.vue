<style lang="scss" scoped>
.demo-scroll {
    height: 200px;
    width: 33%;
    overflow: auto;
    float: left;
    border: 1px solid #ccc;
}
.demo-scroll > div {
    height: 300%;
    width: 300%;
}
</style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Slider 滑块)</h2>
            <h4 class="padding-top-10">滑动输入器，用于在数值区间/自定义区间内进行选择，支持连续或离散值。</h4>
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
                <vSlider
                    class="margin-bottom-50"
                    v-model="val"
                    :marks="marks"
                    v-bind="formData"
                ></vSlider>
                <vSlider
                    :marks="marks"
                    class="margin-top-50 margin-bottom-30"
                    v-model="val2"
                    v-bind="formData"
                ></vSlider>
                {{ val }}{{ val2 }}
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
            val: [30, 60],
            val2: 10,
            marks: [
                {
                    value: "10%",
                    label: "0°C",
                },
                {
                    value: "50%",
                    label: "0°C",
                    render: (h) => {
                        return <span>test-render </span>
                    },
                },
            ],
        }
    },
    methods: {},
    computed: {
        getCode() {
            return `<vSlider v-model="val" v-bind="formData"></vSlider>`
        },
        getBase() {
            return [
                {
                    label: "禁用滑块",
                    key: "disabled",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "提示显示控制",
                    key: "showTooltip",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "只读模式",
                    key: "readonly",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "最小值",
                    key: "min",
                    tag: "vInputNumber",
                    default: 0,
                },
                {
                    label: "最大值",
                    key: "max",
                    tag: "vInputNumber",
                    default: 100,
                },
                {
                    label: "步长",
                    key: "step",
                    tag: "vInputNumber",
                    default: 0,
                },
                {
                    label: "主题",
                    key: "theme",
                    tag: "vSelect",
                    default: "",
                    options: this.getThemes,
                },
            ]
        },
        compProps() {
            return [
                {
                    explain: "禁用滑块",
                    prop: "disabled",
                    type: "Boolean",
                    default: false,
                },
                {
                    explain: "提示显示控制",
                    prop: "showTooltip",
                    type: "Boolean",
                    default: true,
                },
                {
                    explain: "只读模式",
                    prop: "readonly",
                    type: "Boolean",
                    default: false,
                },
                {
                    explain: "最小值",
                    prop: "min",
                    type: "Number",
                    default: 0,
                },
                {
                    explain: "最大值",
                    prop: "max",
                    type: "Number",
                    default: 100,
                },
                {
                    explain: "步长",
                    prop: "step",
                    type: "Number",
                    default: 0,
                },
                {
                    explain: "主题颜色可选值为 gray、primary、dashed、text、info、success、warning、error",
                    prop: "theme",
                    type: "String",
                    default: "",
                },
                {
                    prop: "on-change",
                    explain: "在松开滑动时触发，返回当前的选值，在滑动过程中不会触发",
                    type: "Function",
                    default: "-",
                },
                // {
                // 	prop: "on-input",
                // 	explain: "滑动条数据变化时触发，返回当前的选值，在滑动过程中实时触发",
                // 	type: "Function",
                // 	default: "-"
                // }
            ]
        },
    },
}
</script>
