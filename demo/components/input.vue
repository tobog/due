<style lang="scss">
.demo-row {
    margin-bottom: 5px;
    background-image: linear-gradient(90deg, #f5f5f5 50%, transparent 0, transparent 100%);
    background-size: 8.333333333333334% 100%;
}
.demo-col {
    color: #fff;
    padding: 30px 0;
    text-align: center;
    font-size: 18px;
    background: rgba(0, 153, 229, 0.3);
}
.demo-col:nth-child(2n) {
    background: rgba(0, 153, 229, 0.7);
}
.demo-grid > .demo-col {
    padding: 0;
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Input 输入框)</h2>
            <h4 class="padding-top-10">
                基本表单组件，支持 input 和 textarea，并在原生控件基础上进行了功能扩展，可以组合使用。
            </h4>
        </template>
        <template v-slot="config">
            <vOptions :options="opts" v-bind="config" v-model="val"> </vOptions>
            <vInput class="margin-bottom-20" v-bind="config" v-model="val">
                <vOption value="ghost">ghost2</vOption>
                <vOption value="dashed">dashed1</vOption>
            </vInput>
            <!-- <vInput class="margin-bottom-20" v-model="val2" v-bind="config">
                <span slot="prepend">http://</span>
                <vInput v-model="val4" slot="append" theme="primary"></vInput>
            </vInput>
            <vInput class="margin-bottom-20" v-bind="config" type="number"></vInput> -->
            <div class="padding-15">{{ val }}-{{ val1 }}-{{ val2 }}-{{ val3 }}</div>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            label: "label",
            val: "",
            val1: "",
            val2: "",
            val3: "",
            val4: "",
            show1: true,
            opts: [],
        };
    },
    created() {
        for (let index = 0; index < 1000; index++) {
            this.opts.push({
                label: index,
                value: index,
            });
        }
    },
    computed: {
        getCode() {
            return `
					`;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "禁用状态",
                    key: "disabled",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "禁用状态",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "清空按钮",
                    key: "clearable",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "清空按钮",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "Drop置body下",
                    key: "transfer",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否将下拉置于 body 内",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "搜索",
                    key: "filterable",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否支持搜索",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "自动关闭",
                    key: "autoClose",
                    tag: "vSwitch",
                    demoDefault: 5,
                    explain: "非多选下自动关闭",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "多选",
                    key: "multiple",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否支持多选",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "只读",
                    key: "readonly",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否只读",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "键盘操作",
                    key: "keyModal",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "是否键盘操作",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "头部图标",
                    key: "prefix",
                    tag: "vSelect",
                    default: "person",
                    demoDefault: "",
                    explain: "prefix|slot:prefix 输入框头部图标",
                    dataType: "Number|VNode",
                    options: this.iconslist,
                },
                {
                    showConfig: true,
                    label: "尾部图标",
                    key: "suffix",
                    tag: "vSelect",
                    default: "person",
                    demoDefault: "",
                    explain: "suffix|slot:suffix输入框尾部图标",
                    dataType: "Number|VNode",
                    options: this.iconslist,
                },
                {
                    showConfig: true,
                    label: "类型",
                    key: "type",
                    tag: "vSelect",
                    default: "text",
                    demoDefault: 5,
                    explain:
                        "输入框类型，可选值为 button,checkbox,color,date,datetime,datetime-local,month,week,time,email,file,hidden,image,number,password,radio,range,reset,search,submit,tel,text,url",
                    dataType: "String",
                    options: this.getFormTypes,
                },
                {
                    showConfig: true,
                    label: "主题",
                    key: "theme",
                    tag: "vSelect",
                    default: "",
                    demoDefault: "",
                    explain: "主题",
                    dataType: "String",
                    options: this.getThemes,
                },
                {
                    showConfig: true,
                    label: "无数据提示",
                    key: "tip",
                    tag: "vInput",
                    default: "暂无数据",
                    demoDefault: "暂无数据",
                    explain: "无数据提示",
                    dataType: "String",
                },
                {
                    key: "multipleKey",
                    explain: "当mutiple=true下,渲染的取值key，type=file时默认multipleKey=name",
                    dataType: "String",
                    default: "-",
                },
                {
                    key: "type",
                    explain:
                        "输入框类型，可选值为 button,checkbox,color,date,datetime,datetime-local,month,week,time,email,file,hidden,image,number,password,radio,range,reset,search,submit,tel,text,url",
                    dataType: "String",
                    default: "",
                },
                {
                    key: "name",
                    explain: "表单name",
                    dataType: "String",
                    default: "",
                },
                {
                    key: "value",
                    explain: "绑定的值，可使用 v-model 双向绑定",
                    dataType: "String|Number|Array",
                    default: "",
                },
                {
                    key: "$attrs",
                    explain: "继承$attrs",
                    dataType: "object",
                    default: "-",
                },

                {
                    key: "dropStyle",
                    explain: "给浮层添加额外的 Style 名称",
                    dataType: "Object, String",
                    default: "",
                },

                {
                    key: "search",
                    explain: "否显示为搜索型输入框",
                    dataType: "Boolean",
                    default: "false",
                },
                {
                    key: "slots:prepend",
                    explain: "输入框外头部组件",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    key: "slots:append",
                    explain: "输入框外尾部组件",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    key: "on-change",
                    explain: "数据改变时触发事件",
                    dataType: "Function:(val,__attachData)=>{}",
                    default: "-",
                },
                {
                    key: "on-attach",
                    explain: "数据改变时触发事件,获取附属数据",
                    dataType: "Function:(val,__attachData)=>{}",
                    default: "-",
                },
                {
                    key: "on-icon-click",
                    explain: "点击图标时触发事件",
                    dataType: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    key: "on-focus",
                    explain: "输入框聚焦时触发事件",
                    dataType: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    key: "on-blur",
                    explain: "输入框失去焦点时触事件",
                    dataType: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    key: "on-enter",
                    explain: "按下回车键时触发事件",
                    dataType: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    key: "on-visible-change",
                    explain: "Drop下拉变化触发事件",
                    dataType: "Function:val=>{}",
                    default: "-",
                },
                {
                    key: "on-search",
                    explain: "点击搜索或按下回车键时触发事件：search",
                    dataType: "Function:val=>{}",
                    default: "-",
                },
                {
                    key: "on-remove-item",
                    explain: "点击清空按钮时触发事件：search",
                    dataType: "Function:(val,index)=>{}",
                    default: "-",
                },
                {
                    key: "on-clear",
                    explain: "点击清除触发事件",
                    dataType: "Function",
                    default: "-",
                },
            ];
        },
    },
};
</script>
