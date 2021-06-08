<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (ColorPicker，Color 颜色选择器)</h2>
            <h4 class="padding-top-10">将用于颜色选择，支持多种颜色格式</h4>
        </template>
        <template v-slot="config">
            <div class="flex align-cener" :style="{ background: value, height: '100px' }">
                {{ value }}
            </div>
            <vColor v-model="value" v-bind="config.Color"></vColor>
            <vColorPicker
                v-model="value"
                v-bind="config.ColorPicker"
                :popperConfig="config.PopperConfig"
            ></vColorPicker>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value: "0",
        };
    },
    methods: {},
    computed: {
        getCode() {
            return `<Color v-model="value" v-bind="config.Color"></Color>
                    <ColorPicker
                        v-model="value"
                        v-bind="config.ColorPicker"
                        :popperConfig="config.PopperConfig"
                    ></ColorPicker>
                    `;
        },
        getConfig() {
            return {
                Color: {
                    data: this.getColorCofnig,
                },
                ColorPicker: {
                    data: this.getColorPickerConfig,
                },
                PopperConfig: {
                    data: this.getPopperConfig,
                },
            };
        },
        getColorCofnig() {
            return [
                {
                    showConfig: true,
                    label: "是否有alpha",
                    key: "alpha",
                    demoDefault: true,
                    explain: "是否有alpha",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "预定义颜色",
                    key: "predefined",
                    demoDefault: true,
                    explain: "是否显示推荐的颜色预设	",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),medium,large",
                    dataType: "String",
                    default: "",
                    options: this.getSize,
                },
                {
                    showConfig: true,
                    label: "格式",
                    key: "type",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "颜色的格式，可选值为 hsl、hsv、hex、rgb",
                    dataType: "String",
                    default: "",
                    options: ["rgb", "hex", "hsl", "hsv"],
                },
                {
                    label: "当前值",
                    key: "value",
                    demoDefault: "",
                    explain: "v-model(on-change) 双向绑定",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "自定义颜色预设",
                    key: "colors",
                    demoDefault: "",
                    explain: "自定义颜色预设,仅在predefined为true时",
                    dataType: "Array",
                    default: "",
                },
                {
                    label: "事件",
                    key: "on-copy",
                    explain: "复制成功时触发",
                    dataType: "Function",
                    default: "value=>{}",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "v-model(on-change) 双向绑定",
                    dataType: "Function：Event",
                    default: "value=>{}",
                },
            ];
        },
        getColorPickerConfig() {
            return [
                {
                    showConfig: true,
                    label: "弹层位置",
                    key: "transfer",
                    demoDefault: false,
                    explain:
                        "是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "自动关闭",
                    key: "autoClose",
                    demoDefault: false,
                    explain: "是否自动关闭",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "是否禁用",
                    key: "disabled",
                    demoDefault: false,
                    explain: "是否是否禁用",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),medium,large",
                    dataType: "String",
                    default: "",
                    options: this.getSize,
                },
                ...this.getColorCofnig,
                {
                    label: "下拉组件配置",
                    key: "popperConfig",
                    explain: "下拉组件配置，熟悉继承DropBase组件",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-confirm",
                    explain: "点击确认触发",
                    dataType: "Function：Event",
                    default: "value=>{}",
                },
                {
                    label: "事件",
                    key: "on-cancel",
                    explain: "点击取消触发",
                    dataType: "Function：Event",
                    default: "()=>{}",
                },
                {
                    label: "事件",
                    key: "on-active-change",
                    explain: "面板中当前显示的颜色发生改变时触发",
                    dataType: "Function：Event",
                    default: "value=>{}",
                },
                {
                    label: "事件",
                    key: "on-visible-change",
                    explain: "下拉框展开或收起时触发",
                    dataType: "Function：Event",
                    default: "(visible)=>{}",
                },
            ];
        },
    },
};
</script>
