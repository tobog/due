<style lang="scss"></style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (ColorPicker，Color 颜色选择器)</h2>
            <h4 class="padding-top-10">将用于颜色选择，支持多种颜色格式</h4>
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
                <vColor v-model="value" v-bind="this.formData"></vColor>
                <vColorPicker v-model="value" v-bind="this.formData"></vColorPicker>
                <div :style="{ background: value, height: '30px' }">
                    {{ value }}
                </div>
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
    data() {
        return {
            value: "red",
        };
    },
    created() {
        setTimeout(() => {
            this.value = "green";
        }, 5000);
    },
    computed: {
        getCode() {
            return `<vColor v-model="value" v-bind="${this.getCodeString(this.formData)}"></vColor>
                    <vColorPicker v-model="value" v-bind="this.formData"></vColorPicker>
                    `;
        },
        getBase() {
            return [
                {
                    label: "是否有alpha",
                    key: "alpha",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "预定义颜色",
                    key: "predefined",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "是否将弹层放置于 body 内",
                    key: "transfer",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "自动关闭",
                    key: "autoClose",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "是否禁用",
                    key: "disabled",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "预定义颜色",
                    key: "size",
                    tag: "vInput",
                    default: "",
                },
                {
                    label: "格式",
                    key: "type",
                    tag: "vSelect",
                    options: ["rgb", "hex", "hsl", "hsv"],
                },
            ];
        },
        compProps() {
            return [
                {
                    explain: "可以使用 v-model 双向绑定数据",
                    prop: "value",
                    type: "String",
                    default: "",
                },
                {
                    prop: "disabled",
                    explain: "是否禁用",
                    type: "Boolean",
                    default: "fasle",
                },
                {
                    prop: "alpha",
                    explain: "是否支持透明度选择",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "type",
                    explain: "颜色的格式，可选值为 hsl、hsv、hex、rgb",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "autoClose",
                    explain: "是否支持确认",
                    type: "Boolean",
                    default: "true",
                },
                {
                    prop: "size",
                    explain: "尺寸，可选值为large、small、default或者不设置,以及数字",
                    type: "String, Number",
                    default: "-",
                },
                {
                    prop: "predefined",
                    explain: "是否显示推荐的颜色预设	",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "transfer",
                    explain:
                        "是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果",
                    type: "String, Number",
                    default: "-",
                },
                {
                    prop: "on-change",
                    explain: "on-change",
                    type: "Function:value=>{}",
                    default: "-",
                },
                {
                    prop: "on-confirm",
                    explain: "on-confirm",
                    type: "Function:value=>{}",
                    default: "-",
                },
                {
                    prop: "on-cancel",
                    explain: "on-cancel",
                    type: "Function:value=>{}",
                    default: "-",
                },
                {
                    prop: "on-active-change",
                    explain: "面板中当前显示的颜色发生改变时触发",
                    type: "Function:value=>{}",
                    default: "-",
                },
                {
                    prop: "on-visible-change",
                    explain: "下拉框展开或收起时触发",
                    type: "Function:value=>{}",
                    default: "-",
                },
            ];
        },
    },
};
</script>
