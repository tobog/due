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
        // DropBase 属性
        getPopperConfig() {
            return [
                {
                    showConfig: true,
                    label: "开启css3",
                    key: "gpu",
                    demoDefault: false,
                    explain: "开启css3样式加速",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "显示箭头",
                    key: "showArrow",
                    demoDefault: false,
                    explain: "是否显示箭头",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
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
                    label: "下拉框偏移",
                    key: "offset",
                    demoDefault: 5,
                    explain: "下拉框偏移位置",
                    dataType: "String, Number",
                    tag: "vInputNumber",
                    default: 5,
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
                // {
                //     showConfig: true,
                //     label: "下拉框样式",
                //     key: "dropStyle",
                //     demoDefault: "",
                //     explain: "自定义下拉框样式",
                //     dataType: "Object, String",
                //     tag: "vTextarea",
                //     default: "",
                // },
                {
                    showConfig: true,
                    label: "下拉框class 名称",
                    key: "dropClass",
                    demoDefault: "",
                    explain: "自定义下拉class 名称",
                    dataType: "Object, String，Array",
                    tag: "vTextarea",
                    default: "",
                },
            ];
        },
    },
};
</script>
