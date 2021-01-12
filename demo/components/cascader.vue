<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Cascader 级联选择|Caspanel 级联面板)|</h2>
            <h4 class="padding-top-10">
                从一组相关联的数据集合中进行选择，常用于省市区、公司级层、事务分类等。相比 Select
                组件，可以一次性完成选择，体验更好。
                <div>
                    级联选择是级联面板(Caspanel)和输入框(InputBase)一起组合的组件,属性继承了这两个组件
                </div>
            </h4>
        </template>
        <template v-slot="config">
            <div class="margin-bottom-20">{{ value1 }}</div>
            <vCascader class="margin-bottom-20" v-bind="config" :data="data" v-model="value1">
                <template v-slot="{ data, index }">
                    <span>{{ data.data.label }}{{ index }}</span>
                </template>
            </vCascader>

            <vCascader class="margin-bottom-20" :data="data" :asyncData="asyncData" :render="renderfn"></vCascader>
            <div class="margin-bottom-20">Caspanel面板</div>
            <vCaspanel class="margin-bottom-20" :data="data" :asyncData="asyncData" :render="renderfn"></vCaspanel>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value1: ["jiangsu", "suzhou", "shizilin"],
            data: [
                {
                    value: "beijing",
                    label: "北京",
                    children: [
                        {
                            value: "gugong",
                            label: "故宫",
                        },
                        {
                            value: "tiantan",
                            label: "天坛",
                        },
                        {
                            value: "wangfujing",
                            label: "王府井",
                        },
                    ],
                },
                {
                    value: "beijing",
                    label: "北京",
                    disabled: true,
                    children: [
                        {
                            value: "gugong",
                            label: "故宫",
                            disabled: true,
                        },
                        {
                            value: "tiantan",
                            label: "天坛",
                        },
                        {
                            value: "wangfujing",
                            label: "王府井",
                        },
                    ],
                },
                {
                    value: "jiangsu",
                    label: "江苏",
                    children: [
                        {
                            value: "nanjing",
                            label: "南京",
                            children: [
                                {
                                    value: "fuzimiao",
                                    label: "夫子庙",
                                },
                            ],
                        },
                        {
                            value: "suzhou",
                            label: "苏州",
                            children: [
                                {
                                    value: "zhuozhengyuan",
                                    label: "拙政园",
                                },
                                {
                                    value: "shizilin",
                                    label: "狮子林",
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        renderfn(h, { data, index }) {
            return (
                <span>
                    {data.data.label}
                    {index}
                </span>
            );
        },
        async asyncData() {
            return new Promise((a, b) => {
                setTimeout(() => {
                    a([
                        {
                            value: "gugong",
                            label: "故宫",
                        },
                        {
                            value: "tiantan",
                            label: "天坛",
                        },
                        {
                            value: "wangfujing",
                            label: "王府井",
                        },
                    ]);
                }, 3000);
            });
        },
    },
    computed: {
        getCode() {
            return `<Cascader 
                        v-bind=CODE 
                        :data="data" 
                        v-model="value1" 
                        :asyncData="asyncData">
                    </Cascader>
                    <Caspanel :data="data" :asyncData="asyncData" :render="renderfn" ></Caspanel>
					`;
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "置于body下",
                    key: "transfer",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否将弹层放置于 body 内",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "禁用",
                    key: "disabled",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否禁用",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "支持清除",
                    key: "clearable",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否支持清除",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "仅读",
                    key: "readonly",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否仅读",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "支持折叠",
                    key: "collapse",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否支持折叠",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "支持搜索",
                    key: "filterable",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否支持搜索",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "显示层级",
                    key: "showAllLevels",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "是否显示层级",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "自动关闭",
                    key: "autoClose",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否自动关闭",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "主题颜色",
                    key: "theme",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "主题颜色",
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
                    label: "输入搜索类型",
                    key: "filterType",
                    tag: "vSelect",
                    demoDefault: "default",
                    explain: "输入搜索类型",
                    dataType: "String",
                    default: "default",
                    options: ["default", "flat"],
                },
                {
                    showConfig: true,
                    label: "选择模式",
                    key: "selection",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "选择模式",
                    dataType: "String",
                    default: "",
                    options: ["single", "multiple", "none"],
                },

                {
                    showConfig: true,
                    label: "菜单展开方式",
                    key: "trigger",
                    tag: "vSelect",
                    demoDefault: "click",
                    explain: "次级菜单展开方式，可选值为 click 或 hover",
                    dataType: "String",
                    default: "click",
                    options: ["click", "hover"],
                },
                {
                    label: "菜单展开方式",
                    key: "Caspanel:trigger",
                    tag: "vSelect",
                    demoDefault: "click",
                    explain: "次级菜单展开方式，可选值为 click 或 hover",
                    dataType: "String",
                    default: "click",
                    options: ["click", "hover"],
                },
                {
                    label: "选择模式",
                    key: "Caspanel:selection",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "选择模式",
                    dataType: "String",
                    default: "",
                    options: ["single", "multiple", "none"],
                },
                {
                    label: "主题颜色",
                    key: "Caspanel:theme",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "主题颜色",
                    dataType: "String",
                    default: "",
                    options: this.getThemes,
                },
                {
                    label: "尺寸大小",
                    key: "Caspanel:size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),medium,large,或者设置具体数值",
                    dataType: "String | Number",
                    default: "",
                    options: this.getSize,
                },
                {
                    label: "form 表单名称",
                    key: "name",
                    explain: "form 表单名称",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "动态获取数据",
                    key: "Caspanel:asyncData|Cascader:asyncData",
                    explain: "动态获取数据，数据源需标识",
                    dataType: "Function",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-visible-change",
                    explain: "展开和关闭弹窗时触发",
                    dataType: "Function:Event",
                    default: "()=>{}",
                },
                {
                    label: "继承",
                    key: "$attrs",
                    explain: "继承input attrs",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "已选项的数据",
                    key: "Caspanel:(data:value)|Cascader:(data:value)",
                    explain: "绑定value",
                    dataType: "Any",
                    default: "-",
                },
                {
                    label: "显示文字",
                    key: "Caspanel:(data:label)|Cascader:(data:label)",
                    explain: "显示文字",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "渲染函数",
                    key: "Caspanel:(data:render|render)|Cascader:(data:render|render)",
                    explain: "自定义渲染函数",
                    dataType: "Function",
                    default: "(h,{data,ctx,index})=>{}",
                },
                {
                    label: "渲染函数",
                    key: "Caspanel:renderFlat|Cascader:renderFlat",
                    explain: "搜索过滤时自定义渲染函数",
                    dataType: "Function",
                    default: "(h,{data,ctx,index})=>{}",
                },
                {
                    label: "唯一标识",
                    key: "Caspanel:identifier|Cascader:identifier",
                    explain: "和parentId 一起使用,自动生成树结构,无需自己处理",
                    dataType: "String",
                    default: "id",
                },
                {
                    label: "关联唯一标识",
                    key: "Caspanel:parentId|Cascader:parentId",
                    explain: "和 identifier 一起使用,自动生成树结构,无需自己处理",
                    dataType: "String",
                    default: "parentId",
                },
                {
                    label: "继承Input属性",
                    key: "props",
                    explain: "继承Input属性,prefix,suffix,readonly,name,等等",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "失去焦点变化触发",
                    dataType: "Function:Event",
                    default: "(value,event)=>{}",
                },
                {
                    label: "事件",
                    key: "on-focus",
                    explain: "获取焦点触发",
                    dataType: "Function:Event",
                    default: "(value,event)=>{}",
                },
                {
                    label: "事件",
                    key: "on-blur",
                    explain: "失去焦点触发",
                    dataType: "Function:Event",
                    default: "(value,event)=>{}",
                },
                {
                    label: "事件",
                    key: "input",
                    explain: "值变化触发",
                    dataType: "Function:Event",
                    default: "(value)=>{}",
                },
                {
                    label: "事件",
                    key: "on-visible-change",
                    explain: "drop显示消失变化触发",
                    dataType: "Function:Event",
                    default: "(val)=>{}",
                },
                {
                    label: "事件",
                    key: "on-clear",
                    explain: "清除时触发",
                    dataType: "Function:Event",
                    default: "()=>{}",
                },
                {
                    label: "事件",
                    key: "on-remove-item",
                    explain: "移除一个时触发",
                    dataType: "Function:Event",
                    default: "()=>{}",
                },
                {
                    label: "自定义渲染",
                    key: "Caspanel:slot|Cascader:slot",
                    explain: "自定义渲染子元素",
                    dataType: "VNode",
                    default: "-",
                },
            ];
        },
    },
};
</script>
