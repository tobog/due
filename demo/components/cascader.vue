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
            <vCascader
                class="margin-bottom-20"
                v-model="value1"
                v-bind="config.Cascader"
                :data="data"
                :popperConfig="config.PopperConfig"
            >
                <template v-slot="{data, index}">
                    <span>{{ data.data.label }}{{ index }}</span>
                </template>
            </vCascader>
            <div class="margin-bottom-20">Caspanel面板</div>
            <vCaspanel
                class="margin-bottom-20"
                :data="data"
                :asyncData="asyncData"
                v-bind="config.Caspanel"
            ></vCaspanel>
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
                    disabled: true,
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
                    value: "beijing2",
                    label: "北京2",
                    children: [
                        {
                            value: "gugong1",
                            label: "故宫",
                            disabled: true,
                        },
                        {
                            value: "tiantan1",
                            label: "天坛",
                        },
                        {
                            value: "wangfujing1",
                            label: "王府井",
                        },
                        {
                            value: "gugong2",
                            label: "故宫1",
                            disabled: true,
                        },
                        {
                            value: "tiantan2",
                            label: "天坛1",
                        },
                        {
                            value: "wangfujing2",
                            label: "王府井1",
                        },
                        {
                            value: "gugong3",
                            label: "故宫2",
                            disabled: true,
                        },
                        {
                            value: "tiantan3",
                            label: "天坛3",
                        },
                        {
                            value: "wangfujing3",
                            label: "王府井4",
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
        }
    },
    methods: {
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
                    ])
                }, 3000)
            })
        },
    },
    computed: {
        getCode() {
            return `<Cascader
                        class="margin-bottom-20"
                        v-model="value1"
                        v-bind="config.Cascader"
                        :data="data"
                        :popperConfig="config.PopperConfig"
                    >
                        <template v-slot="{data, index}">
                            <span>{{ data.data.label }}{{ index }}</span>
                        </template>
                    </Cascader>
                    <Caspanel
                        class="margin-bottom-20"
                        :data="data"
                        :asyncData="asyncData"
                        v-bind="config.Caspanel"
                    ></Caspanel>
					`
        },
        getConfig() {
            return {
                Cascader: {
                    data: this.getCascaderCofnig,
                },
                PopperConfig: {
                    data: this.getPopperConfig,
                },
                Caspanel: {
                    data: this.getCaspanelConfig,
                },
            }
        },
        getCascaderCofnig() {
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
                    demoDefault: true,
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
                    label: "选择模式",
                    key: "selection",
                    tag: "vSelect",
                    demoDefault: "none",
                    explain: "选择模式",
                    dataType: "String",
                    default: "none",
                    options: ["single", "multiple", "none", "lastMultiple", "lastSingle"],
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
                    label: "form 表单名称",
                    key: "name",
                    explain: "form 表单名称",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "动态获取数据",
                    key: "asyncData",
                    explain: "动态获取数据，数据源需标识",
                    dataType: "Function",
                    default: "-",
                },
                {
                    label: "继承",
                    key: "$attrs",
                    explain: "继承input attrs",
                    dataType: "Object",
                    default: "-",
                },
                {
                    showConfig: true,
                    label: "头部图标",
                    key: "prefix",
                    tag: "vSelect",
                    default: void 0,
                    demoDefault: "",
                    explain: "继承input: prefix|slot:prefix 输入框头部图标",
                    dataType: "Number|VNode",
                    options: this.iconslist,
                },
                {
                    showConfig: true,
                    label: "尾部图标",
                    key: "suffix",
                    tag: "vSelect",
                    default: void 0,
                    demoDefault: "",
                    explain: "继承input:  suffix|slot:suffix输入框尾部图标",
                    dataType: "Number|VNode",
                    options: this.iconslist,
                },
                {
                    label: "输入框外头部",
                    key: "scoped:prepend",
                    explain: "输入框外头部组件",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "自定义级联label",
                    key: "scoped:default",
                    explain: "自定义级联label渲染",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "自定义输入框外尾部",
                    key: "slots:append",
                    explain: "输入框外尾部组件",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "自定义多选tag",
                    key: "scoped:tag",
                    explain: "继承input: 自定义 tag渲染",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "下拉组件配置",
                    key: "popperConfig",
                    explain: "下拉组件配置，熟悉继承DropBase组件",
                    dataType: "Object",
                    default: "-",
                },
                {
                    label: "没有数据提示文案",
                    key: "noDataText",
                    explain: "没有数据时提示文案",
                    dataType: "String",
                    default: "无匹配数据",
                },
                {
                    label: "已选项的数据",
                    key: "data:value",
                    explain: "绑定value",
                    dataType: "Any",
                    default: "-",
                },
                {
                    label: "显示文字",
                    key: "data:label",
                    explain: "显示文字",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "数据键对映射",
                    key: "propsMap",
                    explain: "数据键值对映射关系，identifier 和 parentId 一起使用,自动生成树结构,无需自己处理; ",
                    dataType: "Object",
                    default: `{
                        label: "label",
                        value: "value",
                        identifier: "id",
                        parentKey: "parentId",
                    }`,
                },
                {
                    label: "渲染函数",
                    key: "render",
                    explain: "自定义渲染函数",
                    dataType: "Function",
                    default: "(h,{data,ctx,index})=>{}",
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
            ]
        },
        // Caspanel 面板
        getCaspanelConfig() {
            return [
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
                    showConfig: true,
                    label: "选择模式",
                    key: "selection",
                    tag: "vSelect",
                    demoDefault: "none",
                    explain: "选择模式",
                    dataType: "String",
                    default: "none",
                    options: ["single", "multiple", "none", "lastMultiple", "lastSingle"],
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
                    label: "已选项的数据",
                    key: "data:value",
                    explain: "绑定value",
                    dataType: "Any",
                    default: "-",
                },
                {
                    label: "显示文字",
                    key: "data:label",
                    explain: "显示文字",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "数据键对映射",
                    key: "propsMap",
                    explain: "数据键值对映射关系，identifier 和 parentId 一起使用,自动生成树结构,无需自己处理; ",
                    dataType: "Object",
                    default: `{
                        label: "label",
                        value: "value",
                        identifier: "id",
                        parentKey: "parentId",
                    }`,
                },
                {
                    label: "自定义渲染",
                    key: "slot",
                    explain: "自定义渲染子元素",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "渲染函数",
                    key: "render",
                    explain: "自定义渲染函数",
                    dataType: "Function",
                    default: "(h,{data,ctx,index})=>{}",
                },
                {
                    label: "事件",
                    key: "on-async",
                    explain: "异步加载数据时触发",
                    dataType: "Function",
                    default: "(value)=>{}",
                },
                {
                    label: "事件",
                    key: "input",
                    explain: "值变化触发",
                    dataType: "Function:Event",
                    default: "(values)=>{}",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "值变化触发",
                    dataType: "Function:Event",
                    default: "(selectedNodeList)=>{}",
                },
                {
                    label: "事件",
                    key: "on-check-change",
                    explain: "选着时触发",
                    dataType: "Function",
                    default: "(val, node, selectedNodeList)=>{}",
                },
            ]
        },
    },
}
</script>
